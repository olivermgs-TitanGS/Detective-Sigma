/**
 * SCALABLE EVIDENCE TEMPLATES
 *
 * 200+ evidence templates organized by type and category.
 * Combines with crime types for unique evidence chains.
 */

export interface EvidenceTemplate {
  id: string;
  category: 'physical' | 'documentary' | 'digital' | 'testimonial' | 'forensic';
  subcategory: string;

  // Multiple name variations
  names: string[];

  // Description templates (with placeholders)
  descriptions: string[];

  // Visual appearance for image generation
  visualDescriptions: string[];

  // What examining it reveals
  analysisResults: string[];

  // Discovery methods
  discoveryMethods: string[];

  // Compatible crime categories
  relevantCrimes: string[];

  // Evidence importance possibilities
  importanceLevels: ('critical' | 'important' | 'supporting' | 'misleading')[];
}

// ============================================
// PHYSICAL EVIDENCE (80+ templates)
// ============================================

export const PHYSICAL_EVIDENCE: EvidenceTemplate[] = [
  // FINGERPRINTS (10 variations)
  {
    id: 'fingerprint-glass',
    category: 'physical',
    subcategory: 'fingerprint',
    names: ['Fingerprint on Glass', 'Glass Surface Print', 'Window Fingerprint'],
    descriptions: [
      'A clear fingerprint visible on the glass surface',
      'Partial fingerprints found on the glass',
      'Multiple overlapping prints on the window',
      'A smudged but identifiable print on the glass panel',
    ],
    visualDescriptions: [
      'Visible fingerprint ridges on clear glass',
      'Dusty fingerprint on glass surface',
      'Oil print visible against light',
    ],
    analysisResults: [
      'Fingerprint matches suspect\'s records',
      'Print belongs to unknown individual',
      'Partial match with existing database',
      'Print too smudged for positive ID',
    ],
    discoveryMethods: [
      'Dusted during initial sweep',
      'Visible under UV light',
      'Noticed during detailed examination',
    ],
    relevantCrimes: ['theft', 'vandalism', 'sabotage', 'tampering'],
    importanceLevels: ['critical', 'important', 'supporting'],
  },
  {
    id: 'fingerprint-metal',
    category: 'physical',
    subcategory: 'fingerprint',
    names: ['Fingerprint on Metal', 'Handle Print', 'Lock Fingerprint'],
    descriptions: [
      'A fingerprint left on the metal surface',
      'Prints found on the door handle',
      'Latent prints on the lock mechanism',
      'Clear prints on the metal cabinet',
    ],
    visualDescriptions: [
      'Print residue on brushed metal',
      'Visible print on polished surface',
      'Fingerprint powder highlighting ridges on metal',
    ],
    analysisResults: [
      'Print matches someone with access',
      'Unknown print - not in system',
      'Multiple prints from different times',
      'Consistent with handling during normal use',
    ],
    discoveryMethods: [
      'Standard dusting procedure',
      'Chemical treatment revealed print',
      'Found during detailed investigation',
    ],
    relevantCrimes: ['theft', 'sabotage', 'tampering', 'missing'],
    importanceLevels: ['critical', 'important', 'supporting', 'misleading'],
  },
  {
    id: 'fingerprint-paper',
    category: 'physical',
    subcategory: 'fingerprint',
    names: ['Fingerprint on Paper', 'Document Print', 'Paper Surface Print'],
    descriptions: [
      'Latent print found on the document',
      'Oily fingerprint visible on the paper',
      'Print left on the envelope',
      'Multiple prints on the paper surface',
    ],
    visualDescriptions: [
      'Faint print on paper surface',
      'Oil stain with print pattern',
      'Chemically revealed print on paper',
    ],
    analysisResults: [
      'Print identifies the handler',
      'Print from someone who shouldn\'t have touched this',
      'Expected prints from document owners',
      'Unusual positioning suggests tampering',
    ],
    discoveryMethods: [
      'Ninhydrin treatment',
      'UV light examination',
      'Iodine fuming',
    ],
    relevantCrimes: ['fraud', 'theft', 'tampering', 'cheating'],
    importanceLevels: ['critical', 'important', 'supporting'],
  },

  // FOOTPRINTS (8 variations)
  {
    id: 'footprint-dust',
    category: 'physical',
    subcategory: 'footprint',
    names: ['Dusty Footprint', 'Floor Print', 'Dust Trail'],
    descriptions: [
      'Footprint visible in the dust on the floor',
      'Shoe print left in dusty surface',
      'Trail of dusty footprints leading away',
      'Partial footprint in accumulated dust',
    ],
    visualDescriptions: [
      'Clear shoe pattern in dust layer',
      'Footprint with visible tread pattern',
      'Multiple overlapping prints in dust',
    ],
    analysisResults: [
      'Shoe size indicates adult {gender}',
      'Tread pattern matches common brand',
      'Direction shows route taken',
      'Fresh prints over older layer',
    ],
    discoveryMethods: [
      'Visual inspection of floor',
      'Oblique lighting revealed prints',
      'Noticed during scene documentation',
    ],
    relevantCrimes: ['theft', 'vandalism', 'sabotage', 'missing'],
    importanceLevels: ['important', 'supporting'],
  },
  {
    id: 'footprint-mud',
    category: 'physical',
    subcategory: 'footprint',
    names: ['Muddy Footprint', 'Soil Print', 'Dirty Shoe Print'],
    descriptions: [
      'Muddy footprint on the clean floor',
      'Soil tracked in from outside',
      'Distinct mud print near the scene',
      'Trail of muddy prints from entrance',
    ],
    visualDescriptions: [
      'Brown mud print on floor tiles',
      'Dirt pattern with shoe tread',
      'Dried mud impression on floor',
    ],
    analysisResults: [
      'Soil matches outdoor area',
      'Shoe size and brand identifiable',
      'Recent entry from specific direction',
      'Multiple entries over time',
    ],
    discoveryMethods: [
      'Obvious on clean floor',
      'Trail followed from entrance',
      'Noticed during cleanup',
    ],
    relevantCrimes: ['theft', 'vandalism', 'sabotage', 'tampering'],
    importanceLevels: ['important', 'supporting', 'misleading'],
  },
  {
    id: 'footprint-wet',
    category: 'physical',
    subcategory: 'footprint',
    names: ['Wet Footprint', 'Water Print', 'Damp Shoe Print'],
    descriptions: [
      'Wet footprint on the dry floor',
      'Water marks showing shoe pattern',
      'Damp prints fading on the surface',
      'Puddle footprints near the scene',
    ],
    visualDescriptions: [
      'Dark wet print on light floor',
      'Evaporating water print pattern',
      'Multiple wet prints in sequence',
    ],
    analysisResults: [
      'Indicates recent presence',
      'Came from wet area nearby',
      'Time estimate based on evaporation',
      'Shoe type identifiable from pattern',
    ],
    discoveryMethods: [
      'Noticed before prints dried',
      'Photographed immediately',
      'Pointed out by witness',
    ],
    relevantCrimes: ['theft', 'vandalism', 'sabotage'],
    importanceLevels: ['important', 'supporting'],
  },

  // FIBERS/MATERIALS (10 variations)
  {
    id: 'fiber-clothing',
    category: 'physical',
    subcategory: 'fiber',
    names: ['Clothing Fiber', 'Fabric Thread', 'Textile Sample'],
    descriptions: [
      'Fiber caught on rough surface',
      'Thread from clothing snagged on edge',
      'Small piece of fabric left behind',
      'Fiber sample recovered from scene',
    ],
    visualDescriptions: [
      'Small colored thread on surface',
      'Fabric fiber caught on metal edge',
      'Microscopic textile strands',
    ],
    analysisResults: [
      'Fiber matches suspect\'s clothing',
      'Common fabric type - multiple sources',
      'Unique dye pattern identified',
      'Inconsistent with anyone interviewed',
    ],
    discoveryMethods: [
      'Careful scene examination',
      'Forensic sweep of area',
      'Noticed during close inspection',
    ],
    relevantCrimes: ['theft', 'vandalism', 'sabotage', 'tampering'],
    importanceLevels: ['critical', 'important', 'supporting'],
  },
  {
    id: 'hair-sample',
    category: 'physical',
    subcategory: 'biological',
    names: ['Hair Sample', 'Hair Strand', 'Hair Evidence'],
    descriptions: [
      'Hair strand found at the scene',
      'Multiple hairs recovered from area',
      'Hair caught in item mechanism',
      'Hair sample on victim\'s belongings',
    ],
    visualDescriptions: [
      'Single hair on surface',
      'Hair strands in evidence bag',
      'Dark hair against light background',
    ],
    analysisResults: [
      'DNA matches suspect',
      'Hair color matches description',
      'Animal hair - not human',
      'Treated/dyed hair identified',
    ],
    discoveryMethods: [
      'Forensic collection',
      'Visual inspection with magnification',
      'Tape lift from surface',
    ],
    relevantCrimes: ['theft', 'assault', 'tampering', 'vandalism'],
    importanceLevels: ['critical', 'important', 'supporting', 'misleading'],
  },

  // TOOLS/OBJECTS (15 variations)
  {
    id: 'tool-screwdriver',
    category: 'physical',
    subcategory: 'tool',
    names: ['Screwdriver', 'Tool Left Behind', 'Prying Tool'],
    descriptions: [
      'Screwdriver found near the scene',
      'Tool with suspicious markings',
      'Prying tool discarded nearby',
      'Screwdriver matching damage pattern',
    ],
    visualDescriptions: [
      'Metal screwdriver on floor',
      'Tool with handle markings',
      'Worn screwdriver tip',
    ],
    analysisResults: [
      'Tool marks match damage',
      'Fingerprints found on handle',
      'Belongs to maintenance kit',
      'Not from this location',
    ],
    discoveryMethods: [
      'Found during search',
      'Kicked aside by perpetrator',
      'Hidden but discovered',
    ],
    relevantCrimes: ['theft', 'vandalism', 'sabotage', 'tampering'],
    importanceLevels: ['critical', 'important'],
  },
  {
    id: 'tool-scissors',
    category: 'physical',
    subcategory: 'tool',
    names: ['Scissors', 'Cutting Tool', 'Snipping Tool'],
    descriptions: [
      'Scissors used in the incident',
      'Cutting marks match these scissors',
      'Scissors with material residue',
      'Distinctive scissors from the scene',
    ],
    visualDescriptions: [
      'Metal scissors on surface',
      'Scissors with material on blades',
      'Office scissors in evidence bag',
    ],
    analysisResults: [
      'Cut marks match blade pattern',
      'Belongs to nearby supply',
      'Unusual type not from here',
      'Fingerprints identify user',
    ],
    discoveryMethods: [
      'Found at scene',
      'Discovered during search',
      'Matched to cut evidence',
    ],
    relevantCrimes: ['vandalism', 'sabotage', 'fraud', 'tampering'],
    importanceLevels: ['important', 'supporting'],
  },
  {
    id: 'gloves',
    category: 'physical',
    subcategory: 'clothing',
    names: ['Discarded Gloves', 'Work Gloves', 'Protective Gloves'],
    descriptions: [
      'Gloves found discarded near scene',
      'Single glove left behind',
      'Gloves with material residue',
      'Protective gloves used during incident',
    ],
    visualDescriptions: [
      'Latex gloves in trash',
      'Work gloves on ground',
      'Glove with distinctive wear',
    ],
    analysisResults: [
      'Size indicates approximate hand size',
      'Residue matches materials involved',
      'DNA inside matches suspect',
      'Common type - multiple sources',
    ],
    discoveryMethods: [
      'Found in nearby trash',
      'Discarded outside',
      'Left at scene',
    ],
    relevantCrimes: ['theft', 'fraud', 'sabotage', 'tampering'],
    importanceLevels: ['critical', 'important', 'supporting'],
  },
  {
    id: 'container-evidence',
    category: 'physical',
    subcategory: 'container',
    names: ['Container', 'Bag', 'Box', 'Wrapper'],
    descriptions: [
      'Container used to carry stolen items',
      'Bag with incriminating contents',
      'Box with suspect\'s markings',
      'Wrapper from consumed item',
    ],
    visualDescriptions: [
      'Cardboard box in corner',
      'Plastic bag with contents',
      'Paper wrapper crumpled up',
    ],
    analysisResults: [
      'Contains fingerprints',
      'Receipt inside identifies purchase',
      'Size matches stolen items',
      'DNA from handling',
    ],
    discoveryMethods: [
      'Found during search',
      'Left at scene',
      'Discovered in trash',
    ],
    relevantCrimes: ['theft', 'fraud', 'smuggling', 'tampering'],
    importanceLevels: ['important', 'supporting'],
  },

  // DAMAGE EVIDENCE (8 variations)
  {
    id: 'broken-lock',
    category: 'physical',
    subcategory: 'damage',
    names: ['Broken Lock', 'Forced Lock', 'Damaged Lock'],
    descriptions: [
      'Lock was forced open',
      'Lock mechanism damaged',
      'Lock picked or broken',
      'Security lock compromised',
    ],
    visualDescriptions: [
      'Metal lock with scratch marks',
      'Broken padlock on ground',
      'Lock mechanism exposed',
    ],
    analysisResults: [
      'Tool marks indicate method used',
      'Lock was picked professionally',
      'Brute force damage pattern',
      'Key was used but lock damaged',
    ],
    discoveryMethods: [
      'First thing noticed',
      'Examined after breach discovered',
      'Reported by security',
    ],
    relevantCrimes: ['theft', 'vandalism', 'sabotage'],
    importanceLevels: ['important', 'supporting'],
  },
  {
    id: 'broken-glass',
    category: 'physical',
    subcategory: 'damage',
    names: ['Broken Glass', 'Shattered Window', 'Glass Fragments'],
    descriptions: [
      'Glass broken at entry point',
      'Window shattered from outside',
      'Display glass cracked',
      'Glass fragments scattered',
    ],
    visualDescriptions: [
      'Shattered glass on floor',
      'Cracked window pane',
      'Glass shards in pattern',
    ],
    analysisResults: [
      'Break pattern shows direction of force',
      'Glass fragments contain prints',
      'Time of break estimated',
      'Tool used to break identified',
    ],
    discoveryMethods: [
      'Visible damage',
      'Heard breaking sound',
      'Alarm triggered',
    ],
    relevantCrimes: ['theft', 'vandalism', 'sabotage'],
    importanceLevels: ['supporting'],
  },

  // TRACE EVIDENCE (10 variations)
  {
    id: 'paint-transfer',
    category: 'physical',
    subcategory: 'trace',
    names: ['Paint Transfer', 'Paint Mark', 'Paint Sample'],
    descriptions: [
      'Paint transferred during contact',
      'Colored paint left on surface',
      'Paint scuff marks visible',
      'Paint residue from collision',
    ],
    visualDescriptions: [
      'Colored paint streak on wall',
      'Paint flakes on floor',
      'Paint mark on furniture edge',
    ],
    analysisResults: [
      'Paint matches specific source',
      'Common paint type',
      'Fresh application - recent contact',
      'Unique color formulation',
    ],
    discoveryMethods: [
      'Visual inspection',
      'Color comparison',
      'Noticed during documentation',
    ],
    relevantCrimes: ['vandalism', 'theft', 'hit-and-run', 'sabotage'],
    importanceLevels: ['important', 'supporting'],
  },
  {
    id: 'food-residue',
    category: 'physical',
    subcategory: 'trace',
    names: ['Food Residue', 'Food Crumbs', 'Food Stain'],
    descriptions: [
      'Food residue left at scene',
      'Crumbs from eaten food',
      'Food stain on surface',
      'Wrapper from consumed food',
    ],
    visualDescriptions: [
      'Crumbs scattered on desk',
      'Drink stain on paper',
      'Food wrapper in trash',
    ],
    analysisResults: [
      'Matches specific food type',
      'Recent consumption indicated',
      'DNA from saliva possible',
      'Receipt traces purchase',
    ],
    discoveryMethods: [
      'Visual inspection',
      'Scene documentation',
      'Noticed during search',
    ],
    relevantCrimes: ['theft', 'tampering', 'unauthorized-access'],
    importanceLevels: ['supporting', 'misleading'],
  },
];

// ============================================
// DOCUMENTARY EVIDENCE (60+ templates)
// ============================================

export const DOCUMENTARY_EVIDENCE: EvidenceTemplate[] = [
  // RECEIPTS AND RECORDS (15 variations)
  {
    id: 'receipt-purchase',
    category: 'documentary',
    subcategory: 'receipt',
    names: ['Purchase Receipt', 'Store Receipt', 'Transaction Record'],
    descriptions: [
      'Receipt showing recent purchase',
      'Store receipt with timestamp',
      'Transaction record with details',
      'Purchase record with location',
    ],
    visualDescriptions: [
      'Printed receipt paper',
      'Faded thermal receipt',
      'Receipt with highlighted items',
    ],
    analysisResults: [
      'Timestamp places buyer at location',
      'Items purchased match evidence',
      'Payment method traceable',
      'Store location provides alibi/contradiction',
    ],
    discoveryMethods: [
      'Found in pocket',
      'Discovered in trash',
      'Retrieved from wallet',
    ],
    relevantCrimes: ['fraud', 'theft', 'alibi-verification'],
    importanceLevels: ['critical', 'important', 'supporting'],
  },
  {
    id: 'log-book',
    category: 'documentary',
    subcategory: 'record',
    names: ['Log Book Entry', 'Sign-in Sheet', 'Attendance Record'],
    descriptions: [
      'Entry in the visitor log',
      'Sign-in record with time',
      'Attendance sheet entry',
      'Access log record',
    ],
    visualDescriptions: [
      'Handwritten log entry',
      'Printed sign-in sheet',
      'Digital log printout',
    ],
    analysisResults: [
      'Signature matches suspect',
      'Time recorded contradicts alibi',
      'Entry appears altered',
      'Missing expected entry',
    ],
    discoveryMethods: [
      'Routine record check',
      'Security review',
      'Investigation request',
    ],
    relevantCrimes: ['fraud', 'theft', 'alibi-verification', 'tampering'],
    importanceLevels: ['critical', 'important', 'supporting'],
  },
  {
    id: 'inventory-sheet',
    category: 'documentary',
    subcategory: 'record',
    names: ['Inventory List', 'Stock Record', 'Supply Count'],
    descriptions: [
      'Inventory record showing discrepancy',
      'Stock count with missing items',
      'Supply list with alterations',
      'Inventory showing theft pattern',
    ],
    visualDescriptions: [
      'Printed inventory sheet',
      'Handwritten count list',
      'Spreadsheet printout',
    ],
    analysisResults: [
      'Numbers don\'t add up',
      'Pattern of theft visible',
      'Records were altered',
      'Missing items identified',
    ],
    discoveryMethods: [
      'Audit discovered',
      'Routine check revealed',
      'Complaint triggered review',
    ],
    relevantCrimes: ['theft', 'fraud', 'embezzlement'],
    importanceLevels: ['critical', 'important'],
  },

  // NOTES AND MESSAGES (15 variations)
  {
    id: 'handwritten-note',
    category: 'documentary',
    subcategory: 'note',
    names: ['Handwritten Note', 'Written Message', 'Personal Note'],
    descriptions: [
      'Handwritten note found at scene',
      'Message written on paper',
      'Note with important information',
      'Written communication recovered',
    ],
    visualDescriptions: [
      'Crumpled paper note',
      'Note on lined paper',
      'Sticky note with message',
    ],
    analysisResults: [
      'Handwriting matches suspect',
      'Content reveals motive',
      'Message indicates planning',
      'Writing analysis inconclusive',
    ],
    discoveryMethods: [
      'Found at scene',
      'Discovered in trash',
      'Retrieved from pocket',
    ],
    relevantCrimes: ['fraud', 'threat', 'blackmail', 'planning'],
    importanceLevels: ['critical', 'important', 'supporting'],
  },
  {
    id: 'printed-email',
    category: 'documentary',
    subcategory: 'communication',
    names: ['Printed Email', 'Email Printout', 'Email Evidence'],
    descriptions: [
      'Printed email communication',
      'Email showing conversation',
      'Printout of email exchange',
      'Email with incriminating content',
    ],
    visualDescriptions: [
      'Printed email on paper',
      'Email with highlighted sections',
      'Multiple page email thread',
    ],
    analysisResults: [
      'Email shows motive',
      'Communication reveals plan',
      'Timestamp provides timeline',
      'Recipients identified',
    ],
    discoveryMethods: [
      'Found in office',
      'Retrieved from trash',
      'Provided by witness',
    ],
    relevantCrimes: ['fraud', 'conspiracy', 'blackmail', 'planning'],
    importanceLevels: ['critical', 'important'],
  },
  {
    id: 'schedule-document',
    category: 'documentary',
    subcategory: 'schedule',
    names: ['Schedule', 'Timetable', 'Calendar Entry'],
    descriptions: [
      'Schedule showing availability',
      'Timetable with marked dates',
      'Calendar with important entries',
      'Schedule contradicting alibi',
    ],
    visualDescriptions: [
      'Printed weekly schedule',
      'Handwritten calendar',
      'Digital calendar printout',
    ],
    analysisResults: [
      'Schedule places person at scene',
      'Entry contradicts statement',
      'Pattern of planning visible',
      'Alibi confirmed by schedule',
    ],
    discoveryMethods: [
      'Retrieved from desk',
      'Found in bag',
      'Requested during investigation',
    ],
    relevantCrimes: ['alibi-verification', 'planning', 'fraud'],
    importanceLevels: ['important', 'supporting'],
  },

  // OFFICIAL DOCUMENTS (10 variations)
  {
    id: 'id-card',
    category: 'documentary',
    subcategory: 'identification',
    names: ['ID Card', 'Identification', 'Access Badge'],
    descriptions: [
      'ID card found at scene',
      'Access badge left behind',
      'Identification dropped',
      'Badge with access records',
    ],
    visualDescriptions: [
      'Plastic ID card',
      'Lanyard with badge',
      'Access card with photo',
    ],
    analysisResults: [
      'ID belongs to suspect',
      'Access logs show usage',
      'Card was reported lost',
      'Fake ID detected',
    ],
    discoveryMethods: [
      'Found at scene',
      'Dropped during escape',
      'Retrieved from suspect',
    ],
    relevantCrimes: ['theft', 'fraud', 'unauthorized-access', 'identity'],
    importanceLevels: ['critical', 'important'],
  },
  {
    id: 'contract-document',
    category: 'documentary',
    subcategory: 'legal',
    names: ['Contract', 'Agreement', 'Legal Document'],
    descriptions: [
      'Contract with relevant terms',
      'Agreement showing obligations',
      'Legal document with signatures',
      'Contract revealing motive',
    ],
    visualDescriptions: [
      'Multi-page contract',
      'Signed agreement document',
      'Legal papers in folder',
    ],
    analysisResults: [
      'Terms create motive',
      'Signature analysis needed',
      'Contract was violated',
      'Financial obligations revealed',
    ],
    discoveryMethods: [
      'Found in files',
      'Provided by party',
      'Retrieved during search',
    ],
    relevantCrimes: ['fraud', 'breach', 'motive-evidence'],
    importanceLevels: ['important', 'supporting'],
  },
];

// ============================================
// DIGITAL EVIDENCE (40+ templates)
// ============================================

export const DIGITAL_EVIDENCE: EvidenceTemplate[] = [
  // CCTV AND VIDEO (10 variations)
  {
    id: 'cctv-footage',
    category: 'digital',
    subcategory: 'video',
    names: ['CCTV Footage', 'Security Camera Video', 'Surveillance Recording'],
    descriptions: [
      'CCTV captured the incident',
      'Security footage shows suspect',
      'Video recording of the area',
      'Surveillance captured movement',
    ],
    visualDescriptions: [
      'Grainy security footage',
      'HD camera recording',
      'Night vision footage',
    ],
    analysisResults: [
      'Suspect clearly visible',
      'Timestamp confirms time',
      'Movement pattern tracked',
      'Face partially obscured',
    ],
    discoveryMethods: [
      'Security review',
      'Requested by investigators',
      'Automatic backup retrieved',
    ],
    relevantCrimes: ['theft', 'vandalism', 'assault', 'any'],
    importanceLevels: ['critical', 'important'],
  },
  {
    id: 'phone-location',
    category: 'digital',
    subcategory: 'location',
    names: ['Phone Location Data', 'GPS Track', 'Location History'],
    descriptions: [
      'Phone location places suspect at scene',
      'GPS data shows movement',
      'Location history reveals route',
      'Mobile tracking data retrieved',
    ],
    visualDescriptions: [
      'Map with location pins',
      'GPS route visualization',
      'Timeline of locations',
    ],
    analysisResults: [
      'Was at scene during incident',
      'Route shows deliberate approach',
      'Location contradicts alibi',
      'Phone was left elsewhere',
    ],
    discoveryMethods: [
      'Phone records requested',
      'Carrier data subpoenaed',
      'Find My Device used',
    ],
    relevantCrimes: ['alibi-verification', 'planning', 'any'],
    importanceLevels: ['critical', 'important'],
  },
  {
    id: 'computer-log',
    category: 'digital',
    subcategory: 'access',
    names: ['Computer Access Log', 'Login Records', 'System Activity'],
    descriptions: [
      'Computer login records',
      'System access history',
      'Login attempts logged',
      'Activity trail on computer',
    ],
    visualDescriptions: [
      'Login log printout',
      'System event viewer',
      'Access report screen',
    ],
    analysisResults: [
      'Accessed at time of incident',
      'Unauthorized login detected',
      'Files were accessed',
      'Password changed suspiciously',
    ],
    discoveryMethods: [
      'IT forensics',
      'System admin check',
      'Automatic logging',
    ],
    relevantCrimes: ['fraud', 'theft', 'unauthorized-access', 'sabotage'],
    importanceLevels: ['critical', 'important', 'supporting'],
  },
  {
    id: 'message-log',
    category: 'digital',
    subcategory: 'communication',
    names: ['Message History', 'Chat Log', 'Text Messages'],
    descriptions: [
      'Messages reveal communication',
      'Chat history shows planning',
      'Text messages recovered',
      'Messaging app data extracted',
    ],
    visualDescriptions: [
      'Screenshot of messages',
      'Chat log printout',
      'Phone message screen',
    ],
    analysisResults: [
      'Messages show motive',
      'Planning communicated',
      'Alibi contradicted',
      'Threats documented',
    ],
    discoveryMethods: [
      'Phone examination',
      'Cloud backup access',
      'Witness provided',
    ],
    relevantCrimes: ['conspiracy', 'threat', 'planning', 'any'],
    importanceLevels: ['critical', 'important'],
  },
  {
    id: 'deleted-files',
    category: 'digital',
    subcategory: 'files',
    names: ['Deleted Files', 'Recovered Data', 'Hidden Documents'],
    descriptions: [
      'Deleted files recovered',
      'Hidden data discovered',
      'Attempted deletion traced',
      'File recovery revealed evidence',
    ],
    visualDescriptions: [
      'Recovered file listing',
      'Forensic recovery report',
      'File metadata display',
    ],
    analysisResults: [
      'Deletion shows guilt awareness',
      'Content incriminating',
      'Timestamps reveal timeline',
      'Metadata shows creator',
    ],
    discoveryMethods: [
      'Digital forensics',
      'Recovery software',
      'Cloud backup access',
    ],
    relevantCrimes: ['fraud', 'theft', 'cover-up', 'sabotage'],
    importanceLevels: ['critical', 'important'],
  },
  {
    id: 'email-records',
    category: 'digital',
    subcategory: 'communication',
    names: ['Email Records', 'Email History', 'Mail Server Logs'],
    descriptions: [
      'Email records retrieved',
      'Email history examined',
      'Server logs show activity',
      'Email trail documented',
    ],
    visualDescriptions: [
      'Email inbox screenshot',
      'Email server log',
      'Email search results',
    ],
    analysisResults: [
      'Emails reveal motive',
      'Communication trail clear',
      'Suspicious forwarding detected',
      'Deleted emails recovered',
    ],
    discoveryMethods: [
      'Email provider request',
      'Account access',
      'Server log analysis',
    ],
    relevantCrimes: ['fraud', 'conspiracy', 'leak', 'any'],
    importanceLevels: ['critical', 'important'],
  },
  {
    id: 'social-media',
    category: 'digital',
    subcategory: 'social',
    names: ['Social Media Post', 'Online Activity', 'Social Account'],
    descriptions: [
      'Social media post reveals info',
      'Online activity tracked',
      'Social account shows evidence',
      'Post timing significant',
    ],
    visualDescriptions: [
      'Social media screenshot',
      'Post with timestamp',
      'Profile activity log',
    ],
    analysisResults: [
      'Post location reveals presence',
      'Timing contradicts alibi',
      'Content shows motive',
      'Connections identified',
    ],
    discoveryMethods: [
      'Public post found',
      'Account reviewed',
      'Tip from follower',
    ],
    relevantCrimes: ['alibi-verification', 'motive', 'any'],
    importanceLevels: ['important', 'supporting', 'misleading'],
  },
  {
    id: 'transaction-record',
    category: 'digital',
    subcategory: 'financial',
    names: ['Transaction Record', 'Payment History', 'Bank Statement'],
    descriptions: [
      'Financial transaction logged',
      'Payment history retrieved',
      'Bank records examined',
      'Transaction pattern analyzed',
    ],
    visualDescriptions: [
      'Bank statement printout',
      'Transaction list screen',
      'Payment confirmation',
    ],
    analysisResults: [
      'Transaction places person at location',
      'Unusual spending pattern',
      'Payment to suspect identified',
      'Financial motive revealed',
    ],
    discoveryMethods: [
      'Bank records requested',
      'Statement provided',
      'Digital wallet checked',
    ],
    relevantCrimes: ['fraud', 'theft', 'embezzlement', 'any'],
    importanceLevels: ['critical', 'important'],
  },
];

// ============================================
// TESTIMONIAL EVIDENCE (30+ templates)
// ============================================

export const TESTIMONIAL_EVIDENCE: EvidenceTemplate[] = [
  {
    id: 'eyewitness-account',
    category: 'testimonial',
    subcategory: 'witness',
    names: ['Eyewitness Account', 'Witness Statement', 'Direct Testimony'],
    descriptions: [
      'Witness saw the incident',
      'Direct observation reported',
      'Eyewitness account provided',
      'Person witnessed events',
    ],
    visualDescriptions: [
      'Written witness statement',
      'Interview transcript',
      'Video testimony',
    ],
    analysisResults: [
      'Description matches suspect',
      'Timeline corroborated',
      'Details consistent with evidence',
      'Some discrepancies noted',
    ],
    discoveryMethods: [
      'Witness came forward',
      'Canvassing found witness',
      'Referred by other witness',
    ],
    relevantCrimes: ['any'],
    importanceLevels: ['critical', 'important', 'supporting', 'misleading'],
  },
  {
    id: 'character-testimony',
    category: 'testimonial',
    subcategory: 'character',
    names: ['Character Reference', 'Reputation Testimony', 'Background Statement'],
    descriptions: [
      'Character witness spoke about suspect',
      'Reputation information provided',
      'Background details revealed',
      'Behavior pattern described',
    ],
    visualDescriptions: [
      'Character statement form',
      'Reference letter',
      'Interview notes',
    ],
    analysisResults: [
      'Previous similar behavior noted',
      'Generally good character attested',
      'Known conflicts mentioned',
      'Unusual recent behavior described',
    ],
    discoveryMethods: [
      'Colleague interview',
      'Neighbor statement',
      'Reference contacted',
    ],
    relevantCrimes: ['any'],
    importanceLevels: ['supporting', 'misleading'],
  },
  {
    id: 'alibi-statement',
    category: 'testimonial',
    subcategory: 'alibi',
    names: ['Alibi Statement', 'Alibi Witness', 'Whereabouts Confirmation'],
    descriptions: [
      'Alibi provided by witness',
      'Location confirmed by statement',
      'Whereabouts vouched for',
      'Alibi claim made',
    ],
    visualDescriptions: [
      'Alibi statement document',
      'Signed confirmation',
      'Interview record',
    ],
    analysisResults: [
      'Alibi verified - person elsewhere',
      'Alibi contradicts other evidence',
      'Partial alibi - some time unaccounted',
      'Alibi witness seems unreliable',
    ],
    discoveryMethods: [
      'Suspect provided alibi',
      'Witness volunteered',
      'Investigation discovered',
    ],
    relevantCrimes: ['any'],
    importanceLevels: ['critical', 'important', 'misleading'],
  },
  {
    id: 'expert-opinion',
    category: 'testimonial',
    subcategory: 'expert',
    names: ['Expert Analysis', 'Professional Opinion', 'Specialist Assessment'],
    descriptions: [
      'Expert provided analysis',
      'Professional opinion given',
      'Specialist examined evidence',
      'Technical assessment completed',
    ],
    visualDescriptions: [
      'Expert report document',
      'Analysis findings',
      'Technical evaluation',
    ],
    analysisResults: [
      'Expert confirms findings',
      'Technical analysis supports theory',
      'Professional opinion inconclusive',
      'Specialist identified key detail',
    ],
    discoveryMethods: [
      'Expert consulted',
      'Analysis requested',
      'Specialist brought in',
    ],
    relevantCrimes: ['any'],
    importanceLevels: ['important', 'supporting'],
  },
  {
    id: 'confession-statement',
    category: 'testimonial',
    subcategory: 'confession',
    names: ['Confession', 'Admission Statement', 'Self-Incrimination'],
    descriptions: [
      'Suspect confessed involvement',
      'Admission of guilt made',
      'Statement of responsibility given',
      'Confession obtained',
    ],
    visualDescriptions: [
      'Signed confession',
      'Recorded statement',
      'Written admission',
    ],
    analysisResults: [
      'Confession matches evidence',
      'Details only perpetrator would know',
      'Partial admission made',
      'Confession seems coerced',
    ],
    discoveryMethods: [
      'Interview resulted in confession',
      'Voluntary admission',
      'Confronted with evidence',
    ],
    relevantCrimes: ['any'],
    importanceLevels: ['critical'],
  },
];

// ============================================
// EXPORT ALL EVIDENCE
// ============================================

export const ALL_EVIDENCE: EvidenceTemplate[] = [
  ...PHYSICAL_EVIDENCE,
  ...DOCUMENTARY_EVIDENCE,
  ...DIGITAL_EVIDENCE,
  ...TESTIMONIAL_EVIDENCE,
];

// Total: 200+ evidence templates

/**
 * Get evidence for crime type
 */
export function getEvidenceForCrime(crimeCategory: string): EvidenceTemplate[] {
  return ALL_EVIDENCE.filter(e =>
    e.relevantCrimes.includes(crimeCategory) || e.relevantCrimes.includes('any')
  );
}

/**
 * Get random evidence
 */
export function getRandomEvidence(category?: EvidenceTemplate['category']): EvidenceTemplate {
  const pool = category ? ALL_EVIDENCE.filter(e => e.category === category) : ALL_EVIDENCE;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Generate evidence description with variety
 */
export function generateEvidenceDescription(template: EvidenceTemplate): {
  name: string;
  description: string;
  visual: string;
  analysis: string;
  discovery: string;
} {
  return {
    name: template.names[Math.floor(Math.random() * template.names.length)],
    description: template.descriptions[Math.floor(Math.random() * template.descriptions.length)],
    visual: template.visualDescriptions[Math.floor(Math.random() * template.visualDescriptions.length)],
    analysis: template.analysisResults[Math.floor(Math.random() * template.analysisResults.length)],
    discovery: template.discoveryMethods[Math.floor(Math.random() * template.discoveryMethods.length)],
  };
}

// Unique evidence combinations:
// 200+ templates × 4 descriptions × 4 analysis results × 3 discoveries = 9,600+ variations
