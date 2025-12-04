# Case Generator Service - Implementation Status

## ✅ Completed Components

### Core Infrastructure
- [x] Project structure (package.json, tsconfig, .env.example)
- [x] Fastify server with CORS and rate limiting
- [x] Configuration system with multi-provider AI support
- [x] Logging system (Pino with pretty printing)
- [x] Type definitions for all data structures

### API Layer
- [x] POST `/api/generate` - Request case generation (returns job ID)
- [x] GET `/api/status/:jobId` - Check generation status
- [x] GET `/api/case/:caseId` - Retrieve generated case (placeholder)
- [x] POST `/api/validate` - Validate uniqueness (placeholder)
- [x] DELETE `/api/job/:jobId` - Cancel pending job
- [x] GET `/api/stats` - Queue statistics
- [x] GET `/health` - Health check endpoint

### Queue System
- [x] Bull queue integration with Redis
- [x] Job processing with progress tracking
- [x] Event handlers (completed, failed, stalled)
- [x] Graceful shutdown
- [x] Concurrency limiting (5 concurrent by default)

### Generation Pipeline
- [x] **Orchestrator**: Coordinates entire generation process with progress updates
- [x] **Story Generator**: 
  - Template-based generation with 50+ variations
  - 6 template categories (canteen, library, science lab, sports, market, community)
  - AI-powered generation with OpenAI
  - Hybrid mode (template + AI enhancement)
- [x] **Suspects Generator**:
  - Template-based with Singapore names
  - AI-powered character generation with Claude
  - Personality traits, alibis, motives
- [x] **Puzzles Generator**:
  - Math puzzles (calculations, time analysis, patterns)
  - Science puzzles (observations, deductions)
  - Difficulty-scaled (3-6 puzzles based on level)
  - AI-powered custom puzzle generation
- [x] **Clues Generator**:
  - Critical clues (linked to guilty suspect)
  - Supporting clues (general evidence)
  - Red herrings (misleading clues)
  - 5-7 clues per case
- [x] **Scenes Generator**:
  - 3 scenes per case (main area, back room, interview room)
  - Interactive elements mapping
  - Clue distribution across scenes
- [x] **Assets Generator**:
  - ComfyUI prompt generation for all assets
  - Cover image, scene backgrounds, suspect portraits, clue images
  - Detailed metadata for each asset

### AI Integration
- [x] **OpenAI Adapter**: GPT-4 for quality generation
- [x] **Claude Adapter**: Claude Sonnet for creative characters
- [x] **Ollama Adapter**: Local LLM support for cost-free generation
- [x] **Adapter Factory**: Auto-fallback system (OpenAI → Claude → Ollama)
- [x] Error handling and logging for all adapters

### Validation System
- [x] **Uniqueness Validator**:
  - Fingerprinting system (SHA-256 hashing)
  - Structure, character, puzzle, location hashes
  - Combined hash for collision detection
  - Database query placeholder for checking existing cases
- [x] **Quality Validator**:
  - Suspect count validation (min 2, exactly 1 guilty)
  - Puzzle validation (min 3, must have questions/answers)
  - Clue validation (min 2 critical clues)
  - Scene validation (min 2 scenes)
  - Content appropriateness check (no violence/weapons/death)
  - Metadata validation (time estimates, uniqueness score)
  - Configurable thresholds (MIN_UNIQUENESS_SCORE=0.85)

## ⏳ Pending Implementation

### Database Integration
- [ ] Prisma schema for GeneratedCase, GenerationJob, UniquenessFingerprint
- [ ] Database migrations
- [ ] CRUD operations for storing/retrieving cases
- [ ] Uniqueness checking against existing fingerprints
- [ ] Job persistence and recovery

### ComfyUI Integration
- [ ] API client for triggering workflows
- [ ] Workflow templates for different asset types
- [ ] Asset upload and storage
- [ ] Progress tracking for asset generation

### Testing
- [ ] Unit tests for generators
- [ ] Integration tests (generate 100 cases, verify uniqueness)
- [ ] Load tests (concurrent requests)
- [ ] Quality tests (educational objectives met)

### Deployment
- [ ] Docker configuration
- [ ] Environment-specific configs (dev/staging/prod)
- [ ] CI/CD pipeline
- [ ] Monitoring and alerting

## 🚀 Quick Start

### 1. Install Dependencies
```powershell
cd case-generator-service
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and configure:
```bash
PORT=4000
DATABASE_URL=your_neon_postgres_url
REDIS_URL=redis://localhost:6379

# At least one AI provider required
OPENAI_API_KEY=your_openai_key
# ANTHROPIC_API_KEY=your_anthropic_key
# OLLAMA_URL=http://localhost:11434

MAX_CONCURRENT_GENERATIONS=5
MIN_UNIQUENESS_SCORE=0.85
```

### 3. Start Redis (if local)
```powershell
# Using Docker
docker run -d -p 6379:6379 redis:alpine

# Or install Redis locally
```

### 4. Run Development Server
```powershell
npm run dev
```

Server starts on `http://localhost:4000`

### 5. Test Generation
```powershell
# Request case generation
curl -X POST http://localhost:4000/api/generate `
  -H "Content-Type: application/json" `
  -d '{
    "difficulty": "ROOKIE",
    "subject": "MATH",
    "gradeLevel": "P4",
    "preferences": {
      "strategy": "hybrid",
      "culturalContext": "singapore"
    }
  }'

# Check status (use jobId from above response)
curl http://localhost:4000/api/status/<jobId>

# View queue stats
curl http://localhost:4000/api/stats
```

## 📊 Generation Strategies

### Template (30-60 seconds)
- Uses pre-built story templates with variations
- Fast and reliable
- Good for bulk generation
- Moderate uniqueness

### AI-Driven (2-5 minutes)
- Fully AI-generated from scratch
- Highest uniqueness
- Best quality and creativity
- Slower and more expensive

### Hybrid (Recommended, 1-2 minutes)
- Template as foundation
- AI enhancement for uniqueness
- Balanced speed vs. quality
- Default strategy

## 🎯 Next Steps

1. **Immediate**: Set up PostgreSQL database and create Prisma schema
2. **Short-term**: Implement database persistence and uniqueness checks
3. **Medium-term**: Integrate ComfyUI for actual asset generation
4. **Long-term**: Connect to main Detective Sigma app and create teacher UI

## 🔧 Architecture Notes

- **Queue-based**: Handles async generation without blocking
- **Multi-provider AI**: Automatic fallback if one provider fails
- **Modular**: Each generator is independent and testable
- **Extensible**: Easy to add new story templates or generation strategies
- **Resilient**: Retry logic, error handling, graceful degradation

## 📝 Generated Case Structure

```typescript
{
  caseId: "case-abc123",
  title: "The Mysterious Money Disappearance",
  briefing: "Student-facing introduction...",
  metadata: {
    difficulty: "ROOKIE",
    gradeLevel: "P4",
    subjectFocus: "MATH",
    estimatedMinutes: 45,
    uniquenessScore: 0.92,
    generationStrategy: "hybrid"
  },
  story: { setting, crime, resolution },
  suspects: [...],  // 2-5 suspects, 1 guilty
  clues: [...],     // 5-7 clues (critical, supporting, red-herrings)
  puzzles: [...],   // 3-6 puzzles (grade-appropriate)
  scenes: [...],    // 2-4 investigation scenes
  assets: {         // ComfyUI prompts for all visuals
    cover, scenes, suspects, clues
  },
  fingerprint: {    // Uniqueness hashing
    combinedHash: "sha256..."
  }
}
```
