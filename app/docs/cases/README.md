# Detective Sigma Case Catalog

Welcome to the Detective Sigma case library! This directory contains all educational mystery cases for primary school students.

## 📂 Directory Structure

```
cases/
├── case-001-sunrise-canteen-caper/
│   ├── briefing.md          # Story and mission
│   ├── metadata.json        # Configuration and learning objectives
│   ├── scenes.md            # Scene descriptions and progression
│   └── solution.md          # Teacher's guide (answers and assessment)
│
├── case-002-[next-case]/
│   └── ... (same structure)
│
└── README.md (this file)
```

## 📚 Available Cases

### Case 001: The Sunrise Canteen Caper
**Status:** ✅ Published  
**Difficulty:** Rookie (P4)  
**Subject:** Mathematics  
**Duration:** ~30 minutes  
**Skills:** Money calculations, timeline analysis, logical deduction  

**Synopsis:** $50 is missing from the school canteen strongbox. Three suspects had access after hours. Students must use math and detective work to solve the case.

**Learning Objectives:**
- Apply addition and subtraction with money
- Analyze data from receipts and logs
- Practice problem-solving with real-world scenarios
- Develop logical reasoning skills

[View Case →](./case-001-sunrise-canteen-caper/briefing.md)

---

### Case 002: [Coming Soon]
**Status:** 🚧 In Development  
**Difficulty:** TBD  
**Subject:** TBD  
**Duration:** TBD  

---

## 🎯 Difficulty Levels

| Level | Grade | Description |
|-------|-------|-------------|
| **Rookie** | P4 | Introduction to detective work with basic concepts |
| **Inspector** | P5 | Moderate complexity with multi-step reasoning |
| **Detective** | P6 | Advanced cases requiring synthesis of multiple concepts |
| **Chief** | Advanced | Challenge cases for gifted students |

## 📊 Subject Focus Areas

- **MATH** - Arithmetic, geometry, data analysis
- **SCIENCE** - Scientific method, observations, experiments
- **INTEGRATED** - Cross-curricular cases combining multiple subjects

## 🏗️ Creating New Cases

### Case Naming Convention
```
case-XXX-short-descriptive-name/
```
- XXX = 3-digit case number (001, 002, etc.)
- Use hyphens for spaces
- Keep name brief and descriptive

### Required Files
1. **briefing.md** - Student-facing story and mission
2. **metadata.json** - Configuration and learning data
3. **scenes.md** - Scene descriptions and clue placement
4. **solution.md** - Teacher's guide with answers

### Asset Organization
Assets stored in `/public/cases/case-XXX/`:
- `cover.jpg` - Case cover image
- `scenes/` - Location background images
- `clues/` - Evidence photographs/documents
- `suspects/` - Character portraits
- `evidence/` - Interactive item images

### Database Integration
Seed data stored in `/prisma/seed-data/case-XXX.json`

## 📝 Metadata Schema

Each case must include `metadata.json` with:
```json
{
  "caseId": "case-XXX",
  "title": "Case Title",
  "metadata": {
    "difficulty": "ROOKIE|INSPECTOR|DETECTIVE|CHIEF",
    "gradeLevel": "P4|P5|P6",
    "subjectFocus": "MATH|SCIENCE|INTEGRATED",
    "estimatedMinutes": 30,
    "status": "DRAFT|PUBLISHED"
  },
  "learning": {
    "primaryObjective": "...",
    "secondaryObjectives": [],
    "skillsAssessed": {},
    "vocabularyWords": []
  }
}
```

## ✅ Quality Checklist

Before publishing a case, ensure:
- [ ] All 4 required markdown files complete
- [ ] metadata.json validated and accurate
- [ ] All asset placeholders have specifications
- [ ] Solution guide includes full answer key
- [ ] Math/logic is age-appropriate
- [ ] Story is engaging and clear
- [ ] Learning objectives align with MOE syllabus
- [ ] No cultural insensitivity or bias
- [ ] Playtest completed by target age group
- [ ] Teacher review and approval

## 🔄 Case Lifecycle

1. **Draft** - Initial creation and internal review
2. **Playtest** - Testing with student focus group
3. **Review** - Teacher and curriculum specialist approval
4. **Published** - Live and available to students
5. **Updated** - Based on feedback and data analysis
6. **Archived** - Replaced or outdated (kept for reference)

## 📈 Analytics Tracking

For each published case, track:
- Completion rate
- Average completion time
- Score distribution
- Most common mistakes
- Student feedback ratings
- Teacher satisfaction scores

Use data to improve case design and difficulty calibration.

## 👥 Contributors

Cases developed by the Detective Sigma team with input from:
- Primary school teachers
- Education curriculum specialists
- Game designers
- Student playtesters

## 📞 Support

For case development questions or suggestions:
- Create an issue in the repository
- Contact the educational content team
- Review the case development guide (coming soon)

---

**Last Updated:** December 4, 2025  
**Total Cases:** 1 (Published), 0 (In Development)  
**Next Case Target:** Q1 2026
