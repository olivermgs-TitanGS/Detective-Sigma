import { GenerationRequest } from '../../types';
import { createGeneratorLogger } from '../../utils/logger';
import { getAIAdapter } from '../../ai/adapter-factory';
import { storyTemplates } from './templates';

const logger = createGeneratorLogger('story');

export interface StoryOutput {
  title: string;
  briefing: string;
  setting: string;
  crime: string;
  resolution: string;
  theme: string;
  location: string;
}

export async function generateStory(
  request: GenerationRequest,
  strategy: 'template' | 'ai' | 'hybrid'
): Promise<StoryOutput> {
  logger.info({ strategy }, 'Generating story');

  if (strategy === 'template') {
    return generateFromTemplate(request);
  } else if (strategy === 'ai') {
    return generateWithAI(request);
  } else {
    // Hybrid: use template as base, enhance with AI
    const baseStory = generateFromTemplate(request);
    return enhanceWithAI(baseStory, request);
  }
}

function generateFromTemplate(request: GenerationRequest): StoryOutput {
  const { difficulty, subject, gradeLevel } = request;
  const culturalContext = request.preferences?.culturalContext || 'singapore';
  
  // Filter templates by subject and difficulty
  const suitableTemplates = storyTemplates.filter(
    (t) =>
      t.subjects.includes(subject) &&
      t.difficulties.includes(difficulty) &&
      (t.culturalContext === culturalContext || t.culturalContext === 'any')
  );

  if (suitableTemplates.length === 0) {
    throw new Error(`No suitable templates found for ${subject} ${difficulty}`);
  }

  // Randomly select template
  const template = suitableTemplates[Math.floor(Math.random() * suitableTemplates.length)];

  // Apply variations
  const location = selectRandom(template.locations);
  const crime = selectRandom(template.crimes);
  const themeValue = selectRandom(template.themes);

  // Generate title
  const title = `The ${themeValue} ${crime.type}`;

  // Generate briefing
  const briefing = `
You are called to investigate a mysterious incident at ${location.name}. 
${crime.description}

Your task is to analyze the evidence, interview suspects, and use your ${subject.toLowerCase()} skills to solve this case.

Grade Level: ${gradeLevel}
Difficulty: ${difficulty}
Estimated Time: ${request.constraints?.estimatedMinutes || 45} minutes
  `.trim();

  logger.info({ template: template.id, location: location.name, crime: crime.type }, 'Generated story from template');

  return {
    title,
    briefing,
    setting: location.description,
    crime: crime.description,
    resolution: crime.solution,
    theme: themeValue,
    location: location.name,
  };
}

async function generateWithAI(request: GenerationRequest): Promise<StoryOutput> {
  const adapter = getAIAdapter('openai'); // Use OpenAI for quality
  
  const prompt = `
Generate a unique detective case story for an educational game with the following requirements:

- **Grade Level**: ${request.gradeLevel} (Primary 4-6, ages 10-12)
- **Subject Focus**: ${request.subject}
- **Difficulty**: ${request.difficulty}
- **Cultural Context**: ${request.preferences?.culturalContext || 'singapore'}
- **Estimated Time**: ${request.constraints?.estimatedMinutes || 45} minutes

${request.constraints?.excludeThemes ? `- **Exclude These Themes**: ${request.constraints.excludeThemes.join(', ')}` : ''}
${request.constraints?.requiredSkills ? `- **Must Include Skills**: ${request.constraints.requiredSkills.join(', ')}` : ''}

The story should:
1. Be age-appropriate and educational
2. Feature a clear mystery that can be solved using ${request.subject.toLowerCase()} skills
3. Include interesting characters and clues
4. Be set in a relatable Singapore context (school, neighborhood, community center, etc.)
5. Have a positive resolution that teaches problem-solving

Return ONLY a valid JSON object with this structure:
{
  "title": "engaging case title",
  "briefing": "student-facing introduction (2-3 paragraphs)",
  "setting": "detailed description of location",
  "crime": "description of the mystery/incident",
  "resolution": "how the case can be solved",
  "theme": "main theme (e.g., 'Missing', 'Mysterious', 'Curious')",
  "location": "specific location name"
}
  `.trim();

  const response = await adapter.generateCompletion(prompt, { temperature: 0.9 });
  const story = JSON.parse(response);

  logger.info({ title: story.title, theme: story.theme }, 'Generated story with AI');

  return story;
}

async function enhanceWithAI(baseStory: StoryOutput, request: GenerationRequest): Promise<StoryOutput> {
  const adapter = getAIAdapter('openai');

  const prompt = `
Enhance the following detective case story to make it more engaging and unique, while keeping the core structure:

**Current Story:**
- Title: ${baseStory.title}
- Location: ${baseStory.location}
- Crime: ${baseStory.crime}
- Theme: ${baseStory.theme}

**Requirements:**
- Grade Level: ${request.gradeLevel}
- Subject: ${request.subject}
- Difficulty: ${request.difficulty}
- Cultural Context: ${request.preferences?.culturalContext || 'singapore'}

**Instructions:**
1. Keep the location and core mystery type
2. Make the briefing more engaging with vivid details
3. Add unique twists that make this case memorable
4. Ensure it teaches ${request.subject.toLowerCase()} skills
5. Use Singapore context authentically

Return ONLY a valid JSON object with this structure:
{
  "title": "enhanced title",
  "briefing": "enhanced student-facing introduction",
  "setting": "enhanced location description",
  "crime": "enhanced mystery description",
  "resolution": "enhanced solution approach",
  "theme": "${baseStory.theme}",
  "location": "${baseStory.location}"
}
  `.trim();

  const response = await adapter.generateCompletion(prompt, { temperature: 0.7 });
  const enhancedStory = JSON.parse(response);

  logger.info({ title: enhancedStory.title }, 'Enhanced story with AI');

  return enhancedStory;
}

function selectRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
