# Detective Sigma - Case Generator Microservice

AI-powered procedural case generation system for creating infinite unique detective mysteries.

## 🎯 Core Capabilities

### 1. **Procedural Case Generation**
- Unique storylines using combinatorial templates
- Dynamic suspect generation with personalities
- Math/Science puzzle integration
- Singapore school context adaptation

### 2. **Variation Systems**
- Story templates (theft, mystery, science experiment gone wrong, etc.)
- Location rotation (canteen, library, lab, playground, classroom)
- Character archetypes with randomized traits
- Puzzle difficulty scaling

### 3. **Quality Assurance**
- Duplicate detection (prevents same case twice)
- Educational objective validation
- Age-appropriateness checking
- Logical consistency verification

## 🏛️ Architecture

```
case-generator-service/
├── src/
│   ├── api/                    # Express/Fastify API
│   ├── generators/             # Core generation logic
│   │   ├── story/              # Storyline generation
│   │   ├── suspects/           # Character generation
│   │   ├── clues/              # Evidence generation
│   │   ├── puzzles/            # Math/Science puzzles
│   │   └── assets/             # Asset prompt generation
│   ├── ai/                     # LLM integration
│   │   ├── prompts/            # Prompt templates
│   │   └── adapters/           # OpenAI, Claude, local LLM
│   ├── validators/             # Quality checks
│   ├── storage/                # Case database
│   └── utils/                  # Helpers
├── templates/                  # Base templates
├── config/                     # Configuration
└── tests/                      # Unit & integration tests
```

## 🧬 Generation Pipeline

```
1. PARAMETERS → 2. TEMPLATE → 3. AI ENHANCEMENT → 4. VALIDATION → 5. ASSET GEN → 6. OUTPUT
```

## 🔧 Tech Stack

**Backend:** Node.js + TypeScript + Fastify
**AI:** OpenAI GPT-4 / Claude / Ollama (local)
**Storage:** PostgreSQL + Redis cache
**Queue:** Bull/BullMQ for async generation
**Assets:** ComfyUI API integration

## 🚀 Quick Start

```bash
cd case-generator-service
npm install
npm run dev
```

## 📡 API Endpoints

### POST /api/generate
Generate a new case

**Request:**
```json
{
  "difficulty": "ROOKIE",
  "subject": "MATH",
  "gradeLevel": "P4",
  "constraints": {
    "excludeThemes": ["violence"],
    "requiredSkills": ["addition", "subtraction"],
    "estimatedMinutes": 30
  }
}
```

**Response:**
```json
{
  "caseId": "gen-abc123",
  "status": "generating",
  "estimatedTime": 120
}
```

### GET /api/status/:caseId
Check generation progress

### GET /api/case/:caseId
Retrieve generated case

### POST /api/validate
Validate a generated case before publishing

## 🎨 Generation Strategies

### Strategy 1: Template + Variation
- 50+ base templates
- Parametric variation system
- Fast generation (30-60s)

### Strategy 2: AI-Driven
- Full LLM generation
- High uniqueness
- Slower (2-5 min)

### Strategy 3: Hybrid
- Template structure + AI details
- Balance of speed & uniqueness
- Recommended approach

## 📊 Uniqueness Tracking

Uses fingerprinting to prevent duplicates:
- Story structure hash
- Character combination hash
- Puzzle type hash
- Location hash

Combined hash ensures <0.01% collision rate over 10K+ cases.

## 🔐 Security

- Rate limiting
- API key authentication
- Content filtering
- Duplicate prevention

## 📈 Scaling

- Horizontal scaling via containerization
- Queue-based async processing
- Caching frequently requested parameters
- Pre-generation of popular configurations
