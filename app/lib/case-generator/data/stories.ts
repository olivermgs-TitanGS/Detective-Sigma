/**
 * STORY TEMPLATES AND NARRATIVE GENERATOR
 * Creates detailed, realistic storylines for cases
 */

// ============================================
// TYPES
// ============================================

export interface StoryTemplate {
  id: string;
  category: 'school' | 'community' | 'family' | 'event' | 'mystery';
  title: string;
  premise: string;
  backstoryTemplates: string[];
  incidentTemplates: string[];
  investigationHooks: string[];
  resolutionTemplates: string[];
  twistOptions: string[];
  ageAppropriate: boolean;
  gradeLevel: ('P4' | 'P5' | 'P6')[];
}

export interface CharacterBackstory {
  role: string;
  backgroundTemplates: string[];
  motivationTemplates: string[];
  relationshipTemplates: string[];
  alibiTemplates: string[];
  secretTemplates: string[];
}

export interface NarrativeArc {
  introduction: string;
  risingAction: string[];
  climax: string;
  resolution: string;
}

// ============================================
// SCHOOL STORY TEMPLATES
// ============================================

export const schoolStories: StoryTemplate[] = [
  {
    id: 'school-fundraiser',
    category: 'school',
    title: 'The Fundraiser Mystery',
    premise: 'Money collected during a school fundraiser has gone missing, threatening to cancel an important school event.',
    backstoryTemplates: [
      'For weeks, {class} had been working hard to raise money for {event}. Students sold {items} and organized {activity}. The target was ${amount}, and they were so close!',
      'The school\'s annual {event} was just around the corner. {class} took charge of the fundraiser, hoping to beat last year\'s record of ${amount}.',
      'Everyone was excited about {event}. The fundraising committee, led by {teacher}, had organized {activity} to collect donations.',
    ],
    incidentTemplates: [
      'On {day}, {discoverer} went to count the money in the {location}. To their shock, ${stolen} was missing from the collection!',
      'When {teacher} opened the cash box on {day} morning, their face went pale. The money they had counted the night before was gone.',
      'The money was supposed to be handed over to the school office on {day}. But when they checked, the {container} was almost empty.',
    ],
    investigationHooks: [
      'The {location} was locked, and only {count} people had keys.',
      'According to the logbook, {count} people accessed the room between {time1} and {time2}.',
      'Security footage shows the corridor, but the camera doesn\'t cover the {location} directly.',
      'A student reported seeing someone near the {location} during {event}.',
    ],
    resolutionTemplates: [
      '{culprit} finally confessed. They had taken the money because {motive}. They promised to return every cent.',
      'The investigation revealed that {culprit} was responsible. It turned out {revelation}.',
      'With all the clues pointing to {culprit}, they broke down and admitted {confession}.',
    ],
    twistOptions: [
      'The money was actually borrowed for an emergency, not stolen',
      'The culprit was trying to help someone in need',
      'There was a misunderstanding about where the money was kept',
      'The real amount was different from what was recorded',
    ],
    ageAppropriate: true,
    gradeLevel: ['P4', 'P5', 'P6'],
  },
  {
    id: 'school-science-fair',
    category: 'school',
    title: 'The Science Fair Sabotage',
    premise: 'A student\'s prize-winning science project has been tampered with just before the competition.',
    backstoryTemplates: [
      '{student} had spent three months building their science project on {topic}. It was the most ambitious project the school had ever seen.',
      'The Science Fair was the biggest event of the year. {student} was the favorite to win with their innovative project about {topic}.',
      'Competition was fierce this year. {student}\'s project on {topic} was revolutionary, and everyone knew it could win the national competition.',
    ],
    incidentTemplates: [
      'The morning before judging, {student} arrived to find their project completely ruined. {damage}.',
      'When the science lab opened on {day}, {teacher} discovered {student}\'s project had been tampered with overnight.',
      'Just hours before the judges arrived, someone had sabotaged the experiment. {damage}.',
    ],
    investigationHooks: [
      'Only {count} students had keys to the science lab.',
      'The janitor reported seeing the lab lights on at {time} the night before.',
      'A rival competitor was seen arguing with {student} earlier that week.',
      'Traces of {evidence} were found near the damaged project.',
    ],
    resolutionTemplates: [
      '{culprit} admitted to the sabotage. Jealousy had driven them to {action}. They apologized sincerely.',
      'It wasn\'t malice after all. {culprit} had accidentally caused the damage while {innocent_action}.',
      'The investigation uncovered that {culprit} was actually trying to {alternative_explanation}.',
    ],
    twistOptions: [
      'The sabotage was accidental - someone was trying to help',
      'The rival wasn\'t the culprit - they were being framed',
      'The project wasn\'t actually ruined, just modified',
      'Someone was protecting a secret about the project',
    ],
    ageAppropriate: true,
    gradeLevel: ['P5', 'P6'],
  },
  {
    id: 'school-lost-mascot',
    category: 'school',
    title: 'The Missing Mascot',
    premise: 'The school\'s beloved mascot costume has disappeared just days before the big Sports Day.',
    backstoryTemplates: [
      '{mascot_name} the {animal} had been the school mascot for {years} years. Every Sports Day, the mascot led the cheering and brought luck to the teams.',
      'The {mascot_name} costume was legendary. It had been worn by generations of students, and tradition said the school always won when {mascot_name} appeared.',
      'Sports Day was approaching, and everyone was excited to see {mascot_name} again. The costume was stored safely in the {location}—or so they thought.',
    ],
    incidentTemplates: [
      'When {teacher} went to retrieve the costume for rehearsal, the storage room was empty. {mascot_name} was gone!',
      '{student} was supposed to wear the costume for practice, but when they checked the {location}, it had vanished.',
      'The costume had been there on {day}. By {next_day}, it was nowhere to be found.',
    ],
    investigationHooks: [
      'The storage room showed no signs of forced entry.',
      'A student claimed to have seen someone carrying a large bag after school.',
      'The key to the storage room was supposed to be with {teacher}, but it was found elsewhere.',
      'Strange {color} fibers were found near the scene.',
    ],
    resolutionTemplates: [
      '{culprit} had taken the costume to {reason}. They never meant for anyone to worry.',
      'The mystery was solved when {culprit} returned the costume, explaining {explanation}.',
      'It turned out {culprit} had borrowed {mascot_name} for a special surprise for {event}.',
    ],
    twistOptions: [
      'The costume was taken to be repaired as a surprise',
      'Someone was preparing a special performance',
      'The mascot was "kidnapped" as a prank by a rival school',
      'An alumnus borrowed it for a reunion event',
    ],
    ageAppropriate: true,
    gradeLevel: ['P4', 'P5', 'P6'],
  },
  {
    id: 'school-library-mystery',
    category: 'school',
    title: 'The Library Book Mystery',
    premise: 'Rare books from the school library\'s special collection are going missing one by one.',
    backstoryTemplates: [
      'The school library had a Special Collection room with books donated by {donor}. Some were over {years} years old and irreplaceable.',
      '{librarian} had been the librarian for {years} years. The Special Collection was their pride—until books started disappearing.',
      'The library\'s rare books were used for special research projects. Only {count} students had permission to access them this term.',
    ],
    incidentTemplates: [
      'First, "{book1}" went missing. Then "{book2}". By the third disappearance, {librarian} knew something was very wrong.',
      'When {student} tried to borrow "{book}" for their project, it couldn\'t be found anywhere. It wasn\'t the first book to vanish.',
      'The inventory check revealed {count} books were missing from the Special Collection. Someone was taking them systematically.',
    ],
    investigationHooks: [
      'The borrowing records showed suspicious patterns.',
      'One book was spotted in a second-hand shop by a parent.',
      'A student was seen in the library during restricted hours.',
      'The pattern of missing books suggested someone with specific interests.',
    ],
    resolutionTemplates: [
      '{culprit} had been taking the books to {reason}. They thought no one would notice.',
      'The investigation revealed {culprit} was {explanation}.',
      '{culprit} returned all the books, explaining they had wanted to {reason}.',
    ],
    twistOptions: [
      'Books were being digitized and accidentally misplaced',
      'Someone was protecting books they thought weren\'t being cared for',
      'A teacher had borrowed them for a special class',
      'The books were moved for renovation and mislabeled',
    ],
    ageAppropriate: true,
    gradeLevel: ['P5', 'P6'],
  },
];

// ============================================
// COMMUNITY STORY TEMPLATES
// ============================================

export const communityStories: StoryTemplate[] = [
  {
    id: 'community-garden',
    category: 'community',
    title: 'The Community Garden Mystery',
    premise: 'Plants in the community garden are being damaged, and neighbors suspect each other.',
    backstoryTemplates: [
      'The community garden at {location} was a peaceful place where {count} families grew vegetables and flowers. Everyone worked hard to maintain it.',
      '{gardener} had tended Plot {number} for {years} years. Their {plant} was about to bloom for the first time when the trouble started.',
      'The garden was preparing for the annual competition. {count} plots were entered, and the prize was a feature in the local newsletter.',
    ],
    incidentTemplates: [
      'One morning, {gardener} found their prize {plants} trampled. By afternoon, two other plots had been damaged too.',
      'First it was just one plant. Then another. Someone was systematically destroying the best entries before the competition.',
      'Footprints in the soil, torn leaves, and broken stems—the evidence of vandalism was clear.',
    ],
    investigationHooks: [
      'The damage always happened between {time1} and {time2}.',
      'Neighbors had been arguing about water usage lately.',
      'A strange substance was found on the damaged plants.',
      'Someone had been complaining about the garden "attracting pests".',
    ],
    resolutionTemplates: [
      'The real culprit was unexpected: {revelation}. {culprit} apologized and offered to help restore the garden.',
      'It wasn\'t sabotage at all. {culprit} discovered that {explanation}.',
      'The community came together when they learned {revelation}.',
    ],
    twistOptions: [
      'Animals were the real culprits',
      'Someone was sleep-gardening (stress-related behavior)',
      'A child was "helping" by moving plants',
      'Water drainage issues caused the damage',
    ],
    ageAppropriate: true,
    gradeLevel: ['P4', 'P5', 'P6'],
  },
  {
    id: 'community-hawker',
    category: 'community',
    title: 'The Hawker Centre Secret',
    premise: 'A beloved hawker stall\'s secret recipe has been leaked, and sales are plummeting.',
    backstoryTemplates: [
      '{stallowner}\'s {dish} was famous across Singapore. The secret recipe had been in their family for {generations} generations.',
      'The {dish} at {stallname} was so popular that queues stretched for {length} during lunch. The secret? A special {ingredient}.',
      'For {years} years, {stallowner} had protected their recipe. Even their children didn\'t know all the ingredients.',
    ],
    incidentTemplates: [
      'A new stall opened three blocks away, selling {dish} that tasted almost identical. {stallowner} knew their secret had been stolen.',
      'Regular customers started asking why they bothered queuing when they could get "the same thing" elsewhere.',
      'When {stallowner} tasted the competitor\'s dish, their heart sank. Someone had betrayed their trust.',
    ],
    investigationHooks: [
      'Only {count} people had ever been in the kitchen.',
      'The new stall opened suspiciously soon after {event}.',
      'A food blogger claimed to have "cracked" the recipe online.',
      'Someone had been asking a lot of questions about the ingredients.',
    ],
    resolutionTemplates: [
      'The truth was more complex: {revelation}. In the end, {resolution}.',
      'It turned out that {culprit} had {explanation}. An apology was made.',
      'The investigation revealed {revelation}, and the community rallied behind {stallowner}.',
    ],
    twistOptions: [
      'The recipe wasn\'t actually stolen - someone recreated it independently',
      'A family member was trying to start their own version',
      'The "leak" was actually from an old cookbook',
      'Social media food detectives figured it out through videos',
    ],
    ageAppropriate: true,
    gradeLevel: ['P4', 'P5', 'P6'],
  },
];

// ============================================
// EVENT STORY TEMPLATES
// ============================================

export const eventStories: StoryTemplate[] = [
  {
    id: 'event-competition',
    category: 'event',
    title: 'The Competition Controversy',
    premise: 'The results of an important competition are being questioned after suspicious behavior is reported.',
    backstoryTemplates: [
      'The {competition} was the most prestigious event at {location}. Hundreds of participants competed for the {prize}.',
      'After months of preparation, {count} contestants gathered for the finals. The stakes were high: the winner would represent Singapore at {event}.',
      'The {competition} had a {years}-year history. This year, the competition was fiercer than ever.',
    ],
    incidentTemplates: [
      'When {contestant} was announced as the winner, someone shouted "They cheated!" The ceremony descended into chaos.',
      'Photos emerged showing {evidence} during the competition. Questions about the results erupted.',
      'A formal complaint was filed claiming {contestant} had received unfair help. The trophy presentation was postponed.',
    ],
    investigationHooks: [
      'Video footage from the event showed inconsistencies.',
      'Other contestants reported suspicious behavior during {event}.',
      'The scoring sheets had unusual markings.',
      'A judge was seen talking to a participant\'s family.',
    ],
    resolutionTemplates: [
      'After careful investigation, the truth emerged: {revelation}. The situation was resolved with {resolution}.',
      'The accusation was {outcome}. {contestant} was {result}, and {action_taken}.',
      'It was all a misunderstanding. {explanation}. The competition ended with {resolution}.',
    ],
    twistOptions: [
      'The accusation was based on a misunderstanding',
      'The accuser had made a mistake themselves',
      'Technical issues affected the scoring',
      'The "cheating" was actually legitimate strategy',
    ],
    ageAppropriate: true,
    gradeLevel: ['P5', 'P6'],
  },
];

// ============================================
// CHARACTER BACKSTORY TEMPLATES
// ============================================

export const characterBackstories: Record<string, CharacterBackstory> = {
  student: {
    role: 'Student',
    backgroundTemplates: [
      '{name} is known for being {trait1} and {trait2}. They\'ve been at the school for {years} years.',
      'Everyone knows {name} as the {reputation} of the class. They\'re particularly good at {skill}.',
      '{name} transferred from {previous_school} last year. They\'re still trying to fit in and make friends.',
    ],
    motivationTemplates: [
      'wanted to impress their parents who expected {expectation}',
      'needed money for {reason} and didn\'t know who else to ask',
      'was trying to help a friend who was in trouble',
      'felt pressured by {pressure_source} to succeed',
      'wanted to win so badly they made a bad decision',
    ],
    relationshipTemplates: [
      'best friends with {other_character}',
      'has been competing with {other_character} since Primary 1',
      'secretly looks up to {other_character}',
      'feels overshadowed by {other_character}',
    ],
    alibiTemplates: [
      'was at {activity} practice until {time}',
      'stayed back to help {teacher} with {task}',
      'went home early because of {reason}',
      'was working on {project} in the {location}',
    ],
    secretTemplates: [
      'is struggling with {subject} but too embarrassed to ask for help',
      'has been dealing with problems at home',
      'is worried about {worry} but doesn\'t want anyone to know',
      'saw something but is afraid to speak up',
    ],
  },
  teacher: {
    role: 'Teacher',
    backgroundTemplates: [
      '{name} has been teaching {subject} for {years} years. Students either love or fear their strict standards.',
      'Known for being {trait}, {name} runs the {activity} club and takes it very seriously.',
      '{name} joined the school just this year. They\'re eager to make a good impression.',
    ],
    motivationTemplates: [
      'was trying to protect a student from embarrassment',
      'made an honest mistake while managing {responsibility}',
      'was following instructions from {authority} without questioning',
      'thought they were doing the right thing for the school',
    ],
    relationshipTemplates: [
      'mentors {student} who shows promise in {subject}',
      'has disagreements with {other_teacher} about teaching methods',
      'is respected by most students, especially those in {activity}',
    ],
    alibiTemplates: [
      'was in a staff meeting until {time}',
      'went home right after {event} ended',
      'was supervising {activity} during that time',
      'claims to have been marking papers in the staff room',
    ],
    secretTemplates: [
      'is under pressure from the principal about {issue}',
      'made a mistake in {area} and is trying to fix it quietly',
      'knows more about the situation than they\'re letting on',
    ],
  },
  parent: {
    role: 'Parent',
    backgroundTemplates: [
      '{name} is very involved in the school\'s {activity}. They volunteer every weekend.',
      'As a {profession}, {name} is often too busy to attend school events, which they feel guilty about.',
      '{name} is known for being {trait}. They want the best for their child, sometimes too much.',
    ],
    motivationTemplates: [
      'just wanted their child to succeed',
      'was trying to protect their child from disappointment',
      'got carried away trying to help',
      'didn\'t realize their actions would cause problems',
    ],
    relationshipTemplates: [
      'is friends with {other_parent} from the parents\' committee',
      'has had disagreements with {teacher} about their child\'s progress',
      'is respected in the community for their {contribution}',
    ],
    alibiTemplates: [
      'was at work until {time}',
      'was picking up their other child from {activity}',
      'claims to have been at {location} running errands',
      'was at the school for a meeting that ended at {time}',
    ],
    secretTemplates: [
      'puts too much pressure on their child to succeed',
      'is dealing with personal issues that affect their judgment',
      'feels competitive with other parents',
    ],
  },
  staff: {
    role: 'School Staff',
    backgroundTemplates: [
      '{name} has worked at the school for {years} years as the {position}. Everyone knows them by name.',
      'The {position}, {name}, keeps the school running smoothly. They know every corner of the building.',
      '{name} was recently hired as the {position}. They\'re still learning the ropes.',
    ],
    motivationTemplates: [
      'needed extra money for {reason}',
      'was trying to cover up an honest mistake',
      'felt unappreciated and made a poor decision',
      'was helping someone without realizing the consequences',
    ],
    relationshipTemplates: [
      'is friendly with the students, especially those who stay back late',
      'reports to {superior} who can be demanding',
      'has worked alongside {colleague} for many years',
    ],
    alibiTemplates: [
      'was doing rounds in the {building} section',
      'took a break at the usual time',
      'was called away to handle {situation}',
      'was in the {location} doing routine {task}',
    ],
    secretTemplates: [
      'has access to places most people don\'t know about',
      'has seen things they haven\'t reported',
      'is dealing with pressure from management about {issue}',
    ],
  },
};

// ============================================
// NARRATIVE BUILDERS
// ============================================

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function buildBackstory(
  template: StoryTemplate,
  variables: Record<string, string>
): string {
  let backstory = pickRandom(template.backstoryTemplates);
  for (const [key, value] of Object.entries(variables)) {
    backstory = backstory.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return backstory;
}

export function buildIncident(
  template: StoryTemplate,
  variables: Record<string, string>
): string {
  let incident = pickRandom(template.incidentTemplates);
  for (const [key, value] of Object.entries(variables)) {
    incident = incident.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return incident;
}

export function buildInvestigationNarrative(
  template: StoryTemplate,
  variables: Record<string, string>
): string[] {
  return template.investigationHooks.map(hook => {
    let result = hook;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }
    return result;
  });
}

export function buildResolution(
  template: StoryTemplate,
  variables: Record<string, string>
): string {
  let resolution = pickRandom(template.resolutionTemplates);
  for (const [key, value] of Object.entries(variables)) {
    resolution = resolution.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return resolution;
}

export function generateCharacterStory(
  type: keyof typeof characterBackstories,
  name: string,
  variables: Record<string, string>
): {
  background: string;
  motivation: string;
  alibi: string;
  secret: string;
} {
  const templates = characterBackstories[type];
  const allVars = { ...variables, name };

  const replaceVars = (text: string) => {
    let result = text;
    for (const [key, value] of Object.entries(allVars)) {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }
    return result;
  };

  return {
    background: replaceVars(pickRandom(templates.backgroundTemplates)),
    motivation: replaceVars(pickRandom(templates.motivationTemplates)),
    alibi: replaceVars(pickRandom(templates.alibiTemplates)),
    secret: replaceVars(pickRandom(templates.secretTemplates)),
  };
}

// ============================================
// ALL STORY TEMPLATES
// ============================================

export const allStoryTemplates: StoryTemplate[] = [
  ...schoolStories,
  ...communityStories,
  ...eventStories,
];

export function getStoryTemplate(category?: string): StoryTemplate {
  if (category) {
    const filtered = allStoryTemplates.filter(t => t.category === category);
    return pickRandom(filtered.length > 0 ? filtered : allStoryTemplates);
  }
  return pickRandom(allStoryTemplates);
}

export function getStoryForGrade(grade: 'P4' | 'P5' | 'P6'): StoryTemplate {
  const filtered = allStoryTemplates.filter(t => t.gradeLevel.includes(grade));
  return pickRandom(filtered);
}

export function buildFullNarrative(
  template: StoryTemplate,
  variables: Record<string, string>
): NarrativeArc {
  return {
    introduction: buildBackstory(template, variables),
    risingAction: buildInvestigationNarrative(template, variables),
    climax: buildIncident(template, variables),
    resolution: buildResolution(template, variables),
  };
}
