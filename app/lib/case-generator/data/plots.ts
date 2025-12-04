/**
 * PLOT TEMPLATES AND STORY STRUCTURES
 * Different narrative frameworks for case variety
 */

// ============================================
// TYPES
// ============================================

export interface PlotTemplate {
  id: string;
  name: string;
  structure: PlotStructure;
  briefingFormat: BriefingFormat;
  suspectCount: { min: number; max: number };
  clueCount: { min: number; max: number };
  sceneCount: { min: number; max: number };
  twistTypes: TwistType[];
  difficulty: ('ROOKIE' | 'INSPECTOR' | 'DETECTIVE' | 'CHIEF')[];
}

export type PlotStructure =
  | 'classic'          // Standard whodunit
  | 'countdown'        // Time pressure
  | 'layers'           // Deeper mystery revealed
  | 'parallel'         // Multiple related incidents
  | 'flashback'        // Piece together past events
  | 'competition'      // Race against rival
  | 'undercover'       // Infiltration angle
  | 'protection'       // Prevent future crime
  | 'recovery'         // Find missing item/person
  | 'clearing'         // Prove innocence
  | 'pattern'          // Serial incidents
  | 'conspiracy';      // Multiple perpetrators

export type BriefingFormat =
  | 'police_report'
  | 'newspaper_article'
  | 'witness_letter'
  | 'anonymous_tip'
  | 'diary_entry'
  | 'video_transcript'
  | 'chat_log'
  | 'radio_dispatch'
  | 'memo'
  | 'social_media';

export type TwistType =
  | 'false_lead'       // Initial suspect is innocent
  | 'inside_job'       // Trusted person involved
  | 'mistaken_identity'
  | 'accomplice'       // More than one person
  | 'framed'           // Someone set up another
  | 'accident'         // Not intentional
  | 'good_intentions'  // Crime for good reason
  | 'hidden_motive'    // Deeper reason
  | 'double_cross'     // Betrayal
  | 'switched'         // Items/identities switched
  | 'copycat'          // Imitating another crime
  | 'red_herring_evidence';

// ============================================
// PLOT TEMPLATES
// ============================================

export const plotTemplates: PlotTemplate[] = [
  // CLASSIC WHODUNIT
  {
    id: 'classic-theft',
    name: 'Classic Theft Investigation',
    structure: 'classic',
    briefingFormat: 'police_report',
    suspectCount: { min: 3, max: 5 },
    clueCount: { min: 4, max: 6 },
    sceneCount: { min: 2, max: 3 },
    twistTypes: ['false_lead', 'inside_job', 'hidden_motive'],
    difficulty: ['ROOKIE', 'INSPECTOR', 'DETECTIVE'],
  },
  {
    id: 'classic-sabotage',
    name: 'Sabotage Mystery',
    structure: 'classic',
    briefingFormat: 'memo',
    suspectCount: { min: 3, max: 4 },
    clueCount: { min: 4, max: 5 },
    sceneCount: { min: 2, max: 2 },
    twistTypes: ['framed', 'good_intentions', 'accident'],
    difficulty: ['INSPECTOR', 'DETECTIVE'],
  },

  // COUNTDOWN - Time pressure
  {
    id: 'countdown-event',
    name: 'Race Against Time',
    structure: 'countdown',
    briefingFormat: 'radio_dispatch',
    suspectCount: { min: 3, max: 4 },
    clueCount: { min: 3, max: 5 },
    sceneCount: { min: 2, max: 3 },
    twistTypes: ['switched', 'accomplice', 'double_cross'],
    difficulty: ['INSPECTOR', 'DETECTIVE', 'CHIEF'],
  },
  {
    id: 'countdown-deadline',
    name: 'Before It\'s Too Late',
    structure: 'countdown',
    briefingFormat: 'anonymous_tip',
    suspectCount: { min: 2, max: 4 },
    clueCount: { min: 4, max: 6 },
    sceneCount: { min: 2, max: 3 },
    twistTypes: ['hidden_motive', 'good_intentions'],
    difficulty: ['DETECTIVE', 'CHIEF'],
  },

  // LAYERS - Deeper mystery
  {
    id: 'layers-discovery',
    name: 'The Deeper Truth',
    structure: 'layers',
    briefingFormat: 'diary_entry',
    suspectCount: { min: 4, max: 6 },
    clueCount: { min: 5, max: 8 },
    sceneCount: { min: 3, max: 4 },
    twistTypes: ['hidden_motive', 'conspiracy', 'inside_job'],
    difficulty: ['DETECTIVE', 'CHIEF'],
  },
  {
    id: 'layers-secrets',
    name: 'Hidden Secrets',
    structure: 'layers',
    briefingFormat: 'witness_letter',
    suspectCount: { min: 3, max: 5 },
    clueCount: { min: 5, max: 7 },
    sceneCount: { min: 2, max: 3 },
    twistTypes: ['framed', 'accomplice', 'hidden_motive'],
    difficulty: ['INSPECTOR', 'DETECTIVE', 'CHIEF'],
  },

  // PARALLEL - Multiple incidents
  {
    id: 'parallel-connected',
    name: 'Connected Crimes',
    structure: 'parallel',
    briefingFormat: 'newspaper_article',
    suspectCount: { min: 4, max: 6 },
    clueCount: { min: 6, max: 8 },
    sceneCount: { min: 3, max: 4 },
    twistTypes: ['pattern', 'copycat', 'accomplice'],
    difficulty: ['DETECTIVE', 'CHIEF'],
  },

  // FLASHBACK - Past events
  {
    id: 'flashback-memory',
    name: 'Piecing Together',
    structure: 'flashback',
    briefingFormat: 'diary_entry',
    suspectCount: { min: 3, max: 4 },
    clueCount: { min: 5, max: 7 },
    sceneCount: { min: 2, max: 3 },
    twistTypes: ['mistaken_identity', 'accident', 'hidden_motive'],
    difficulty: ['INSPECTOR', 'DETECTIVE'],
  },

  // RECOVERY - Find missing item
  {
    id: 'recovery-treasure',
    name: 'The Missing Treasure',
    structure: 'recovery',
    briefingFormat: 'witness_letter',
    suspectCount: { min: 3, max: 5 },
    clueCount: { min: 4, max: 6 },
    sceneCount: { min: 2, max: 4 },
    twistTypes: ['switched', 'inside_job', 'good_intentions'],
    difficulty: ['ROOKIE', 'INSPECTOR', 'DETECTIVE'],
  },
  {
    id: 'recovery-pet',
    name: 'Lost and Found',
    structure: 'recovery',
    briefingFormat: 'social_media',
    suspectCount: { min: 2, max: 4 },
    clueCount: { min: 3, max: 5 },
    sceneCount: { min: 2, max: 3 },
    twistTypes: ['accident', 'good_intentions', 'mistaken_identity'],
    difficulty: ['ROOKIE', 'INSPECTOR'],
  },

  // CLEARING - Prove innocence
  {
    id: 'clearing-accused',
    name: 'Wrongly Accused',
    structure: 'clearing',
    briefingFormat: 'witness_letter',
    suspectCount: { min: 3, max: 5 },
    clueCount: { min: 5, max: 7 },
    sceneCount: { min: 2, max: 3 },
    twistTypes: ['framed', 'false_lead', 'red_herring_evidence'],
    difficulty: ['INSPECTOR', 'DETECTIVE', 'CHIEF'],
  },

  // PATTERN - Serial incidents
  {
    id: 'pattern-series',
    name: 'The Pattern Emerges',
    structure: 'pattern',
    briefingFormat: 'police_report',
    suspectCount: { min: 4, max: 6 },
    clueCount: { min: 6, max: 8 },
    sceneCount: { min: 3, max: 4 },
    twistTypes: ['copycat', 'accomplice', 'hidden_motive'],
    difficulty: ['DETECTIVE', 'CHIEF'],
  },

  // PROTECTION - Prevent crime
  {
    id: 'protection-prevent',
    name: 'Stop the Plan',
    structure: 'protection',
    briefingFormat: 'anonymous_tip',
    suspectCount: { min: 3, max: 4 },
    clueCount: { min: 4, max: 6 },
    sceneCount: { min: 2, max: 3 },
    twistTypes: ['inside_job', 'double_cross', 'switched'],
    difficulty: ['INSPECTOR', 'DETECTIVE', 'CHIEF'],
  },
];

// ============================================
// BRIEFING TEMPLATES
// ============================================

export interface BriefingTemplate {
  format: BriefingFormat;
  header: string[];
  bodyStart: string[];
  bodyMiddle: string[];
  bodyEnd: string[];
  signature: string[];
}

export const briefingTemplates: Record<BriefingFormat, BriefingTemplate> = {
  police_report: {
    format: 'police_report',
    header: [
      'SINGAPORE POLICE FORCE - CASE FILE #{caseNumber}',
      'SPF INCIDENT REPORT - REF: {caseNumber}',
      'OFFICIAL POLICE REPORT - FILE #{caseNumber}',
    ],
    bodyStart: [
      'Date of Incident: {date}\nLocation: {location}\nReporting Officer: {officer}\n\nINCIDENT SUMMARY:',
      'Incident Reference: {caseNumber}\nDate/Time: {date} at {time}\nLocation: {location}\n\nDESCRIPTION OF INCIDENT:',
    ],
    bodyMiddle: [
      'Upon arrival at the scene, officers observed {observation}. Preliminary investigation indicates {finding}.',
      'Witnesses report {witness_account}. Evidence collected includes {evidence}.',
      'Initial assessment suggests {assessment}. Further investigation is required to {requirement}.',
    ],
    bodyEnd: [
      'The following individuals have been identified as persons of interest:',
      'Suspects currently under investigation:',
      'The following persons were present at the scene and require questioning:',
    ],
    signature: [
      'Investigating Officer: {officer}\nStation: {station}',
      'Filed by: {officer}\nClassification: {classification}',
    ],
  },

  newspaper_article: {
    format: 'newspaper_article',
    header: [
      'THE STRAITS TIMES | {date}',
      'TODAY NEWSPAPER | SINGAPORE NEWS',
      'CHANNEL NEWSASIA | BREAKING',
    ],
    bodyStart: [
      '"{headline}"\n\nSINGAPORE - ',
      'BREAKING: {headline}\n\n{location} - ',
      '{headline}\nBy Staff Reporter\n\n',
    ],
    bodyMiddle: [
      'According to sources, {details}. Witnesses at the scene described {witness_desc}.',
      'The incident, which occurred at {location}, has left many questions unanswered. "{quote}" said one witness.',
      'Authorities are investigating after {summary}. Local residents expressed {reaction}.',
    ],
    bodyEnd: [
      'Police are appealing for information from anyone who may have witnessed the incident.',
      'Anyone with information is urged to contact the police hotline.',
      'The investigation is ongoing. More details to follow.',
    ],
    signature: [
      '- Report continues on Page {page}',
      'For updates, follow @{social}',
    ],
  },

  witness_letter: {
    format: 'witness_letter',
    header: [
      'URGENT: Please Help!',
      'A Strange Thing Happened...',
      'I Need Your Help, Detective',
    ],
    bodyStart: [
      'Dear Detective,\n\nI am writing to you because something terrible has happened at {location}.',
      'To whom it may concern,\n\nI witnessed something disturbing on {date} and I don\'t know who else to turn to.',
      'Detective,\n\nYou don\'t know me, but I know you can help. Let me explain what I saw...',
    ],
    bodyMiddle: [
      'It all started when {beginning}. I couldn\'t believe my eyes when {middle}.',
      'I was at {location} when I noticed {observation}. At first I thought nothing of it, but then {development}.',
      'What troubles me most is {concern}. I have reason to believe {suspicion}.',
    ],
    bodyEnd: [
      'I trust you will look into this matter. The truth must come out.',
      'Please investigate this. I fear what might happen if no one does.',
      'I\'ve told you everything I know. The rest is up to you.',
    ],
    signature: [
      'A Concerned Citizen',
      'Hoping for justice,\n{name}',
      'Anonymously yours',
    ],
  },

  anonymous_tip: {
    format: 'anonymous_tip',
    header: [
      '*** ANONYMOUS TIP ***',
      '[CONFIDENTIAL TIP-OFF]',
      'FROM: UNKNOWN',
    ],
    bodyStart: [
      'Check {location}. Something isn\'t right.',
      'You need to investigate {target}. Here\'s what I know:',
      'I can\'t reveal who I am, but you need to know this:',
    ],
    bodyMiddle: [
      '{detail}. Don\'t trust {person}.',
      'Look for {clue}. It will lead you to the truth.',
      'The answer is hidden at {location}. {hint}.',
    ],
    bodyEnd: [
      'Act fast. Time is running out.',
      'Don\'t ignore this warning.',
      'You\'ll understand when you see it.',
    ],
    signature: [
      '- A Friend',
      '- Someone who knows',
      '- ???',
    ],
  },

  diary_entry: {
    format: 'diary_entry',
    header: [
      'Dear Diary,',
      '{date} - Private Journal',
      'Personal Log - {date}',
    ],
    bodyStart: [
      'Something strange happened today at {location}. I need to write this down before I forget.',
      'I can\'t stop thinking about what I saw. It was around {time} when...',
      'Today was supposed to be normal, but then everything changed when...',
    ],
    bodyMiddle: [
      'I noticed {observation}. {name} was acting strangely - {behavior}.',
      'The more I think about it, the more suspicious it seems. {reasoning}.',
      'Could it really be true? {question}. I saw {evidence}.',
    ],
    bodyEnd: [
      'I don\'t know what to do. Should I tell someone?',
      'Tomorrow I\'ll try to find out more. But for now...',
      'This can\'t be a coincidence. Something is definitely going on.',
    ],
    signature: [
      '- Must sleep now',
      'More tomorrow...',
      '(continued)',
    ],
  },

  video_transcript: {
    format: 'video_transcript',
    header: [
      'VIDEO TRANSCRIPT - CCTV FOOTAGE',
      'SECURITY CAMERA RECORDING - {date}',
      'FOOTAGE ANALYSIS REPORT',
    ],
    bodyStart: [
      'Camera: {camera_id}\nLocation: {location}\nTimestamp: {timestamp}\n\n[BEGIN TRANSCRIPT]',
      'Source: Security Camera {camera_id}\nDate: {date}\nTime: {time}\n\n---',
    ],
    bodyMiddle: [
      '[{time}] - {action}\n[{time}] - {action}\n[{time}] - {action}',
      'At {time}, subject enters frame from {direction}.\n{description}\nSubject exits at {time}.',
    ],
    bodyEnd: [
      '[END OF RELEVANT FOOTAGE]',
      '--- END TRANSCRIPT ---',
      '[Video quality: {quality}] [Duration: {duration}]',
    ],
    signature: [
      'Reviewed by: {reviewer}',
      'Analysis pending',
    ],
  },

  chat_log: {
    format: 'chat_log',
    header: [
      'CHAT HISTORY - {platform}',
      'MESSAGE LOG EXTRACTED',
      'CONVERSATION RECORD',
    ],
    bodyStart: [
      'Participants: {participants}\nDate: {date}\n\n---',
      'Group Chat: "{group_name}"\nMembers: {count}\n\n',
    ],
    bodyMiddle: [
      '[{time}] {sender}: {message}\n[{time}] {sender}: {message}',
      '{sender} ({time}): {message}\n{sender} ({time}): {message}',
    ],
    bodyEnd: [
      '--- End of relevant messages ---',
      '[{count} messages not shown]',
      '... [chat continues]',
    ],
    signature: [
      'Extracted on {date}',
      'Log file: {filename}',
    ],
  },

  radio_dispatch: {
    format: 'radio_dispatch',
    header: [
      '>>> URGENT DISPATCH <<<',
      '[RADIO TRANSCRIPT - PRIORITY]',
      '=== EMERGENCY CALL ===',
    ],
    bodyStart: [
      'Control: All units, we have a {incident_type} at {location}.\nUnit: Copy that, en route.',
      'Dispatch: Attention all units. {incident_type} reported. Location: {location}. Respond immediately.',
    ],
    bodyMiddle: [
      'Control: Be advised, {advisory}.\nUnit: Understood. {response}.',
      'Dispatch: Suspect description: {description}. Last seen {last_seen}.',
    ],
    bodyEnd: [
      'Control: Keep us updated. Out.',
      'Dispatch: All units maintain radio silence unless urgent. Out.',
    ],
    signature: [
      '>>> END TRANSMISSION <<<',
      '=== SIGNAL ENDS ===',
    ],
  },

  memo: {
    format: 'memo',
    header: [
      'INTERNAL MEMO',
      'CONFIDENTIAL - STAFF ONLY',
      'URGENT NOTICE',
    ],
    bodyStart: [
      'TO: All Staff\nFROM: {sender}\nRE: Incident at {location}\nDATE: {date}\n\n',
      'MEMORANDUM\n\nSubject: {subject}\nDate: {date}\n\n',
    ],
    bodyMiddle: [
      'It has come to our attention that {issue}. We are currently investigating {investigation}.',
      'Following the incident on {date}, management has decided to {action}. {details}.',
    ],
    bodyEnd: [
      'If you have any information, please contact {contact} immediately.',
      'Your cooperation in this matter is appreciated.',
      'This memo is confidential. Do not share with unauthorized persons.',
    ],
    signature: [
      'Management',
      '{sender}\n{title}',
    ],
  },

  social_media: {
    format: 'social_media',
    header: [
      '@{username} posted:',
      '{username} shared a post',
      'VIRAL POST FROM {platform}',
    ],
    bodyStart: [
      '"{post_content}"\n\n#Singapore #{hashtag}\n\n---\nComments:',
      'OMG you won\'t believe what just happened at {location}! 😱\n\n',
    ],
    bodyMiddle: [
      '@{commenter}: {comment}\n@{commenter}: {comment}',
      '👁️ {views} views | 💬 {comments} comments | ❤️ {likes} likes',
    ],
    bodyEnd: [
      'This post is going viral. People want answers!',
      '[Comments have been disabled]',
      'Share if you know anything! 🙏',
    ],
    signature: [
      'Posted {time_ago}',
      'via {platform}',
    ],
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getPlotForDifficulty(difficulty: string): PlotTemplate[] {
  return plotTemplates.filter(p => p.difficulty.includes(difficulty as any));
}

export function getPlotByStructure(structure: PlotStructure): PlotTemplate[] {
  return plotTemplates.filter(p => p.structure === structure);
}

export function getRandomPlot(difficulty?: string): PlotTemplate {
  const available = difficulty
    ? getPlotForDifficulty(difficulty)
    : plotTemplates;
  return available[Math.floor(Math.random() * available.length)];
}

export function getBriefingTemplate(format: BriefingFormat): BriefingTemplate {
  return briefingTemplates[format];
}

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateBriefingText(
  template: BriefingTemplate,
  variables: Record<string, string>
): string {
  const header = pickRandom(template.header);
  const bodyStart = pickRandom(template.bodyStart);
  const bodyMiddle = pickRandom(template.bodyMiddle);
  const bodyEnd = pickRandom(template.bodyEnd);
  const signature = pickRandom(template.signature);

  let text = `${header}\n\n${bodyStart}\n\n${bodyMiddle}\n\n${bodyEnd}\n\n${signature}`;

  // Replace variables
  for (const [key, value] of Object.entries(variables)) {
    text = text.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }

  return text;
}
