# Detective Sigma: Case Generator Architecture

## Overview

The Case Generator is a narrative-first system that creates cohesive, educational mystery cases. It generates interconnected stories where characters, evidence, puzzles, and scenes all work together to form a rich detective experience.

## System Architecture

```
                    GenerationRequest
                          │
                          ▼
                 ┌────────────────────┐
                 │    generator.ts    │ ◄── Main Orchestrator
                 │  generateCase()    │
                 └────────┬───────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
┌─────────────────┐ ┌───────────────┐ ┌───────────────────┐
│narrative-engine │ │character-web  │ │ evidence-chain    │
│                 │ │               │ │                   │
│ • 5 Scenarios   │ │ • Characters  │ │ • Initial Clues   │
│ • Crime Details │ │ • Dialogues   │ │ • Discovered      │
│ • Timeline      │ │ • Relations   │ │ • Conclusive      │
│ • Motive/Method │ │ • Alibis      │ │ • Red Herrings    │
└────────┬────────┘ └───────┬───────┘ └─────────┬─────────┘
         │                  │                   │
         └──────────────────┼───────────────────┘
                            │
                            ▼
                  ┌───────────────────┐
                  │  story-puzzles    │
                  │                   │
                  │ • Initial Phase   │
                  │ • Investigation   │
                  │ • Conclusion      │
                  │ • Revelations     │
                  └─────────┬─────────┘
                            │
                            ▼
                  ┌───────────────────┐
                  │ image-generator   │
                  │                   │
                  │ • Scene Prompts   │
                  │ • Portraits       │
                  │ • Evidence Photos │
                  │ • Reality Check   │
                  └───────────────────┘
```

## Components

### 1. Generator (`generator.ts`)

**Entry Point:** `generateCase(request: GenerationRequest)`

The main orchestrator that coordinates all subsystems. By default, uses the narrative engine (`useNarrativeEngine !== false`).

**Key Functions:**
- `generateCase()` - Main entry point
- `generateNarrativeDrivenCase()` - Narrative-first generation
- `narrativeToGeneratedCase()` - Converts narrative data to case format
- `saveGeneratedCase()` - Persists to database

**Helper Functions:**
- `inferEthnicityFromCharacter(name)` - Determines ethnicity from name patterns
- `inferGenderFromCharacter(name)` - Determines gender from name patterns

### 2. Narrative Engine (`narrative-engine.ts`)

**Purpose:** Generates the core story, crime details, and timeline.

**5 Story Scenarios:**

| ID | Setting | Crime Types |
|----|---------|-------------|
| canteen-mystery | School Canteen | theft, fraud |
| library-case | School Library | vandalism, theft |
| science-lab | Science Laboratory | sabotage |
| sports-event | Sports Field/Gym | cheating, sabotage |
| market-mystery | Neighborhood Market | theft, fraud |

**Each Scenario Includes:**
- Setting with location, description, time of day
- Crime details with type, method, crime window
- Culprit profile with motive (type, description, backstory), method, mistakes
- 3-4 suspect roles with alibis
- Timeline events (key events and discoverable events)

**Key Types:**
```typescript
interface NarrativeCase {
  id: string;
  title: string;
  setting: CaseSetting;
  crime: CrimeDetails;
  culprit: CulpritProfile;
  timeline: TimelineEvent[];
  narrativeHook: string;
  resolution: string;
}
```

### 3. Character Web (`character-web.ts`)

**Purpose:** Generates interconnected characters with relationships, dialogue, and alibis.

**Singapore Name Pools:**
- Chinese names (e.g., Tan Ah Kow, Lim Mei Ling)
- Malay names (e.g., Ahmad bin Ismail, Siti Aminah)
- Indian names (e.g., Rajesh Kumar, Priya Devi)
- Eurasian names (e.g., David Pereira, Sarah Santos)

**Dialogue Trees (8+ nodes per character):**
- `greeting` - Initial contact
- `alibi` - Where they were during the crime
- `relationship_[targetId]` - About other suspects
- `observation` - What they saw/heard
- `timeline` - Timeline of events
- `evidence_[evidenceId]` - When shown evidence
- `accusation` - When accused
- `confession` (guilty only) - When confronted with proof

**Emotions per Dialogue:**
- `calm`, `nervous`, `defensive`, `helpful`, `evasive`, `angry`

**Relationships:**
- `friendly`, `neutral`, `tense`, `hostile`, `professional`, `family`

### 4. Evidence Chain (`evidence-chain.ts`)

**Purpose:** Creates logical evidence progressions organized by discovery phase.

**Evidence Phases:**

| Phase | Purpose | Evidence Types |
|-------|---------|----------------|
| Initial | Discovered at crime scene | 2-3 clues, including one misleading |
| Discovered | Found through investigation | 2-3 supporting clues |
| Conclusive | Final proof of guilt | 1-2 critical clues |

**Evidence Importance:**
- `critical` - Essential to solve the case
- `important` - Strongly supports solution
- `supporting` - Helps investigation
- `misleading` - Red herring

**Evidence Types:**
- `physical` - Tangible items (fingerprint, footprint, torn fabric)
- `documentary` - Documents (receipt, note, schedule)
- `testimonial` - Witness statements
- `digital` - Electronic evidence (CCTV, phone records)

**Key Fields per Evidence:**
- `visualCue` - What player sees initially
- `analysisResult` - What detailed analysis reveals
- `discoveryMethod` - How to find this clue
- `pointsToGuilty` - Whether it implicates the culprit

### 5. Story Puzzles (`story-puzzles.ts`)

**Purpose:** Integrates puzzles into the narrative with story revelations.

**Puzzle Phases:**

| Phase | When | Complexity | Purpose |
|-------|------|------------|---------|
| Initial | Scene examination | Lower | Discover first clues |
| Investigation | Verify alibis | Medium | Check suspect stories |
| Conclusion | Final proof | Higher | Prove guilt |

**Revelations (unlocked by solving):**
- `evidence` - Uncovers key evidence
- `alibi_check` - Verifies or breaks an alibi
- `timeline` - Narrows crime window
- `motive` - Reveals character's motive
- `confession_clue` - Final proof for confrontation

**Complexity Mapping by Difficulty:**
```
ROOKIE:     initial=BASIC,      investigation=STANDARD,    conclusion=STANDARD
INSPECTOR:  initial=STANDARD,   investigation=STANDARD,    conclusion=CHALLENGING
DETECTIVE:  initial=STANDARD,   investigation=CHALLENGING, conclusion=CHALLENGING
CHIEF:      initial=CHALLENGING,investigation=CHALLENGING, conclusion=EXPERT
```

### 6. Image Generator (`image-generator.ts`)

**Purpose:** Creates story-accurate image prompts for Stable Diffusion.

**Image Types:**

| Type | Resolution | Use |
|------|------------|-----|
| Cover | 1024x1024 | Case folder cover |
| Scene | 1920x1080 / 1024x768 | Location images |
| Suspect | 768x1024 / 512x768 | Character portraits |
| Evidence | 1024x1024 / 768x768 | Clue photographs |

**Models Used:**
- `realisticVisionV60B1_v51VAE` - Realistic Vision V6.0 B1

**Singapore Context:**
- Tropical architecture (HDB, void decks, covered walkways)
- Multi-ethnic representation
- Local settings (hawker centres, neighbourhood parks)
- Appropriate clothing by role

**Reality Validation:**
The system includes `validatePromptReality()` and `sanitizePromptForReality()` to ensure:
- No fantasy/supernatural elements
- Physically possible scenarios
- Singapore-appropriate content
- Age-role consistency

### 7. Readable Text System (`CrimeSceneOverlays.tsx`)

**Purpose:** Since AI cannot generate readable text, React components overlay text on images.

**Overlay Components:**
- `PoliceTape` - "CRIME SCENE DO NOT CROSS"
- `EvidenceMarker` - Numbered evidence markers (1, 2, 3...)
- `EvidenceTag` - Case number, item number, date, type
- `ForensicRuler` - Measurements for physical evidence
- `ClassifiedStamp` - "CLASSIFIED" stamp

**Data Flow:**
```
GeneratedCase.caseId → GamePage → SceneViewer/ClueModal → Overlay Components
                                   ↓
                         caseNumber prop: "DS-XXXXXX"
                         evidenceNumber prop: 1, 2, 3...
```

## Generation Request

```typescript
interface GenerationRequest {
  difficulty: 'ROOKIE' | 'INSPECTOR' | 'DETECTIVE' | 'CHIEF';
  subject: 'MATH' | 'SCIENCE' | 'INTEGRATED';
  gradeLevel: 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6';
  puzzleComplexity: 'BASIC' | 'STANDARD' | 'CHALLENGING' | 'EXPERT';
  useSyllabus: boolean;        // Use MOE 2025 curriculum
  useNarrativeEngine: boolean; // Default: true
  topicIds?: string[];         // Specific topics to cover
  constraints?: {
    excludeThemes?: string[];
    requiredSkills?: string[];
    estimatedMinutes?: number;
    minPuzzles?: number;
  };
}
```

## Generated Case Output

```typescript
interface GeneratedCase {
  caseId: string;
  title: string;
  briefing: string;
  metadata: {
    difficulty: string;
    gradeLevel: string;
    subjectFocus: string;
    estimatedMinutes: number;
    puzzleComplexity: string;
    syllabusTopicsCovered?: string[];
    learningObjectives?: string[];
  };
  story: {
    setting: string;
    crime: string;
    resolution: string;
    timeline?: TimelineEvent[];
    crimeWindow?: { start: string; end: string };
    culpritProfile?: {
      motive: { type: string; description: string; backstory: string };
      method: string;
      mistakes: string[];
    };
  };
  suspects: Suspect[];       // With dialogueTree and relationships
  clues: Clue[];             // With visualCue and analysisResult
  puzzles: Puzzle[];         // With narrativeContext and revelation
  scenes: Scene[];
  evidenceChain?: {
    mainPath: string[];      // Ordered evidence IDs to solve case
    criticalCount: number;
  };
  puzzlePhases?: {
    initial: string[];
    investigation: string[];
    conclusion: string[];
  };
  imageRequests?: {
    cover: ImageRequest;
    scenes: ImageRequest[];
    suspects: ImageRequest[];
    evidence: ImageRequest[];
  };
}
```

## Puzzle Counts by Difficulty

| Difficulty | Puzzle Count | Est. Time |
|------------|--------------|-----------|
| ROOKIE | 4-6 | 15-25 min |
| INSPECTOR | 6-10 | 25-45 min |
| DETECTIVE | 8-15 | 40-60 min |
| CHIEF | 10-20 | 60-90 min |

## Narrative Flow

```
1. INITIAL PHASE
   └── Player arrives at crime scene
   └── Discovers initial evidence
   └── Solves 1 puzzle → Reveals first clue

2. INVESTIGATION PHASE
   └── Interviews suspects (dialogue trees)
   └── Examines evidence (visualCue → analysisResult)
   └── Solves 2-3 puzzles → Verifies alibis, uncovers motive

3. CONCLUSION PHASE
   └── Confronts suspect with evidence
   └── Solves final puzzle → Confirms guilt
   └── Culprit confession based on evidence collected
```

## Integration Points

### With Curriculum (`syllabus.ts`)
- Puzzles aligned to Singapore MOE 2025 curriculum
- Topics tracked per grade level
- Learning objectives recorded in case metadata

### With Database (Prisma)
- Cases saved with `saveGeneratedCase()`
- Scenes, suspects, puzzles created as related records
- Image URLs stored after generation

### With Game UI
- `SceneViewer` receives scene data + caseNumber
- `ClueModal` receives clue data + evidenceNumber
- Overlay components add readable text

## File Locations

```
app/lib/case-generator/
├── generator.ts           # Main orchestrator
├── narrative-engine.ts    # Story/scenario generation
├── character-web.ts       # Character relationships
├── evidence-chain.ts      # Evidence logic
├── story-puzzles.ts       # Narrative puzzles
├── puzzle-generator.ts    # Unique puzzle math
├── image-generator.ts     # AI image prompts
├── types.ts               # TypeScript interfaces
├── templates.ts           # Static templates (legacy)
├── syllabus.ts            # MOE 2025 curriculum
├── curriculum-puzzles.ts  # Syllabus-aligned puzzles
└── learning-tracker.ts    # Student progress

app/components/game/
├── CrimeSceneOverlays.tsx # Readable text overlays
├── SceneViewer.tsx        # Scene display
├── ClueModal.tsx          # Clue examination
└── PuzzleModal.tsx        # Puzzle solving

app/lib/services/
└── image-generation-service.ts # Image generation API
```

## Best Practices

1. **Always use narrative engine** - Set `useNarrativeEngine: true` (default) for cohesive stories
2. **Match puzzle complexity to difficulty** - Use the automatic phase-based complexity mapping
3. **Pass full context to images** - Include visualCue, emotion, crimeType for accurate prompts
4. **Use overlay system for text** - Never expect AI to generate readable text
5. **Validate reality** - Use `validatePromptReality()` before generating images

## API Usage Example

```typescript
import { generateCase } from './lib/case-generator/generator';

const request = {
  difficulty: 'INSPECTOR',
  subject: 'MATH',
  gradeLevel: 'P5',
  puzzleComplexity: 'STANDARD',
  useSyllabus: true,
  useNarrativeEngine: true,
  constraints: {
    estimatedMinutes: 30,
    minPuzzles: 6,
  },
};

const generatedCase = await generateCase(request);
// generatedCase now contains full case data with:
// - Cohesive narrative
// - Interconnected characters with dialogues
// - Evidence chain
// - Story-integrated puzzles
// - Image generation prompts
```

---

## Scalability System (v3.0)

The case generator includes a **scalable module system** designed to generate **1,000,000+ unique storylines**.

### Scalable Module Architecture

```
app/lib/case-generator/scalable/
├── index.ts              # Integration & stats
├── location-templates.ts # 45+ locations
├── crime-types.ts        # 56+ crime types
├── evidence-templates.ts # 200+ evidence types
├── puzzle-contexts.ts    # 100+ puzzle contexts
├── procedural-names.ts   # Procedural name generator
└── motive-system.ts      # 50+ motive templates
```

### Component Statistics

| Component | Count | Variations Per Item | Total Combinations |
|-----------|-------|---------------------|-------------------|
| Locations | 45+ | 4 descriptions × 4 times × 5 atmospheres | 3,600+ |
| Crimes | 56+ | 4 descriptions × 4 impacts × 5 motives | 4,480+ |
| Evidence | 200+ | 4 descriptions × 4 analyses × 3 discoveries | 9,600+ |
| Puzzle Contexts | 100+ | 4 intros × 4 framings × 3 revelations | 4,800+ |
| Character Names | 12,000+ | 3 ages × 48 personality combos | 1,700,000+ |
| Motives | 50+ | 3 descriptions × 4 backstories | 600+ |

### Scalability Calculation

**Conservative Estimate (with realistic constraints):**
```
45 locations × 56 crimes × 50 evidence combos × 20 puzzle combos × 24,000 names × 5 motives
= 7.56 × 10^12 (7.56 trillion unique storylines)
```

**Practical Unique Storylines:** Even with heavy deduplication and compatibility filtering, the system can generate **billions of unique storylines** - far exceeding the 1 million target.

### Location Categories

| Category | Count | Examples |
|----------|-------|----------|
| School | 10+ | Classroom, Canteen, Library, Science Lab, Computer Lab, Staff Room |
| Commercial | 15+ | Hawker Centre, Convenience Store, Shopping Mall, Wet Market |
| Residential | 10+ | HDB Void Deck, Corridor, Playground |
| Public | 10+ | MRT Station, Bus Interchange, Community Centre, Library |

### Crime Categories

| Category | Count | Examples |
|----------|-------|----------|
| Theft | 15 | Cash theft, Equipment theft, Phone theft, Document theft |
| Fraud | 12 | Accounting fraud, Identity fraud, Exam fraud, Refund fraud |
| Vandalism | 10 | Graffiti, Property damage, Vehicle vandalism |
| Sabotage | 8 | Food tampering, Equipment sabotage, Project sabotage |
| Cheating | 6 | Plagiarism, Score manipulation, Sports cheating |
| Missing | 5 | Missing pet, Missing keys |

### Evidence Categories

| Category | Count | Examples |
|----------|-------|----------|
| Physical | 80+ | Fingerprints, Footprints, Fibers, Tools, Damage |
| Documentary | 60+ | Receipts, Notes, Schedules, Contracts |
| Digital | 40+ | CCTV, Phone data, Computer logs, Messages |
| Testimonial | 30+ | Eyewitness, Alibi, Expert opinion, Confession |

### Procedural Name Generation

Names are generated procedurally by combining:
- **Ethnicities:** Chinese, Malay, Indian, Eurasian
- **First Names:** 50+ per ethnicity per gender
- **Surnames:** 30+ per ethnicity
- **Result:** 12,000+ unique name combinations

With personality traits (48 combinations) and age groups (3), this yields **1.7+ million unique characters**.

### Motive Categories

| Category | Count | Examples |
|----------|-------|----------|
| Financial | 15 | Debt, Greed, Lifestyle, Gambling, Business failure |
| Personal | 15 | Revenge, Jealousy, Rejection, Pride |
| Professional | 10 | Competition, Career advancement, Cover-up |
| Emotional | 5 | Anger, Fear |
| Circumstantial | 5 | Opportunity, Coercion, Accident |

### Using the Scalable System

```typescript
import { generateScalableScenario, SCALABILITY_STATS, verifyScalability } from './lib/case-generator/scalable';

// Check scalability stats
console.log(SCALABILITY_STATS.displayStats);

// Verify target is met
const verification = verifyScalability();
console.log(verification.targetMet ? '✓ Exceeds 1 Million' : '✗ Below target');

// Generate a unique scenario
const scenario = generateScalableScenario();
console.log(scenario.storylineHash); // Unique identifier
```

### Storyline Hash

Each generated scenario includes a unique `storylineHash` based on:
- Location ID
- Crime ID
- Culprit name
- Time of day
- Evidence IDs

This ensures storyline uniqueness and allows tracking of generated content.

---

*Last Updated: December 2024*
*Version: 3.0 - Scalable Storyline System*
