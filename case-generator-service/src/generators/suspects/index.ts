import { GenerationRequest, Suspect } from '../../types';
import { StoryOutput } from '../story';
import { createGeneratorLogger } from '../../utils/logger';
import { getAIAdapter } from '../../ai/adapter-factory';

const logger = createGeneratorLogger('suspects');

export async function generateSuspects(
  request: GenerationRequest,
  story: StoryOutput,
  strategy: 'template' | 'ai' | 'hybrid'
): Promise<Suspect[]> {
  logger.info({ strategy, location: story.location }, 'Generating suspects');

  const characterCount = request.constraints?.characterCount || 3;

  if (strategy === 'template' || strategy === 'hybrid') {
    return generateFromTemplate(request, story, characterCount);
  } else {
    return generateWithAI(request, story, characterCount);
  }
}

function generateFromTemplate(
  request: GenerationRequest,
  story: StoryOutput,
  count: number
): Suspect[] {
  const personalities = [
    ['nervous', 'helpful', 'detail-oriented'],
    ['confident', 'evasive', 'charming'],
    ['quiet', 'observant', 'honest'],
    ['friendly', 'talkative', 'forgetful'],
    ['serious', 'organized', 'defensive'],
  ];

  const roles = [
    'Staff Member',
    'Student',
    'Teacher',
    'Vendor',
    'Security Guard',
    'Cleaner',
    'Administrator',
  ];

  const suspects: Suspect[] = [];
  const guiltyIndex = Math.floor(Math.random() * count);

  for (let i = 0; i < count; i++) {
    const firstName = generateName();
    const lastName = generateSingaporeanSurname();
    const role = roles[i % roles.length];
    const personality = personalities[i % personalities.length];
    const isGuilty = i === guiltyIndex;

    suspects.push({
      id: `suspect-${i + 1}`,
      name: `${firstName} ${lastName}`,
      role,
      alibi: generateAlibi(role, story.location, isGuilty),
      personality,
      isGuilty,
      motive: isGuilty ? generateMotive(request.subject) : undefined,
    });
  }

  logger.info({ count: suspects.length, guiltyIndex }, 'Generated suspects from template');

  return suspects;
}

async function generateWithAI(
  request: GenerationRequest,
  story: StoryOutput,
  count: number
): Promise<Suspect[]> {
  const adapter = getAIAdapter('claude'); // Use Claude for character creativity

  const prompt = `
Generate ${count} suspects for a detective case with the following context:

**Story**: ${story.title}
**Location**: ${story.location}
**Crime**: ${story.crime}
**Grade Level**: ${request.gradeLevel}
**Cultural Context**: Singapore

Create diverse, age-appropriate characters. Exactly ONE should be guilty.

For each suspect, provide:
- Name (culturally appropriate for Singapore)
- Role (relationship to the location)
- Alibi (what they claim they were doing)
- Personality traits (3 adjectives)
- Whether they are guilty (true/false for only one)
- Motive (only if guilty)

Return ONLY a valid JSON array of suspect objects:
[
  {
    "id": "suspect-1",
    "name": "...",
    "role": "...",
    "alibi": "...",
    "personality": ["...", "...", "..."],
    "isGuilty": false,
    "motive": null
  },
  ...
]
  `.trim();

  const response = await adapter.generateCompletion(prompt, { temperature: 0.8 });
  const suspects = JSON.parse(response);

  logger.info({ count: suspects.length }, 'Generated suspects with AI');

  return suspects;
}

function generateName(): string {
  const names = ['Wei', 'Raj', 'Siti', 'David', 'Priya', 'Ahmad', 'Mei', 'Kumar', 'Sarah', 'Alex'];
  return names[Math.floor(Math.random() * names.length)];
}

function generateSingaporeanSurname(): string {
  const surnames = ['Tan', 'Lim', 'Lee', 'Ng', 'Singh', 'Kumar', 'Rahman', 'Wong', 'Chen', 'Ong'];
  return surnames[Math.floor(Math.random() * surnames.length)];
}

function generateAlibi(role: string, location: string, isGuilty: boolean): string {
  if (isGuilty) {
    return `I was busy with my duties at ${location}. Everything seemed normal to me.`;
  }
  
  const alibis = [
    `I was in the staff room preparing for the day.`,
    `I was helping other students/customers in a different area.`,
    `I was on my break and didn't see anything unusual.`,
    `I was doing inventory in the storage room.`,
    `I was cleaning the premises as per my schedule.`,
  ];
  
  return alibis[Math.floor(Math.random() * alibis.length)];
}

function generateMotive(subject: string): string {
  const motives = {
    MATH: 'Needed money to pay for an important expense and thought no one would notice the discrepancy.',
    SCIENCE: 'Wanted to sabotage a competitor\'s experiment to improve their own chances of winning.',
    INTEGRATED: 'Made a mistake and tried to cover it up to avoid getting in trouble.',
  };
  
  return motives[subject as keyof typeof motives] || motives.INTEGRATED;
}
