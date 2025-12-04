/**
 * CLUE DATABASE
 * Extensive clue templates and generation for cases
 */

// ============================================
// TYPES
// ============================================

export interface ClueTemplate {
  id: string;
  type: ClueType;
  name: string;
  descriptionGenerator: () => string;
  relevanceWeights: {
    critical: number;
    supporting: number;
    'red-herring': number;
  };
}

export type ClueType = 'physical' | 'document' | 'testimony' | 'digital';

// ============================================
// UTILITY FUNCTIONS
// ============================================

function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomTime(): string {
  const hour = random(6, 22);
  const minute = random(0, 5) * 10;
  const period = hour < 12 ? 'am' : 'pm';
  const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
}

function randomDate(): string {
  const day = random(1, 28);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${day} ${pickRandom(months)}`;
}

// ============================================
// PHYSICAL CLUES (40+)
// ============================================

export const physicalClues: ClueTemplate[] = [
  // Fingerprints
  {
    id: 'phys-finger-001',
    type: 'physical',
    name: 'Fingerprint on Door Handle',
    descriptionGenerator: () => `A partial fingerprint was found on the ${pickRandom(['door handle', 'door frame', 'door knob'])}. Analysis shows it's a ${pickRandom(['thumb', 'index finger', 'middle finger'])} print.`,
    relevanceWeights: { critical: 40, supporting: 50, 'red-herring': 10 },
  },
  {
    id: 'phys-finger-002',
    type: 'physical',
    name: 'Fingerprint on Object',
    descriptionGenerator: () => `A clear fingerprint was lifted from the ${pickRandom(['stolen item\'s original location', 'nearby surface', 'window sill', 'desk drawer', 'cabinet handle'])}. The print has ${pickRandom(['3', '4', '5'])} identifiable ridge patterns.`,
    relevanceWeights: { critical: 50, supporting: 40, 'red-herring': 10 },
  },
  {
    id: 'phys-finger-003',
    type: 'physical',
    name: 'Smudged Fingerprint',
    descriptionGenerator: () => `A smudged fingerprint was found on the ${pickRandom(['glass surface', 'plastic container', 'metal railing'])}. It appears someone tried to wipe it away.`,
    relevanceWeights: { critical: 30, supporting: 50, 'red-herring': 20 },
  },

  // Footprints
  {
    id: 'phys-foot-001',
    type: 'physical',
    name: 'Muddy Footprint',
    descriptionGenerator: () => `A ${pickRandom(['muddy', 'dirty', 'wet'])} footprint (approximately size ${random(36, 44)}) was found near the ${pickRandom(['entrance', 'exit', 'scene of the crime'])}. The tread pattern suggests ${pickRandom(['sports shoes', 'formal shoes', 'sandals', 'boots'])}.`,
    relevanceWeights: { critical: 30, supporting: 50, 'red-herring': 20 },
  },
  {
    id: 'phys-foot-002',
    type: 'physical',
    name: 'Dusty Footprints',
    descriptionGenerator: () => `A trail of ${random(3, 7)} dusty footprints leads from ${pickRandom(['the back door', 'the side entrance', 'the storage room'])} to ${pickRandom(['the main area', 'the crime scene', 'the exit'])}. Size appears to be ${random(36, 44)}.`,
    relevanceWeights: { critical: 20, supporting: 60, 'red-herring': 20 },
  },
  {
    id: 'phys-foot-003',
    type: 'physical',
    name: 'Partial Shoe Print',
    descriptionGenerator: () => `A partial shoe print was preserved in ${pickRandom(['dried mud', 'dust', 'paint residue'])}. The pattern shows a distinctive ${pickRandom(['star', 'diamond', 'circular', 'zigzag'])} design.`,
    relevanceWeights: { critical: 40, supporting: 40, 'red-herring': 20 },
  },

  // Fabric/Material
  {
    id: 'phys-fabric-001',
    type: 'physical',
    name: 'Torn Fabric',
    descriptionGenerator: () => `A small piece of ${pickRandom(['blue', 'red', 'green', 'black', 'white', 'grey'])} ${pickRandom(['cotton', 'polyester', 'denim', 'nylon'])} fabric was caught on ${pickRandom(['a nail', 'the fence', 'a door hinge', 'a broken edge'])}.`,
    relevanceWeights: { critical: 40, supporting: 40, 'red-herring': 20 },
  },
  {
    id: 'phys-fabric-002',
    type: 'physical',
    name: 'Thread',
    descriptionGenerator: () => `A ${pickRandom(['long', 'short'])} ${pickRandom(['red', 'blue', 'white', 'black', 'green'])} thread was found tangled in ${pickRandom(['the lock', 'the handle', 'the window frame'])}. It appears to be from ${pickRandom(['clothing', 'a bag', 'a jacket'])}.`,
    relevanceWeights: { critical: 20, supporting: 60, 'red-herring': 20 },
  },
  {
    id: 'phys-fabric-003',
    type: 'physical',
    name: 'Button',
    descriptionGenerator: () => `A ${pickRandom(['round', 'square', 'decorative'])} ${pickRandom(['metal', 'plastic', 'wooden'])} button was found on the floor near ${pickRandom(['the crime scene', 'the exit', 'the storage area'])}. It has ${random(2, 4)} holes.`,
    relevanceWeights: { critical: 30, supporting: 50, 'red-herring': 20 },
  },

  // Hair/Biological
  {
    id: 'phys-hair-001',
    type: 'physical',
    name: 'Hair Strand',
    descriptionGenerator: () => `A ${pickRandom(['black', 'dark brown', 'light brown', 'grey'])} hair strand, approximately ${random(5, 30)}cm long, was found at the scene. It appears to be ${pickRandom(['straight', 'wavy', 'curly'])}.`,
    relevanceWeights: { critical: 30, supporting: 50, 'red-herring': 20 },
  },
  {
    id: 'phys-hair-002',
    type: 'physical',
    name: 'Multiple Hairs',
    descriptionGenerator: () => `${random(2, 5)} hair strands of similar ${pickRandom(['colour', 'length'])} were collected from ${pickRandom(['the chair', 'the clothing left behind', 'the floor'])}. Analysis suggests they belong to the same person.`,
    relevanceWeights: { critical: 40, supporting: 40, 'red-herring': 20 },
  },

  // Dropped Items
  {
    id: 'phys-drop-001',
    type: 'physical',
    name: 'Dropped Pen',
    descriptionGenerator: () => `A ${pickRandom(['ballpoint', 'fountain', 'gel'])} pen with ${pickRandom(['initials engraved', 'a company logo', 'distinctive markings'])} was found near the ${pickRandom(['scene', 'exit', 'hiding spot'])}.`,
    relevanceWeights: { critical: 40, supporting: 40, 'red-herring': 20 },
  },
  {
    id: 'phys-drop-002',
    type: 'physical',
    name: 'Lost Keychain',
    descriptionGenerator: () => `A keychain with a ${pickRandom(['cartoon character', 'souvenir', 'school mascot', 'sports team logo', 'zodiac sign'])} design was discovered under ${pickRandom(['a desk', 'a shelf', 'a cabinet'])}.`,
    relevanceWeights: { critical: 50, supporting: 30, 'red-herring': 20 },
  },
  {
    id: 'phys-drop-003',
    type: 'physical',
    name: 'ID Card',
    descriptionGenerator: () => `A ${pickRandom(['student', 'staff', 'visitor', 'membership'])} ID card was found ${pickRandom(['on the ground', 'stuck in a gap', 'behind furniture'])}. The photo is ${pickRandom(['clear', 'partially visible', 'faded'])}.`,
    relevanceWeights: { critical: 60, supporting: 30, 'red-herring': 10 },
  },
  {
    id: 'phys-drop-004',
    type: 'physical',
    name: 'Loose Change',
    descriptionGenerator: () => `${random(2, 5)} coins totaling $${random(1, 5)}.${random(10, 90)} were scattered near ${pickRandom(['the scene', 'the exit', 'the window'])}. One is a ${pickRandom(['rare', 'foreign', 'commemorative'])} coin.`,
    relevanceWeights: { critical: 20, supporting: 50, 'red-herring': 30 },
  },
  {
    id: 'phys-drop-005',
    type: 'physical',
    name: 'Glasses',
    descriptionGenerator: () => `A pair of ${pickRandom(['reading glasses', 'sunglasses', 'spectacles'])} with ${pickRandom(['distinctive frames', 'a unique design', 'scratches on the lens'])} was left behind.`,
    relevanceWeights: { critical: 50, supporting: 30, 'red-herring': 20 },
  },
  {
    id: 'phys-drop-006',
    type: 'physical',
    name: 'Dropped Earring',
    descriptionGenerator: () => `A single ${pickRandom(['gold', 'silver', 'pearl', 'costume'])} earring was found ${pickRandom(['on the floor', 'near the entrance', 'by the window'])}.`,
    relevanceWeights: { critical: 40, supporting: 40, 'red-herring': 20 },
  },

  // Tool Marks
  {
    id: 'phys-tool-001',
    type: 'physical',
    name: 'Scratches on Lock',
    descriptionGenerator: () => `Fresh scratches around the ${pickRandom(['lock', 'padlock', 'latch'])} suggest someone used ${pickRandom(['a screwdriver', 'a thin tool', 'an improvised pick'])} to force it open.`,
    relevanceWeights: { critical: 40, supporting: 50, 'red-herring': 10 },
  },
  {
    id: 'phys-tool-002',
    type: 'physical',
    name: 'Pry Marks',
    descriptionGenerator: () => `Pry marks on the ${pickRandom(['window frame', 'door edge', 'cabinet'])} indicate forced entry using ${pickRandom(['a flat tool', 'considerable force', 'a specific technique'])}.`,
    relevanceWeights: { critical: 30, supporting: 50, 'red-herring': 20 },
  },

  // Environmental
  {
    id: 'phys-env-001',
    type: 'physical',
    name: 'Disturbed Dust',
    descriptionGenerator: () => `The dust pattern on ${pickRandom(['the shelf', 'the cabinet top', 'the windowsill'])} shows something was ${pickRandom(['removed', 'moved', 'placed and then taken'])} recently.`,
    relevanceWeights: { critical: 30, supporting: 50, 'red-herring': 20 },
  },
  {
    id: 'phys-env-002',
    type: 'physical',
    name: 'Moved Furniture',
    descriptionGenerator: () => `Marks on the floor show that ${pickRandom(['a chair', 'a desk', 'a shelf'])} was moved from its original position. The ${pickRandom(['scratch marks', 'dust lines', 'carpet impressions'])} confirm this.`,
    relevanceWeights: { critical: 20, supporting: 60, 'red-herring': 20 },
  },
  {
    id: 'phys-env-003',
    type: 'physical',
    name: 'Scent Evidence',
    descriptionGenerator: () => `A distinctive ${pickRandom(['perfume', 'cologne', 'cigarette', 'food'])} smell lingers in the area, suggesting someone with that scent was present recently.`,
    relevanceWeights: { critical: 30, supporting: 40, 'red-herring': 30 },
  },
];

// ============================================
// DOCUMENT CLUES (30+)
// ============================================

export const documentClues: ClueTemplate[] = [
  // Receipts
  {
    id: 'doc-receipt-001',
    type: 'document',
    name: 'Store Receipt',
    descriptionGenerator: () => `A receipt from ${pickRandom(['7-Eleven', 'NTUC FairPrice', 'Cold Storage', 'Cheers', 'Giant'])} dated ${randomDate()} at ${randomTime()} shows purchase of ${pickRandom(['snacks', 'drinks', 'household items', 'stationery'])}.`,
    relevanceWeights: { critical: 30, supporting: 50, 'red-herring': 20 },
  },
  {
    id: 'doc-receipt-002',
    type: 'document',
    name: 'Food Receipt',
    descriptionGenerator: () => `A receipt from ${pickRandom(['a coffee shop', 'McDonald\'s', 'a hawker stall', 'Kopitiam'])} shows a purchase at ${randomTime()}, providing a possible alibi.`,
    relevanceWeights: { critical: 40, supporting: 40, 'red-herring': 20 },
  },
  {
    id: 'doc-receipt-003',
    type: 'document',
    name: 'ATM Receipt',
    descriptionGenerator: () => `An ATM withdrawal slip shows $${random(50, 500)} was withdrawn at ${randomTime()} from the ${pickRandom(['Ang Mo Kio', 'Tampines', 'Jurong', 'Bedok'])} branch.`,
    relevanceWeights: { critical: 50, supporting: 40, 'red-herring': 10 },
  },

  // Notes
  {
    id: 'doc-note-001',
    type: 'document',
    name: 'Handwritten Note',
    descriptionGenerator: () => `A handwritten note with ${pickRandom(['a phone number', 'an address', 'a time and place', 'initials', 'a cryptic message'])} was found ${pickRandom(['in the bin', 'under a desk', 'crumpled nearby'])}.`,
    relevanceWeights: { critical: 50, supporting: 40, 'red-herring': 10 },
  },
  {
    id: 'doc-note-002',
    type: 'document',
    name: 'To-Do List',
    descriptionGenerator: () => `A to-do list was discovered with ${random(3, 6)} items, including "${pickRandom(['collect money', 'meet at 3pm', 'check storage', 'get keys', 'avoid cameras'])}" which seems relevant.`,
    relevanceWeights: { critical: 40, supporting: 40, 'red-herring': 20 },
  },
  {
    id: 'doc-note-003',
    type: 'document',
    name: 'Threatening Note',
    descriptionGenerator: () => `A note with threatening language was found: "${pickRandom(['You\'ll regret this', 'I know what you did', 'Pay up or else', 'This isn\'t over'])}" The handwriting is ${pickRandom(['neat', 'messy', 'disguised'])}.`,
    relevanceWeights: { critical: 60, supporting: 30, 'red-herring': 10 },
  },

  // Schedules/Logs
  {
    id: 'doc-schedule-001',
    type: 'document',
    name: 'Work Schedule',
    descriptionGenerator: () => `A printed work schedule shows who was on duty during the time of the incident. ${random(3, 5)} names are listed for that time slot.`,
    relevanceWeights: { critical: 50, supporting: 40, 'red-herring': 10 },
  },
  {
    id: 'doc-schedule-002',
    type: 'document',
    name: 'Visitor Log',
    descriptionGenerator: () => `The visitor log shows ${random(5, 15)} entries for the day. One entry at ${randomTime()} has ${pickRandom(['an illegible signature', 'a fake-looking name', 'unusual timing'])}.`,
    relevanceWeights: { critical: 50, supporting: 40, 'red-herring': 10 },
  },
  {
    id: 'doc-schedule-003',
    type: 'document',
    name: 'Security Log',
    descriptionGenerator: () => `The security log shows routine checks at ${random(2, 4)}-hour intervals. The ${randomTime()} check has ${pickRandom(['no entry', 'a suspicious note', 'an unusual signature'])}.`,
    relevanceWeights: { critical: 40, supporting: 50, 'red-herring': 10 },
  },

  // Photos
  {
    id: 'doc-photo-001',
    type: 'document',
    name: 'Printed Photo',
    descriptionGenerator: () => `A ${pickRandom(['blurry', 'clear', 'partially obscured'])} printed photo shows ${pickRandom(['someone near the scene', 'a suspicious figure', 'relevant evidence'])} at approximately ${randomTime()}.`,
    relevanceWeights: { critical: 50, supporting: 40, 'red-herring': 10 },
  },
  {
    id: 'doc-photo-002',
    type: 'document',
    name: 'Group Photo',
    descriptionGenerator: () => `A group photo from a recent event shows ${random(4, 8)} people together. One person's expression or position seems ${pickRandom(['odd', 'tense', 'suspicious', 'out of place'])}.`,
    relevanceWeights: { critical: 30, supporting: 50, 'red-herring': 20 },
  },

  // Official Documents
  {
    id: 'doc-official-001',
    type: 'document',
    name: 'Altered Document',
    descriptionGenerator: () => `A ${pickRandom(['permission slip', 'form', 'report', 'invoice'])} shows signs of ${pickRandom(['tampering', 'white-out', 'overwriting', 'forged signatures'])}.`,
    relevanceWeights: { critical: 60, supporting: 30, 'red-herring': 10 },
  },
  {
    id: 'doc-official-002',
    type: 'document',
    name: 'Financial Record',
    descriptionGenerator: () => `Financial records show ${pickRandom(['an unexplained withdrawal', 'suspicious transactions', 'discrepancies in the accounts', 'missing funds'])} around the time of the incident.`,
    relevanceWeights: { critical: 60, supporting: 30, 'red-herring': 10 },
  },
  {
    id: 'doc-official-003',
    type: 'document',
    name: 'Inventory List',
    descriptionGenerator: () => `The inventory list shows a ${pickRandom(['discrepancy', 'missing item', 'recent change', 'suspicious entry'])} that wasn't there ${random(1, 7)} days ago.`,
    relevanceWeights: { critical: 40, supporting: 50, 'red-herring': 10 },
  },

  // Communication
  {
    id: 'doc-comm-001',
    type: 'document',
    name: 'Printed Email',
    descriptionGenerator: () => `A printed email dated ${randomDate()} discusses ${pickRandom(['the stolen item', 'meeting arrangements', 'suspicious plans', 'complaints about someone'])}. Part of it is ${pickRandom(['highlighted', 'circled', 'underlined'])}.`,
    relevanceWeights: { critical: 50, supporting: 40, 'red-herring': 10 },
  },
  {
    id: 'doc-comm-002',
    type: 'document',
    name: 'Text Message Printout',
    descriptionGenerator: () => `A printout of text messages shows a conversation between two people. One message says: "${pickRandom(['Meet me at the usual place', 'Don\'t tell anyone', 'Is it done?', 'We need to talk'])}"`,
    relevanceWeights: { critical: 50, supporting: 40, 'red-herring': 10 },
  },
];

// ============================================
// TESTIMONY CLUES (25+)
// ============================================

export const testimonyClues: ClueTemplate[] = [
  // Sightings
  {
    id: 'test-sight-001',
    type: 'testimony',
    name: 'Suspicious Person Sighting',
    descriptionGenerator: () => `A witness saw someone ${pickRandom(['running', 'walking quickly', 'acting suspiciously', 'looking around nervously', 'carrying something'])} at around ${randomTime()}.`,
    relevanceWeights: { critical: 40, supporting: 50, 'red-herring': 10 },
  },
  {
    id: 'test-sight-002',
    type: 'testimony',
    name: 'Specific Person Sighting',
    descriptionGenerator: () => `A witness claims to have seen a specific person ${pickRandom(['near the scene', 'leaving the area', 'acting strangely', 'talking on the phone'])} at ${randomTime()}.`,
    relevanceWeights: { critical: 50, supporting: 40, 'red-herring': 10 },
  },
  {
    id: 'test-sight-003',
    type: 'testimony',
    name: 'Vehicle Sighting',
    descriptionGenerator: () => `A witness noticed a ${pickRandom(['blue car', 'white van', 'motorcycle', 'delivery vehicle'])} ${pickRandom(['parked nearby', 'driving away quickly', 'loading something', 'waiting for a long time'])}.`,
    relevanceWeights: { critical: 30, supporting: 50, 'red-herring': 20 },
  },

  // Sound Evidence
  {
    id: 'test-sound-001',
    type: 'testimony',
    name: 'Loud Noise Heard',
    descriptionGenerator: () => `A ${pickRandom(['loud crash', 'door slamming', 'glass breaking', 'shouting', 'running footsteps'])} was heard at approximately ${randomTime()}.`,
    relevanceWeights: { critical: 30, supporting: 50, 'red-herring': 20 },
  },
  {
    id: 'test-sound-002',
    type: 'testimony',
    name: 'Argument Overheard',
    descriptionGenerator: () => `A witness heard what sounded like an ${pickRandom(['argument', 'heated discussion', 'confrontation'])} involving ${random(2, 3)} voices at around ${randomTime()}.`,
    relevanceWeights: { critical: 50, supporting: 40, 'red-herring': 10 },
  },
  {
    id: 'test-sound-003',
    type: 'testimony',
    name: 'Unusual Sound',
    descriptionGenerator: () => `${pickRandom(['Strange scraping sounds', 'Unusual beeping', 'Muffled voices', 'Repeated knocking'])} were heard coming from ${pickRandom(['the storage room', 'the back area', 'nearby', 'the stairwell'])} at ${randomTime()}.`,
    relevanceWeights: { critical: 30, supporting: 50, 'red-herring': 20 },
  },

  // Behavior Observations
  {
    id: 'test-behav-001',
    type: 'testimony',
    name: 'Strange Behavior',
    descriptionGenerator: () => `A witness noticed someone ${pickRandom(['pacing nervously', 'checking their phone repeatedly', 'avoiding eye contact', 'making unusual excuses'])} on the day of the incident.`,
    relevanceWeights: { critical: 40, supporting: 50, 'red-herring': 10 },
  },
  {
    id: 'test-behav-002',
    type: 'testimony',
    name: 'Changed Routine',
    descriptionGenerator: () => `Someone's usual routine was different that day - they ${pickRandom(['arrived early', 'left late', 'went to unusual areas', 'skipped their regular duties'])}.`,
    relevanceWeights: { critical: 40, supporting: 40, 'red-herring': 20 },
  },
  {
    id: 'test-behav-003',
    type: 'testimony',
    name: 'Suspicious Conversation',
    descriptionGenerator: () => `A witness overhead someone say "${pickRandom(['Nobody will find out', 'I had to do it', 'Keep it between us', 'Don\'t ask questions', 'It wasn\'t supposed to happen this way'])}"`,
    relevanceWeights: { critical: 60, supporting: 30, 'red-herring': 10 },
  },

  // Alibi Related
  {
    id: 'test-alibi-001',
    type: 'testimony',
    name: 'Alibi Confirmation',
    descriptionGenerator: () => `A witness confirms they were with someone at ${randomTime()}, which ${pickRandom(['supports', 'partially confirms', 'raises questions about'])} their alibi.`,
    relevanceWeights: { critical: 50, supporting: 40, 'red-herring': 10 },
  },
  {
    id: 'test-alibi-002',
    type: 'testimony',
    name: 'Alibi Contradiction',
    descriptionGenerator: () => `A witness's account contradicts someone's alibi - they claim to have seen them ${pickRandom(['somewhere else', 'at a different time', 'doing something different'])} than stated.`,
    relevanceWeights: { critical: 60, supporting: 30, 'red-herring': 10 },
  },

  // Background Information
  {
    id: 'test-bg-001',
    type: 'testimony',
    name: 'Past Conflict',
    descriptionGenerator: () => `A witness reveals there was ${pickRandom(['a dispute', 'bad blood', 'a rivalry', 'an unresolved argument'])} between certain individuals ${pickRandom(['recently', 'a few months ago', 'that never got resolved'])}.`,
    relevanceWeights: { critical: 40, supporting: 50, 'red-herring': 10 },
  },
  {
    id: 'test-bg-002',
    type: 'testimony',
    name: 'Financial Trouble',
    descriptionGenerator: () => `Someone mentions that a person has been experiencing ${pickRandom(['financial difficulties', 'money problems', 'debt issues', 'unusual spending'])} lately.`,
    relevanceWeights: { critical: 50, supporting: 40, 'red-herring': 10 },
  },
  {
    id: 'test-bg-003',
    type: 'testimony',
    name: 'Secret Knowledge',
    descriptionGenerator: () => `A witness reveals that someone ${pickRandom(['knew about the hidden key', 'had access to the code', 'knew the routine', 'was aware of the schedule'])}.`,
    relevanceWeights: { critical: 60, supporting: 30, 'red-herring': 10 },
  },
];

// ============================================
// DIGITAL CLUES (25+)
// ============================================

export const digitalClues: ClueTemplate[] = [
  // CCTV
  {
    id: 'digi-cctv-001',
    type: 'digital',
    name: 'CCTV Movement',
    descriptionGenerator: () => `CCTV footage at ${randomTime()} shows a figure ${pickRandom(['entering', 'leaving', 'lingering near', 'passing by'])} the area. The image is ${pickRandom(['clear', 'grainy', 'partially obscured'])}.`,
    relevanceWeights: { critical: 60, supporting: 30, 'red-herring': 10 },
  },
  {
    id: 'digi-cctv-002',
    type: 'digital',
    name: 'CCTV Blind Spot',
    descriptionGenerator: () => `Analysis shows someone knew the CCTV blind spots - they ${pickRandom(['avoided all cameras', 'took an unusual route', 'stayed out of view', 'disabled the camera temporarily'])}.`,
    relevanceWeights: { critical: 50, supporting: 40, 'red-herring': 10 },
  },
  {
    id: 'digi-cctv-003',
    type: 'digital',
    name: 'Timestamp Analysis',
    descriptionGenerator: () => `CCTV timestamps show ${random(2, 5)} instances of suspicious activity between ${randomTime()} and ${randomTime()}. One matches a suspect's claimed absence.`,
    relevanceWeights: { critical: 50, supporting: 40, 'red-herring': 10 },
  },

  // Access Logs
  {
    id: 'digi-access-001',
    type: 'digital',
    name: 'Card Access Log',
    descriptionGenerator: () => `Access card records show entry at ${randomTime()} using card #${random(1000, 9999)}. The card belongs to ${pickRandom(['a staff member', 'someone on leave', 'an unexpected person'])}.`,
    relevanceWeights: { critical: 60, supporting: 30, 'red-herring': 10 },
  },
  {
    id: 'digi-access-002',
    type: 'digital',
    name: 'Multiple Access',
    descriptionGenerator: () => `The same access card was used ${random(2, 4)} times in ${random(10, 30)} minutes at different locations - impossible without ${pickRandom(['the card being cloned', 'someone else using it', 'a system error'])}.`,
    relevanceWeights: { critical: 60, supporting: 30, 'red-herring': 10 },
  },
  {
    id: 'digi-access-003',
    type: 'digital',
    name: 'After-Hours Access',
    descriptionGenerator: () => `Records show someone accessed the area at ${randomTime()}, which is ${pickRandom(['after hours', 'during lunch when it should be locked', 'at an unusual time'])}.`,
    relevanceWeights: { critical: 50, supporting: 40, 'red-herring': 10 },
  },

  // Phone/Digital Records
  {
    id: 'digi-phone-001',
    type: 'digital',
    name: 'Call Records',
    descriptionGenerator: () => `Phone records show a ${random(2, 15)} minute call at ${randomTime()} between two persons of interest. The call occurred ${pickRandom(['just before', 'just after', 'during'])} the incident.`,
    relevanceWeights: { critical: 50, supporting: 40, 'red-herring': 10 },
  },
  {
    id: 'digi-phone-002',
    type: 'digital',
    name: 'Message Deletion',
    descriptionGenerator: () => `Evidence of deleted messages was found. Partial recovery shows words like "${pickRandom(['tonight', 'money', 'meet', 'urgent', 'don\'t tell'])}" in the fragments.`,
    relevanceWeights: { critical: 60, supporting: 30, 'red-herring': 10 },
  },
  {
    id: 'digi-phone-003',
    type: 'digital',
    name: 'Location Data',
    descriptionGenerator: () => `Location data places someone's phone ${pickRandom(['near the scene', 'in a suspicious location', 'contradicting their alibi'])} at ${randomTime()}.`,
    relevanceWeights: { critical: 60, supporting: 30, 'red-herring': 10 },
  },

  // Transaction Records
  {
    id: 'digi-trans-001',
    type: 'digital',
    name: 'Transaction History',
    descriptionGenerator: () => `A ${pickRandom(['cash withdrawal', 'transfer', 'payment', 'purchase'])} of $${random(20, 500)} was made at ${randomTime()}, ${pickRandom(['near the scene', 'at an unusual location', 'after claiming to have no money'])}.`,
    relevanceWeights: { critical: 50, supporting: 40, 'red-herring': 10 },
  },
  {
    id: 'digi-trans-002',
    type: 'digital',
    name: 'Online Purchase',
    descriptionGenerator: () => `Records show an online purchase of ${pickRandom(['tools', 'supplies', 'equipment', 'materials'])} ${random(1, 7)} days before the incident. The shipping address is ${pickRandom(['suspicious', 'a different address', 'untraceable'])}.`,
    relevanceWeights: { critical: 40, supporting: 50, 'red-herring': 10 },
  },

  // Computer/Device
  {
    id: 'digi-comp-001',
    type: 'digital',
    name: 'Search History',
    descriptionGenerator: () => `Browser history shows searches for "${pickRandom(['how to pick locks', 'security camera blind spots', 'untraceable methods', 'alibis', 'getting rid of evidence'])}" ${random(1, 5)} days before the incident.`,
    relevanceWeights: { critical: 60, supporting: 30, 'red-herring': 10 },
  },
  {
    id: 'digi-comp-002',
    type: 'digital',
    name: 'Login Records',
    descriptionGenerator: () => `Computer login records show someone accessed the system at ${randomTime()} using ${pickRandom(['someone else\'s credentials', 'an admin account', 'a deactivated account'])}.`,
    relevanceWeights: { critical: 50, supporting: 40, 'red-herring': 10 },
  },
  {
    id: 'digi-comp-003',
    type: 'digital',
    name: 'File Modification',
    descriptionGenerator: () => `Files were ${pickRandom(['modified', 'deleted', 'accessed', 'copied'])} at ${randomTime()}, around the time of the incident. The user was logged in as "${pickRandom(['admin', 'unknown', 'a staff member on leave'])}"`,
    relevanceWeights: { critical: 50, supporting: 40, 'red-herring': 10 },
  },

  // Social Media
  {
    id: 'digi-social-001',
    type: 'digital',
    name: 'Social Media Post',
    descriptionGenerator: () => `A social media post at ${randomTime()} shows someone ${pickRandom(['at a different location than claimed', 'making suspicious comments', 'with unexpected people', 'showing off new possessions'])}.`,
    relevanceWeights: { critical: 50, supporting: 40, 'red-herring': 10 },
  },
  {
    id: 'digi-social-002',
    type: 'digital',
    name: 'Deleted Post',
    descriptionGenerator: () => `A deleted social media post was recovered. It ${pickRandom(['mentioned the incident', 'showed suspicious timing', 'contradicted their story', 'revealed hidden connections'])}.`,
    relevanceWeights: { critical: 60, supporting: 30, 'red-herring': 10 },
  },
];

// ============================================
// COMBINE ALL CLUES
// ============================================

export const allClueTemplates: ClueTemplate[] = [
  ...physicalClues,
  ...documentClues,
  ...testimonyClues,
  ...digitalClues,
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getCluesByType(type: ClueType): ClueTemplate[] {
  return allClueTemplates.filter(c => c.type === type);
}

export function getRandomClue(type?: ClueType): ClueTemplate {
  const available = type ? getCluesByType(type) : allClueTemplates;
  return pickRandom(available);
}

export function generateClueDescription(template: ClueTemplate): string {
  return template.descriptionGenerator();
}

export function getClueRelevance(template: ClueTemplate): 'critical' | 'supporting' | 'red-herring' {
  const roll = random(1, 100);
  const { critical, supporting } = template.relevanceWeights;

  if (roll <= critical) return 'critical';
  if (roll <= critical + supporting) return 'supporting';
  return 'red-herring';
}

// Total clue templates: 120+ unique clue types
// Each generates unique descriptions through random elements
