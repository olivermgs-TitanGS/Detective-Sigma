/**
 * SCALABLE CRIME TYPES SYSTEM
 *
 * 50+ distinct crime types with modular components.
 * Each crime type can combine with any location for unique scenarios.
 */

export interface CrimeType {
  id: string;
  category: 'theft' | 'fraud' | 'vandalism' | 'sabotage' | 'cheating' | 'missing' | 'tampering' | 'harassment' | 'negligence';
  name: string;
  severity: 'minor' | 'moderate' | 'serious';

  // Multiple description templates (use {victim}, {item}, {location} placeholders)
  descriptions: string[];

  // What the crime looks like at the scene
  sceneImpacts: string[];

  // Types of evidence typically left behind
  evidenceTypes: string[];

  // Possible motives for this crime
  possibleMotives: string[];

  // How it's typically discovered
  discoveryMethods: string[];

  // Compatible location categories
  compatibleLocations: ('school' | 'commercial' | 'residential' | 'public' | 'industrial')[];
}

// ============================================
// THEFT CRIMES (15 variations)
// ============================================

export const THEFT_CRIMES: CrimeType[] = [
  {
    id: 'petty-theft-cash',
    category: 'theft',
    name: 'Cash Theft',
    severity: 'moderate',
    descriptions: [
      'Money has gone missing from the {location}',
      'Cash was stolen from {victim}\'s drawer',
      'The petty cash box at {location} has been emptied',
      'Collection money disappeared from the {location}',
    ],
    sceneImpacts: [
      'Empty cash box left open',
      'Drawer left slightly ajar',
      'Signs of hurried searching',
      'Items displaced but not damaged',
    ],
    evidenceTypes: ['fingerprint', 'footprint', 'witness', 'cctv', 'transaction-record'],
    possibleMotives: ['financial-need', 'greed', 'desperation', 'opportunity', 'gambling-debt'],
    discoveryMethods: [
      'Routine cash count revealed discrepancy',
      'Victim noticed money missing',
      'Audit discovered the shortage',
      'Someone saw suspicious behavior',
    ],
    compatibleLocations: ['school', 'commercial', 'public'],
  },
  {
    id: 'equipment-theft',
    category: 'theft',
    name: 'Equipment Theft',
    severity: 'serious',
    descriptions: [
      'Expensive equipment has been stolen from {location}',
      'The {item} went missing from the storage room',
      'Scientific instruments disappeared from {location}',
      'Sports equipment was taken from the equipment room',
    ],
    sceneImpacts: [
      'Empty space where item should be',
      'Storage lock was picked or forced',
      'Inventory tags removed',
      'Dust outline showing missing item',
    ],
    evidenceTypes: ['fingerprint', 'inventory-record', 'cctv', 'access-log', 'witness'],
    possibleMotives: ['resale', 'personal-use', 'sabotage', 'revenge', 'opportunity'],
    discoveryMethods: [
      'Staff noticed during routine check',
      'Inventory audit revealed missing items',
      'Someone needed the equipment and found it gone',
      'Security noticed on CCTV review',
    ],
    compatibleLocations: ['school', 'commercial', 'industrial'],
  },
  {
    id: 'food-theft',
    category: 'theft',
    name: 'Food Theft',
    severity: 'minor',
    descriptions: [
      'Food items keep disappearing from {location}',
      'Someone has been stealing ingredients from the kitchen',
      'The canteen reported missing food supplies',
      'Lunch boxes have been going missing from the fridge',
    ],
    sceneImpacts: [
      'Missing items from refrigerator',
      'Empty containers left behind',
      'Wrapper or crumbs as evidence',
      'Fridge door not properly closed',
    ],
    evidenceTypes: ['wrapper', 'crumb', 'fingerprint', 'witness', 'cctv'],
    possibleMotives: ['hunger', 'poverty', 'prank', 'laziness', 'entitlement'],
    discoveryMethods: [
      'Owner noticed lunch missing',
      'Inventory showed shortage',
      'Caught on camera',
      'Witness saw someone taking food',
    ],
    compatibleLocations: ['school', 'commercial', 'public'],
  },
  {
    id: 'wallet-theft',
    category: 'theft',
    name: 'Wallet/Purse Theft',
    severity: 'moderate',
    descriptions: [
      '{victim}\'s wallet was stolen from their bag',
      'A purse went missing at {location}',
      'Someone\'s wallet disappeared during the event',
      'Personal valuables were taken from {victim}',
    ],
    sceneImpacts: [
      'Bag left partially open',
      'Belongings disturbed',
      'Cards found discarded nearby',
      'Empty wallet found in trash',
    ],
    evidenceTypes: ['fingerprint', 'cctv', 'witness', 'discarded-item', 'transaction-record'],
    possibleMotives: ['financial-need', 'greed', 'desperation', 'opportunity', 'addiction'],
    discoveryMethods: [
      'Victim reached for wallet and found it missing',
      'Credit card fraud alert',
      'Wallet found empty in nearby location',
      'Witness saw suspicious behavior',
    ],
    compatibleLocations: ['school', 'commercial', 'public', 'residential'],
  },
  {
    id: 'phone-theft',
    category: 'theft',
    name: 'Mobile Phone Theft',
    severity: 'moderate',
    descriptions: [
      '{victim}\'s phone was stolen at {location}',
      'A smartphone went missing during class',
      'Someone\'s phone disappeared from the table',
      'Mobile device stolen from locker',
    ],
    sceneImpacts: [
      'Charging cable left behind',
      'Phone case found discarded',
      'Location tracking shows movement',
      'Empty locker',
    ],
    evidenceTypes: ['gps-track', 'cctv', 'witness', 'fingerprint', 'phone-log'],
    possibleMotives: ['resale', 'jealousy', 'revenge', 'opportunity', 'need'],
    discoveryMethods: [
      'Victim couldn\'t find their phone',
      'GPS tracking showed unusual location',
      'Phone was spotted with another person',
      'Empty charger noticed',
    ],
    compatibleLocations: ['school', 'commercial', 'public'],
  },
  {
    id: 'document-theft',
    category: 'theft',
    name: 'Document Theft',
    severity: 'serious',
    descriptions: [
      'Important documents were stolen from {location}',
      'Exam papers went missing before the test',
      'Confidential files disappeared from the office',
      'Contract documents were taken from the drawer',
    ],
    sceneImpacts: [
      'Filing cabinet left open',
      'Folder missing from stack',
      'Photocopier recently used',
      'Computer files accessed',
    ],
    evidenceTypes: ['fingerprint', 'access-log', 'photocopy-evidence', 'cctv', 'witness'],
    possibleMotives: ['cheating', 'espionage', 'blackmail', 'revenge', 'competitive-advantage'],
    discoveryMethods: [
      'File was needed and found missing',
      'Audit revealed missing documents',
      'Information appeared leaked',
      'Access logs showed suspicious entry',
    ],
    compatibleLocations: ['school', 'commercial', 'public'],
  },
  {
    id: 'bicycle-theft',
    category: 'theft',
    name: 'Bicycle Theft',
    severity: 'moderate',
    descriptions: [
      'A bicycle was stolen from the rack at {location}',
      '{victim}\'s bike disappeared from the parking area',
      'Someone cut the lock and took the bicycle',
      'The community bike went missing',
    ],
    sceneImpacts: [
      'Cut lock left behind',
      'Empty bicycle rack slot',
      'Tool marks on rack',
      'Tire tracks leading away',
    ],
    evidenceTypes: ['cut-lock', 'cctv', 'witness', 'tire-track', 'tool-mark'],
    possibleMotives: ['need-transport', 'resale', 'revenge', 'joyriding', 'opportunity'],
    discoveryMethods: [
      'Owner returned to find bike missing',
      'Security noticed on patrol',
      'Bike found abandoned elsewhere',
      'CCTV review showed theft',
    ],
    compatibleLocations: ['school', 'commercial', 'public', 'residential'],
  },
  {
    id: 'book-theft',
    category: 'theft',
    name: 'Book/Material Theft',
    severity: 'minor',
    descriptions: [
      'Library books have been going missing',
      'Textbooks were stolen from {location}',
      'Someone took materials from the resource room',
      'Reference books disappeared from the shelf',
    ],
    sceneImpacts: [
      'Empty slot on bookshelf',
      'Security tag deactivated',
      'Bag inspection refused',
      'Books hidden in unexpected places',
    ],
    evidenceTypes: ['library-record', 'cctv', 'witness', 'security-tag', 'bag-search'],
    possibleMotives: ['need', 'resale', 'laziness', 'forgetfulness', 'entitlement'],
    discoveryMethods: [
      'Library inventory check',
      'Security alarm triggered',
      'Book found for sale online',
      'Witness reported suspicious behavior',
    ],
    compatibleLocations: ['school', 'commercial', 'public'],
  },
  {
    id: 'jewelry-theft',
    category: 'theft',
    name: 'Jewelry/Valuables Theft',
    severity: 'serious',
    descriptions: [
      'Jewelry was stolen from {victim}',
      'Valuable items went missing from the display',
      'Someone took the prize medals from {location}',
      'Trophies disappeared from the cabinet',
    ],
    sceneImpacts: [
      'Display case opened or broken',
      'Empty jewelry box',
      'Trophy slots empty',
      'Glass shards on floor',
    ],
    evidenceTypes: ['fingerprint', 'cctv', 'witness', 'glass-fragment', 'pawn-record'],
    possibleMotives: ['greed', 'financial-need', 'jealousy', 'revenge', 'opportunity'],
    discoveryMethods: [
      'Owner noticed missing items',
      'Display found tampered with',
      'Item spotted at pawn shop',
      'Insurance claim revealed theft',
    ],
    compatibleLocations: ['school', 'commercial', 'residential'],
  },
  {
    id: 'supply-theft',
    category: 'theft',
    name: 'Supply/Inventory Theft',
    severity: 'moderate',
    descriptions: [
      'Supplies have been disappearing from storage',
      'Inventory counts keep coming up short',
      'Someone is taking materials from {location}',
      'Stock levels don\'t match records',
    ],
    sceneImpacts: [
      'Inventory discrepancy',
      'Storage area disorganized',
      'Records altered',
      'Packaging found disposed',
    ],
    evidenceTypes: ['inventory-record', 'cctv', 'access-log', 'witness', 'disposal-evidence'],
    possibleMotives: ['resale', 'personal-use', 'side-business', 'greed', 'need'],
    discoveryMethods: [
      'Inventory audit discovered shortage',
      'Supplier questioned missing orders',
      'Items found at employee\'s home',
      'Pattern of shrinkage noticed',
    ],
    compatibleLocations: ['school', 'commercial', 'industrial'],
  },
];

// ============================================
// FRAUD CRIMES (12 variations)
// ============================================

export const FRAUD_CRIMES: CrimeType[] = [
  {
    id: 'accounting-fraud',
    category: 'fraud',
    name: 'Accounting Fraud',
    severity: 'serious',
    descriptions: [
      'Financial records at {location} have been falsified',
      'Someone has been cooking the books',
      'Fund misappropriation discovered at {location}',
      'Fake receipts submitted for reimbursement',
    ],
    sceneImpacts: [
      'Altered financial records',
      'Missing receipt books',
      'Unexplained transfers',
      'Discrepancies in accounts',
    ],
    evidenceTypes: ['financial-record', 'bank-statement', 'receipt', 'audit-trail', 'witness'],
    possibleMotives: ['embezzlement', 'covering-losses', 'greed', 'gambling-debt', 'lifestyle'],
    discoveryMethods: [
      'Annual audit found discrepancies',
      'Bank noticed unusual activity',
      'Anonymous tip received',
      'Pattern of irregularities noticed',
    ],
    compatibleLocations: ['school', 'commercial', 'public'],
  },
  {
    id: 'identity-fraud',
    category: 'fraud',
    name: 'Identity Fraud',
    severity: 'serious',
    descriptions: [
      'Someone used {victim}\'s identity fraudulently',
      'Fake credentials presented at {location}',
      'Impersonation discovered at {location}',
      'Identity documents were forged',
    ],
    sceneImpacts: [
      'Fake ID cards found',
      'Forged signatures detected',
      'Unauthorized access records',
      'False documents submitted',
    ],
    evidenceTypes: ['forged-document', 'signature-analysis', 'cctv', 'witness', 'access-log'],
    possibleMotives: ['access', 'financial-gain', 'escape-punishment', 'revenge', 'opportunity'],
    discoveryMethods: [
      'Document verification failed',
      'Real person reported suspicious activity',
      'Signature didn\'t match records',
      'Photo ID comparison failed',
    ],
    compatibleLocations: ['school', 'commercial', 'public'],
  },
  {
    id: 'exam-cheating',
    category: 'fraud',
    name: 'Exam Fraud',
    severity: 'moderate',
    descriptions: [
      'Exam papers were leaked before the test',
      'Answer sheets were exchanged during examination',
      'Someone submitted another person\'s work',
      'Test answers were obtained fraudulently',
    ],
    sceneImpacts: [
      'Exam paper copy found',
      'Suspicious phone usage',
      'Answer similarity detected',
      'Unauthorized materials found',
    ],
    evidenceTypes: ['document-copy', 'phone-record', 'plagiarism-report', 'witness', 'cctv'],
    possibleMotives: ['grades', 'pressure', 'laziness', 'fear-of-failure', 'competition'],
    discoveryMethods: [
      'Answer patterns matched suspiciously',
      'Invigilator noticed cheating',
      'Anonymous tip about leaked paper',
      'Student reported another student',
    ],
    compatibleLocations: ['school', 'public'],
  },
  {
    id: 'fake-product',
    category: 'fraud',
    name: 'Counterfeit/Fake Products',
    severity: 'moderate',
    descriptions: [
      'Counterfeit goods were being sold at {location}',
      'Fake products passed off as genuine',
      'Expired items relabeled and sold',
      'Substandard goods sold as premium',
    ],
    sceneImpacts: [
      'Fake packaging discovered',
      'Relabeled products found',
      'Quality complaints logged',
      'Supplier records falsified',
    ],
    evidenceTypes: ['fake-product', 'label', 'supplier-record', 'customer-complaint', 'quality-report'],
    possibleMotives: ['profit', 'cost-cutting', 'greed', 'desperation', 'opportunity'],
    discoveryMethods: [
      'Customer complained about quality',
      'Brand inspection failed',
      'Health inspector found violations',
      'Supplier verification failed',
    ],
    compatibleLocations: ['commercial', 'public'],
  },
  {
    id: 'attendance-fraud',
    category: 'fraud',
    name: 'Attendance Fraud',
    severity: 'minor',
    descriptions: [
      'Attendance records were falsified',
      'Someone signed in for an absent person',
      'Punch card fraud discovered',
      'Fake attendance marked for multiple people',
    ],
    sceneImpacts: [
      'Altered attendance sheets',
      'Multiple signatures by one person',
      'Buddy punching on time clock',
      'Location check-in discrepancy',
    ],
    evidenceTypes: ['attendance-record', 'signature-analysis', 'cctv', 'witness', 'location-data'],
    possibleMotives: ['cover-absence', 'friendship', 'extra-pay', 'avoiding-trouble', 'laziness'],
    discoveryMethods: [
      'Supervisor noticed person missing but marked present',
      'Signature analysis revealed fraud',
      'CCTV didn\'t show person',
      'Location tracking contradicted records',
    ],
    compatibleLocations: ['school', 'commercial', 'industrial'],
  },
  {
    id: 'refund-fraud',
    category: 'fraud',
    name: 'Refund Fraud',
    severity: 'moderate',
    descriptions: [
      'Fraudulent refunds processed at {location}',
      'Items returned were not originally purchased',
      'Receipt fraud for returns',
      'Fake product returns for cash',
    ],
    sceneImpacts: [
      'Refund records don\'t match sales',
      'Returned items weren\'t from store',
      'Fake receipts discovered',
      'Cash discrepancy in register',
    ],
    evidenceTypes: ['refund-record', 'receipt', 'cctv', 'product-tag', 'witness'],
    possibleMotives: ['money', 'greed', 'scheme', 'desperation', 'opportunity'],
    discoveryMethods: [
      'Audit revealed refund anomalies',
      'Same person returned items repeatedly',
      'Receipt didn\'t match system records',
      'Staff noticed suspicious pattern',
    ],
    compatibleLocations: ['commercial'],
  },
];

// ============================================
// VANDALISM CRIMES (10 variations)
// ============================================

export const VANDALISM_CRIMES: CrimeType[] = [
  {
    id: 'graffiti',
    category: 'vandalism',
    name: 'Graffiti/Defacement',
    severity: 'moderate',
    descriptions: [
      'Walls at {location} were defaced with graffiti',
      'Offensive words spray-painted on surfaces',
      'Property was marked with unauthorized art',
      'Permanent marker used to deface furniture',
    ],
    sceneImpacts: [
      'Spray paint on walls',
      'Marker on desks and surfaces',
      'Stickers placed everywhere',
      'Etching on windows',
    ],
    evidenceTypes: ['paint-sample', 'marker', 'fingerprint', 'cctv', 'witness'],
    possibleMotives: ['expression', 'revenge', 'gang-marking', 'boredom', 'protest'],
    discoveryMethods: [
      'Staff noticed graffiti on arrival',
      'Security camera caught perpetrator',
      'Cleaning staff reported damage',
      'Someone recognized the handwriting',
    ],
    compatibleLocations: ['school', 'commercial', 'public', 'residential'],
  },
  {
    id: 'property-damage',
    category: 'vandalism',
    name: 'Property Damage',
    severity: 'serious',
    descriptions: [
      'Equipment at {location} was deliberately damaged',
      'Windows were broken intentionally',
      'Furniture was destroyed',
      'Fixtures were torn from walls',
    ],
    sceneImpacts: [
      'Broken glass scattered',
      'Furniture overturned',
      'Equipment smashed',
      'Walls damaged',
    ],
    evidenceTypes: ['tool-mark', 'fingerprint', 'cctv', 'witness', 'fragment'],
    possibleMotives: ['anger', 'revenge', 'mental-issues', 'cover-up', 'intimidation'],
    discoveryMethods: [
      'Loud noise alerted security',
      'Morning opening revealed damage',
      'Witness saw incident',
      'CCTV caught the act',
    ],
    compatibleLocations: ['school', 'commercial', 'public', 'residential'],
  },
  {
    id: 'vehicle-vandalism',
    category: 'vandalism',
    name: 'Vehicle Damage',
    severity: 'serious',
    descriptions: [
      'Cars in the parking lot were keyed',
      'Tires were slashed at {location}',
      'Vehicle windows smashed',
      'Car paint damaged deliberately',
    ],
    sceneImpacts: [
      'Scratch marks on paintwork',
      'Flat tires',
      'Broken windows',
      'Dents on body',
    ],
    evidenceTypes: ['tool-mark', 'fingerprint', 'cctv', 'witness', 'paint-transfer'],
    possibleMotives: ['jealousy', 'revenge', 'road-rage', 'mistaken-identity', 'gang-initiation'],
    discoveryMethods: [
      'Owner returned to damaged car',
      'Parking attendant noticed damage',
      'CCTV review after complaint',
      'Witness reported suspicious person',
    ],
    compatibleLocations: ['commercial', 'public', 'residential'],
  },
  {
    id: 'plant-destruction',
    category: 'vandalism',
    name: 'Garden/Plant Vandalism',
    severity: 'minor',
    descriptions: [
      'Plants at {location} were uprooted',
      'Community garden destroyed',
      'School garden trampled',
      'Decorative plants damaged',
    ],
    sceneImpacts: [
      'Plants pulled from soil',
      'Flowers crushed',
      'Pots broken',
      'Soil scattered',
    ],
    evidenceTypes: ['footprint', 'fingerprint', 'cctv', 'witness', 'soil-sample'],
    possibleMotives: ['spite', 'jealousy', 'boredom', 'accident', 'revenge'],
    discoveryMethods: [
      'Gardener arrived to find destruction',
      'Morning patrol noticed damage',
      'Neighbor reported late-night noise',
      'CCTV captured incident',
    ],
    compatibleLocations: ['school', 'public', 'residential'],
  },
];

// ============================================
// SABOTAGE CRIMES (8 variations)
// ============================================

export const SABOTAGE_CRIMES: CrimeType[] = [
  {
    id: 'food-tampering',
    category: 'sabotage',
    name: 'Food Tampering',
    severity: 'serious',
    descriptions: [
      'Food at {location} was tampered with',
      'Ingredients were deliberately contaminated',
      'Someone added unwanted substances to the food',
      'Prepared meals were sabotaged',
    ],
    sceneImpacts: [
      'Unusual taste or appearance',
      'Foreign objects in food',
      'Contaminated ingredients',
      'Tampered packaging',
    ],
    evidenceTypes: ['food-sample', 'foreign-substance', 'fingerprint', 'cctv', 'witness'],
    possibleMotives: ['revenge', 'competition', 'prank', 'mental-issues', 'jealousy'],
    discoveryMethods: [
      'Someone got sick after eating',
      'Unusual taste noticed',
      'Foreign object found in food',
      'CCTV showed tampering',
    ],
    compatibleLocations: ['school', 'commercial'],
  },
  {
    id: 'equipment-sabotage',
    category: 'sabotage',
    name: 'Equipment Sabotage',
    severity: 'serious',
    descriptions: [
      'Equipment at {location} was deliberately disabled',
      'Someone sabotaged the machinery',
      'Critical equipment was tampered with',
      'Safety features were disabled',
    ],
    sceneImpacts: [
      'Equipment malfunctioning',
      'Parts removed or damaged',
      'Settings altered',
      'Safety locks bypassed',
    ],
    evidenceTypes: ['tool-mark', 'fingerprint', 'access-log', 'cctv', 'witness'],
    possibleMotives: ['revenge', 'sabotage-competition', 'cover-up', 'laziness', 'grudge'],
    discoveryMethods: [
      'Equipment failed during use',
      'Maintenance found tampering',
      'Safety inspection revealed issues',
      'CCTV showed unauthorized access',
    ],
    compatibleLocations: ['school', 'commercial', 'industrial'],
  },
  {
    id: 'project-sabotage',
    category: 'sabotage',
    name: 'Project/Work Sabotage',
    severity: 'moderate',
    descriptions: [
      'Someone sabotaged a project at {location}',
      'Science experiment was ruined deliberately',
      'Presentation materials were destroyed',
      'Competition entry was tampered with',
    ],
    sceneImpacts: [
      'Project materials damaged',
      'Files deleted or corrupted',
      'Work destroyed',
      'Evidence of tampering',
    ],
    evidenceTypes: ['deleted-file', 'fingerprint', 'access-log', 'cctv', 'witness'],
    possibleMotives: ['jealousy', 'competition', 'revenge', 'spite', 'insecurity'],
    discoveryMethods: [
      'Creator found work destroyed',
      'Files were missing or corrupted',
      'Competition revealed sabotage',
      'Digital forensics found evidence',
    ],
    compatibleLocations: ['school', 'commercial'],
  },
  {
    id: 'event-sabotage',
    category: 'sabotage',
    name: 'Event Sabotage',
    severity: 'moderate',
    descriptions: [
      'Someone tried to ruin the event at {location}',
      'Critical equipment for the event was hidden',
      'Event preparations were sabotaged',
      'Performance was deliberately disrupted',
    ],
    sceneImpacts: [
      'Missing equipment',
      'Sound system failure',
      'Decorations destroyed',
      'Schedule disrupted',
    ],
    evidenceTypes: ['hidden-item', 'fingerprint', 'cctv', 'witness', 'communication-record'],
    possibleMotives: ['jealousy', 'revenge', 'competition', 'grudge', 'attention'],
    discoveryMethods: [
      'Equipment not found when needed',
      'Technical issues during event',
      'Preparations found destroyed',
      'Witness saw suspicious activity',
    ],
    compatibleLocations: ['school', 'commercial', 'public'],
  },
];

// ============================================
// CHEATING/ACADEMIC CRIMES (6 variations)
// ============================================

export const CHEATING_CRIMES: CrimeType[] = [
  {
    id: 'plagiarism',
    category: 'cheating',
    name: 'Plagiarism',
    severity: 'moderate',
    descriptions: [
      'Student submitted plagiarized work',
      'Assignment was copied from another student',
      'Internet content passed off as original work',
      'Group work stolen by one member',
    ],
    sceneImpacts: [
      'Matching content in submissions',
      'Formatting inconsistencies',
      'Writing style changes',
      'Uncited sources',
    ],
    evidenceTypes: ['plagiarism-report', 'document-comparison', 'internet-search', 'witness', 'metadata'],
    possibleMotives: ['laziness', 'time-pressure', 'fear-of-failure', 'ignorance', 'desperation'],
    discoveryMethods: [
      'Plagiarism checker flagged submission',
      'Teacher recognized the content',
      'Another student reported copying',
      'Writing style inconsistent with student',
    ],
    compatibleLocations: ['school'],
  },
  {
    id: 'score-manipulation',
    category: 'cheating',
    name: 'Score/Record Manipulation',
    severity: 'serious',
    descriptions: [
      'Academic records were altered',
      'Test scores were changed in the system',
      'Competition results were manipulated',
      'Grades were inflated fraudulently',
    ],
    sceneImpacts: [
      'System logs show unauthorized changes',
      'Paper records don\'t match digital',
      'Score discrepancies noticed',
      'Unusual patterns in grades',
    ],
    evidenceTypes: ['system-log', 'audit-trail', 'paper-record', 'witness', 'access-log'],
    possibleMotives: ['grades', 'scholarship', 'pressure', 'favoritism', 'bribery'],
    discoveryMethods: [
      'Audit found discrepancies',
      'Student complained about unfair grade',
      'System log showed unauthorized access',
      'Anonymous tip received',
    ],
    compatibleLocations: ['school'],
  },
  {
    id: 'sports-cheating',
    category: 'cheating',
    name: 'Sports Cheating',
    severity: 'moderate',
    descriptions: [
      'Cheating discovered in sports competition',
      'Equipment was tampered with for advantage',
      'Ineligible player was fielded',
      'Referee was bribed or coerced',
    ],
    sceneImpacts: [
      'Tampered equipment found',
      'False registration discovered',
      'Unusual officiating noticed',
      'Player documentation falsified',
    ],
    evidenceTypes: ['equipment', 'registration-record', 'witness', 'communication', 'video-footage'],
    possibleMotives: ['winning', 'gambling', 'reputation', 'pressure', 'scholarship'],
    discoveryMethods: [
      'Opponent team filed complaint',
      'Equipment inspection found tampering',
      'Age verification failed',
      'Unusual betting patterns noticed',
    ],
    compatibleLocations: ['school', 'public'],
  },
];

// ============================================
// MISSING ITEM CRIMES (5 variations)
// ============================================

export const MISSING_CRIMES: CrimeType[] = [
  {
    id: 'lost-pet',
    category: 'missing',
    name: 'Missing Pet/Animal',
    severity: 'moderate',
    descriptions: [
      'The class pet has gone missing',
      'School animal was let out of its enclosure',
      'Pet shop animal is missing',
      'Community cat hasn\'t been seen',
    ],
    sceneImpacts: [
      'Cage door left open',
      'Signs of escape or release',
      'Food untouched',
      'Unusual animal behavior from others',
    ],
    evidenceTypes: ['cage-condition', 'cctv', 'witness', 'footprint', 'fur-sample'],
    possibleMotives: ['release-belief', 'prank', 'theft', 'accident', 'revenge'],
    discoveryMethods: [
      'Caretaker found cage empty',
      'Animal not in usual spot',
      'Someone reported seeing loose animal',
      'Routine check revealed absence',
    ],
    compatibleLocations: ['school', 'commercial', 'residential'],
  },
  {
    id: 'missing-key',
    category: 'missing',
    name: 'Missing Keys/Access',
    severity: 'moderate',
    descriptions: [
      'Master key has gone missing from {location}',
      'Access cards are unaccounted for',
      'Security keys were lost or stolen',
      'Important key set has disappeared',
    ],
    sceneImpacts: [
      'Key hook empty',
      'Key log shows discrepancy',
      'Access card deactivated',
      'Lock changed as precaution',
    ],
    evidenceTypes: ['key-log', 'access-record', 'cctv', 'witness', 'lock-status'],
    possibleMotives: ['theft-planning', 'unauthorized-access', 'accident', 'carelessness', 'cover-up'],
    discoveryMethods: [
      'Key not in expected location',
      'Key log showed missing sign-out',
      'Unauthorized access attempted',
      'Security audit revealed gap',
    ],
    compatibleLocations: ['school', 'commercial', 'industrial', 'residential'],
  },
];

// ============================================
// EXPORT ALL CRIMES
// ============================================

export const ALL_CRIMES: CrimeType[] = [
  ...THEFT_CRIMES,
  ...FRAUD_CRIMES,
  ...VANDALISM_CRIMES,
  ...SABOTAGE_CRIMES,
  ...CHEATING_CRIMES,
  ...MISSING_CRIMES,
];

// Total: 56 distinct crime types

/**
 * Get crimes compatible with a location
 */
export function getCrimesForLocation(locationCategory: CrimeType['compatibleLocations'][number]): CrimeType[] {
  return ALL_CRIMES.filter(crime => crime.compatibleLocations.includes(locationCategory));
}

/**
 * Get random crime for location
 */
export function getRandomCrime(locationCategory?: CrimeType['compatibleLocations'][number]): CrimeType {
  const pool = locationCategory ? getCrimesForLocation(locationCategory) : ALL_CRIMES;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Get random description with placeholders filled
 */
export function getCrimeDescription(crime: CrimeType, placeholders: { victim?: string; item?: string; location?: string }): string {
  const template = crime.descriptions[Math.floor(Math.random() * crime.descriptions.length)];
  return template
    .replace('{victim}', placeholders.victim || 'someone')
    .replace('{item}', placeholders.item || 'item')
    .replace('{location}', placeholders.location || 'the area');
}

// Unique crime combinations with locations:
// 56 crimes × 4 descriptions × 4 scene impacts × 5 motives = 4,480 base variations
