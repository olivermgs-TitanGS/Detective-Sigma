-- Detective Academy Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  grade_level VARCHAR(10),
  school_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

-- Cases Table
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  difficulty VARCHAR(20) CHECK (difficulty IN ('Rookie', 'Inspector', 'Detective', 'Chief')),
  subject_focus VARCHAR(20) CHECK (subject_focus IN ('Math', 'Science', 'Integrated')),
  status VARCHAR(20) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published')),
  cover_image TEXT,
  briefing_video_url TEXT,
  master_clue_fragment TEXT,
  chapter_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Scenes Table
CREATE TABLE scenes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  is_initial_scene BOOLEAN DEFAULT FALSE,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Suspects Table
CREATE TABLE suspects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  image_url TEXT,
  bio TEXT,
  is_culprit BOOLEAN DEFAULT FALSE,
  dialogue_tree JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Clues Table
CREATE TABLE clues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  scene_id UUID REFERENCES scenes(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  content_revealed TEXT,
  is_hidden BOOLEAN DEFAULT FALSE,
  required_puzzle_id UUID,
  position_x DECIMAL(5,2),
  position_y DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Puzzles Table
CREATE TABLE puzzles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) CHECK (type IN ('math_word', 'science_inquiry', 'logic_cipher', 'pattern_recognition')),
  question_text TEXT NOT NULL,
  question_image TEXT,
  correct_answer VARCHAR(255) NOT NULL,
  hint TEXT,
  options JSONB,
  points INTEGER DEFAULT 10,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add foreign key constraint for puzzles in clues
ALTER TABLE clues ADD CONSTRAINT fk_clues_puzzle 
  FOREIGN KEY (required_puzzle_id) REFERENCES puzzles(id) ON DELETE SET NULL;

-- Progress Table
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'solved')),
  score INTEGER DEFAULT 0,
  clues_collected JSONB DEFAULT '[]',
  puzzles_solved JSONB DEFAULT '[]',
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, case_id)
);

-- Leaderboard View (materialized for performance)
CREATE MATERIALIZED VIEW leaderboard AS
SELECT 
  u.id,
  u.username,
  u.grade_level,
  COUNT(DISTINCT p.case_id) FILTER (WHERE p.status = 'solved') as cases_solved,
  SUM(p.score) as total_score,
  MAX(p.completed_at) as last_solved_at
FROM users u
LEFT JOIN progress p ON u.id = p.user_id
GROUP BY u.id, u.username, u.grade_level
ORDER BY total_score DESC, cases_solved DESC;

-- Indexes for performance
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_subject ON cases(subject_focus);
CREATE INDEX idx_scenes_case ON scenes(case_id);
CREATE INDEX idx_clues_case ON clues(case_id);
CREATE INDEX idx_clues_scene ON clues(scene_id);
CREATE INDEX idx_suspects_case ON suspects(case_id);
CREATE INDEX idx_puzzles_case ON puzzles(case_id);
CREATE INDEX idx_progress_user ON progress(user_id);
CREATE INDEX idx_progress_case ON progress(case_id);
CREATE INDEX idx_progress_status ON progress(status);

-- Refresh leaderboard function
CREATE OR REPLACE FUNCTION refresh_leaderboard()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW leaderboard;
END;
$$ LANGUAGE plpgsql;

-- Trigger to refresh leaderboard when progress is updated
CREATE OR REPLACE FUNCTION notify_leaderboard_change()
RETURNS trigger AS $$
BEGIN
  PERFORM refresh_leaderboard();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER progress_change_trigger
AFTER INSERT OR UPDATE ON progress
FOR EACH STATEMENT
EXECUTE FUNCTION notify_leaderboard_change();
