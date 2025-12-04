/**
 * CHARACTER DATABASE
 * Extensive character generation system for Singapore context
 */

// ============================================
// TYPES
// ============================================

export interface CharacterName {
  first: string;
  last: string;
  ethnicity: Ethnicity;
  gender: 'male' | 'female' | 'neutral';
}

export type Ethnicity = 'chinese' | 'malay' | 'indian' | 'eurasian' | 'others';

export interface Occupation {
  title: string;
  category: OccupationCategory;
  ageRange: [number, number];
  traits: string[];
}

export type OccupationCategory =
  | 'education'
  | 'food'
  | 'retail'
  | 'service'
  | 'professional'
  | 'healthcare'
  | 'transport'
  | 'security'
  | 'maintenance'
  | 'administrative'
  | 'community'
  | 'creative';

// ============================================
// NAMES DATABASE - CHINESE (50+ each)
// ============================================

export const chineseFirstNamesMale = [
  'Wei Jie', 'Jun Hao', 'Zhi Wei', 'Kai Wen', 'Zi Yang', 'Shi Jie', 'Yi Xuan',
  'Jian Wei', 'Ming Hao', 'Rui Feng', 'Chen Wei', 'Hong Ming', 'Jia Jun',
  'Wei Ming', 'Zheng Yang', 'Hao Ran', 'Tian Yu', 'Wen Hao', 'Xin Yu', 'Yong Hao',
  'Guo Wei', 'Jia Wei', 'Jun Wei', 'Kai Yang', 'Ming Yang', 'Rui Jie', 'Wei Xiang',
  'Xiang Yu', 'Yi Fan', 'Zhi Hao', 'Bo Wen', 'Cheng Ming', 'Da Wei', 'Feng Ming',
  'Han Wei', 'Jing Wei', 'Kang Wei', 'Li Wei', 'Peng Fei', 'Qiang Wei',
];

export const chineseFirstNamesFemale = [
  'Mei Ling', 'Xin Yi', 'Yu Ting', 'Hui Min', 'Jing Wen', 'Xue Ying', 'Jia Hui',
  'Hui Ling', 'Xiao Ting', 'Wen Xin', 'Yi Ling', 'Zhi Ying', 'Fang Ying', 'Hui Wen',
  'Jia Ying', 'Li Hua', 'Mei Xin', 'Pei Ling', 'Qian Hui', 'Rui Xin', 'Shu Ting',
  'Ting Ting', 'Wen Ling', 'Xin Hui', 'Ya Ting', 'Yu Xin', 'Zi Xuan', 'Ai Ling',
  'Bei Xin', 'Chun Ying', 'Dan Ling', 'En Qi', 'Fei Fei', 'Guo Ying', 'Hong Mei',
  'Jia Xin', 'Kai Xin', 'Lan Ying', 'Min Hui', 'Ning Xin', 'Pei Xuan',
];

export const chineseSurnames = [
  'Tan', 'Lim', 'Lee', 'Ng', 'Wong', 'Goh', 'Chua', 'Ong', 'Koh', 'Teo',
  'Chen', 'Ho', 'Yeo', 'Sim', 'Chong', 'Tay', 'Low', 'Ang', 'Seah', 'Foo',
  'Quek', 'Lau', 'Leong', 'Phua', 'Chin', 'Toh', 'Yap', 'Pang', 'Chew', 'Soh',
  'Wee', 'Khoo', 'Loh', 'Heng', 'Kwek', 'Neo', 'Png', 'Kang', 'Tong', 'Gan',
];

// ============================================
// NAMES DATABASE - MALAY (50+ each)
// ============================================

export const malayFirstNamesMale = [
  'Ahmad', 'Hafiz', 'Rizwan', 'Amir', 'Farhan', 'Imran', 'Danish', 'Irfan',
  'Shahrul', 'Fitri', 'Azlan', 'Faizal', 'Hakim', 'Ismail', 'Jamal', 'Kamal',
  'Lutfi', 'Muzaffar', 'Nazri', 'Omar', 'Rashid', 'Sufian', 'Tariq', 'Umar',
  'Wafi', 'Yazid', 'Zaid', 'Aidil', 'Bakri', 'Dzulkifli', 'Ehsan', 'Firdaus',
  'Ghani', 'Haziq', 'Ilham', 'Johari', 'Khairul', 'Luqman', 'Mustafa', 'Nabil',
];

export const malayFirstNamesFemale = [
  'Fatimah', 'Nurul', 'Aisyah', 'Siti', 'Zainab', 'Nadia', 'Aishah', 'Mariam',
  'Safiah', 'Rahmah', 'Halimah', 'Khadijah', 'Laila', 'Maryam', 'Nadiah', 'Putri',
  'Qistina', 'Rashidah', 'Salma', 'Tasha', 'Umairah', 'Wardina', 'Yasmin', 'Zahra',
  'Aini', 'Balqis', 'Dina', 'Farah', 'Hana', 'Iman', 'Julia', 'Kamila',
  'Lina', 'Mazni', 'Norma', 'Rina', 'Suraya', 'Tina', 'Wani', 'Zulaikha',
];

export const malayPatronymicMale = [
  'bin Ahmad', 'bin Hassan', 'bin Osman', 'bin Yusof', 'bin Ibrahim', 'bin Ismail',
  'bin Abdullah', 'bin Mohamed', 'bin Hamid', 'bin Razak', 'bin Karim', 'bin Latif',
  'bin Rahman', 'bin Said', 'bin Talib', 'bin Wahid', 'bin Zainal', 'bin Bakar',
  'bin Daud', 'bin Harun', 'bin Jalil', 'bin Khalid', 'bin Malik', 'bin Nasir',
];

export const malayPatronymicFemale = [
  'binti Ahmad', 'binti Hassan', 'binti Rahman', 'binti Ali', 'binti Ibrahim',
  'binti Abdullah', 'binti Mohamed', 'binti Hamid', 'binti Ismail', 'binti Yusof',
  'binti Osman', 'binti Razak', 'binti Karim', 'binti Latif', 'binti Said',
  'binti Talib', 'binti Wahid', 'binti Zainal', 'binti Bakar', 'binti Daud',
];

// ============================================
// NAMES DATABASE - INDIAN (50+ each)
// ============================================

export const indianFirstNamesMale = [
  'Raj', 'Arjun', 'Vikram', 'Karthik', 'Suresh', 'Arun', 'Rahul', 'Deepak',
  'Ganesh', 'Harish', 'Krishna', 'Mohan', 'Naveen', 'Prasad', 'Ramesh', 'Sanjay',
  'Venkat', 'Anand', 'Balaji', 'Chandran', 'Dinesh', 'Gopal', 'Hari', 'Jayaram',
  'Kumar', 'Lakshman', 'Murali', 'Naresh', 'Prakash', 'Raghu', 'Shankar', 'Thiru',
  'Vijay', 'Ashok', 'Bala', 'Chandra', 'Devi', 'Ganesan', 'Ilango', 'Jeyakumar',
];

export const indianFirstNamesFemale = [
  'Priya', 'Ananya', 'Kavitha', 'Lakshmi', 'Deepa', 'Divya', 'Meera', 'Shreya',
  'Gayathri', 'Hari Priya', 'Indira', 'Janani', 'Kala', 'Lalitha', 'Malathi',
  'Nirmala', 'Padma', 'Radha', 'Saroja', 'Thenmozhi', 'Uma', 'Vani', 'Yamuna',
  'Aishwarya', 'Bhavani', 'Chitra', 'Durga', 'Eswari', 'Gowri', 'Hema', 'Isha',
  'Jaya', 'Kamala', 'Latha', 'Mala', 'Nila', 'Pushpa', 'Revathi', 'Sita', 'Vidya',
];

export const indianSurnames = [
  'Pillai', 'Nair', 'Menon', 'Kumar', 'Sharma', 'Patel', 'Singh', 'Rao',
  'Krishnan', 'Rajan', 'Subramaniam', 'Naidu', 'Reddy', 'Iyer', 'Iyengar',
  'Murugan', 'Devan', 'Chandran', 'Govindan', 'Arumugam', 'Balan', 'Chelliah',
  'Doraiswamy', 'Elangovan', 'Ganesan', 'Hari', 'Jagannathan', 'Kannan',
  'Lakshmanan', 'Manickam', 'Natarajan', 'Palaniswamy', 'Ramasamy', 'Selvam',
  'Thangavelu', 'Velusamy', 'Anandan', 'Balasubramaniam', 'Durai', 'Jayaraman',
];

// ============================================
// NAMES DATABASE - EURASIAN & OTHERS (30+ each)
// ============================================

export const eurasianFirstNamesMale = [
  'Daniel', 'Adrian', 'Marcus', 'Nathan', 'Ryan', 'Ethan', 'Joshua', 'Lucas',
  'Gabriel', 'Sebastian', 'Dominic', 'Vincent', 'Francis', 'Patrick', 'Gerard',
  'Michael', 'Joseph', 'Anthony', 'Benjamin', 'Christopher', 'David', 'Edward',
  'Frederick', 'George', 'Henry', 'Ian', 'James', 'Kenneth', 'Lawrence', 'Martin',
];

export const eurasianFirstNamesFemale = [
  'Michelle', 'Sophie', 'Emma', 'Chloe', 'Sarah', 'Olivia', 'Grace', 'Nicole',
  'Amanda', 'Christina', 'Elizabeth', 'Jessica', 'Katherine', 'Lauren', 'Melissa',
  'Patricia', 'Rachel', 'Samantha', 'Teresa', 'Vanessa', 'Angela', 'Bernadette',
  'Caroline', 'Dorothy', 'Eleanor', 'Frances', 'Gloria', 'Helen', 'Irene', 'Julia',
];

export const eurasianSurnames = [
  'Pereira', 'Rozario', 'Shepherdson', 'Clarke', 'Williams', 'Johnson', 'Tessensohn',
  'De Souza', 'Rodrigues', 'Monteiro', 'Oliveiro', 'Westerhout', 'Scully', 'Braga',
  'Sequeira', 'Aroozoo', 'Conceicao', 'D\'Silva', 'Ferreira', 'Gomes', 'Hendricks',
  'Kelly', 'Lambert', 'Morrison', 'O\'Brien', 'Palmer', 'Roberts', 'Smith', 'Thompson',
];

// ============================================
// OCCUPATIONS BY LOCATION TYPE
// ============================================

export const occupationsByLocation: Record<string, Occupation[]> = {
  school: [
    { title: 'Teacher', category: 'education', ageRange: [25, 60], traits: ['patient', 'knowledgeable'] },
    { title: 'Principal', category: 'education', ageRange: [45, 65], traits: ['authoritative', 'experienced'] },
    { title: 'Vice Principal', category: 'education', ageRange: [40, 60], traits: ['organized', 'strict'] },
    { title: 'School Clerk', category: 'administrative', ageRange: [25, 55], traits: ['meticulous', 'helpful'] },
    { title: 'Canteen Vendor', category: 'food', ageRange: [35, 65], traits: ['busy', 'practical'] },
    { title: 'Security Guard', category: 'security', ageRange: [35, 65], traits: ['vigilant', 'routine'] },
    { title: 'Librarian', category: 'education', ageRange: [30, 60], traits: ['quiet', 'observant'] },
    { title: 'Lab Assistant', category: 'education', ageRange: [25, 50], traits: ['careful', 'precise'] },
    { title: 'Gardener', category: 'maintenance', ageRange: [40, 65], traits: ['hardworking', 'outdoor'] },
    { title: 'PE Teacher', category: 'education', ageRange: [25, 55], traits: ['energetic', 'sporty'] },
    { title: 'School Counsellor', category: 'education', ageRange: [30, 55], traits: ['empathetic', 'wise'] },
    { title: 'IT Technician', category: 'professional', ageRange: [25, 45], traits: ['technical', 'problem-solver'] },
    { title: 'Art Teacher', category: 'education', ageRange: [25, 55], traits: ['creative', 'patient'] },
    { title: 'Music Teacher', category: 'education', ageRange: [25, 55], traits: ['artistic', 'disciplined'] },
    { title: 'Parent Volunteer', category: 'community', ageRange: [30, 50], traits: ['caring', 'involved'] },
  ],
  hawker: [
    { title: 'Stall Owner', category: 'food', ageRange: [35, 70], traits: ['hardworking', 'traditional'] },
    { title: 'Stall Assistant', category: 'food', ageRange: [20, 60], traits: ['helpful', 'quick'] },
    { title: 'Cleaner', category: 'maintenance', ageRange: [40, 70], traits: ['diligent', 'early-riser'] },
    { title: 'Delivery Rider', category: 'transport', ageRange: [20, 45], traits: ['fast', 'independent'] },
    { title: 'Regular Customer', category: 'community', ageRange: [25, 75], traits: ['familiar', 'routine'] },
    { title: 'Food Supplier', category: 'food', ageRange: [30, 60], traits: ['early-riser', 'reliable'] },
    { title: 'NEA Inspector', category: 'professional', ageRange: [30, 55], traits: ['strict', 'thorough'] },
    { title: 'Drinks Seller', category: 'food', ageRange: [30, 65], traits: ['friendly', 'busy'] },
    { title: 'Tissue Seller', category: 'service', ageRange: [55, 80], traits: ['elderly', 'persistent'] },
    { title: 'Market Manager', category: 'administrative', ageRange: [40, 60], traits: ['organized', 'problem-solver'] },
  ],
  mall: [
    { title: 'Shop Manager', category: 'retail', ageRange: [28, 50], traits: ['business-minded', 'presentable'] },
    { title: 'Sales Assistant', category: 'retail', ageRange: [18, 40], traits: ['friendly', 'persuasive'] },
    { title: 'Security Officer', category: 'security', ageRange: [25, 60], traits: ['alert', 'authoritative'] },
    { title: 'Cleaner', category: 'maintenance', ageRange: [35, 65], traits: ['hardworking', 'invisible'] },
    { title: 'Promoter', category: 'retail', ageRange: [20, 35], traits: ['outgoing', 'energetic'] },
    { title: 'Customer Service', category: 'service', ageRange: [22, 45], traits: ['patient', 'helpful'] },
    { title: 'F&B Staff', category: 'food', ageRange: [18, 40], traits: ['fast', 'service-oriented'] },
    { title: 'Cashier', category: 'retail', ageRange: [18, 50], traits: ['careful', 'trustworthy'] },
    { title: 'Stock Room Staff', category: 'retail', ageRange: [20, 45], traits: ['organized', 'physical'] },
    { title: 'Mall Management', category: 'administrative', ageRange: [30, 55], traits: ['professional', 'decisive'] },
  ],
  nature: [
    { title: 'Park Ranger', category: 'service', ageRange: [25, 55], traits: ['outdoorsy', 'knowledgeable'] },
    { title: 'Volunteer Guide', category: 'community', ageRange: [20, 70], traits: ['passionate', 'friendly'] },
    { title: 'Photographer', category: 'creative', ageRange: [20, 60], traits: ['artistic', 'patient'] },
    { title: 'Jogger', category: 'community', ageRange: [20, 65], traits: ['fit', 'regular'] },
    { title: 'Bird Watcher', category: 'community', ageRange: [30, 70], traits: ['observant', 'patient'] },
    { title: 'Maintenance Worker', category: 'maintenance', ageRange: [30, 60], traits: ['practical', 'outdoor'] },
    { title: 'Cyclist', category: 'community', ageRange: [15, 60], traits: ['active', 'adventurous'] },
    { title: 'Fisherman', category: 'community', ageRange: [35, 70], traits: ['patient', 'early-riser'] },
    { title: 'Nature Educator', category: 'education', ageRange: [25, 55], traits: ['passionate', 'knowledgeable'] },
    { title: 'Security Patrol', category: 'security', ageRange: [30, 55], traits: ['vigilant', 'mobile'] },
  ],
  hdb: [
    { title: 'Town Council Staff', category: 'administrative', ageRange: [25, 55], traits: ['organized', 'community'] },
    { title: 'Resident', category: 'community', ageRange: [20, 80], traits: ['varied', 'local'] },
    { title: 'Cleaner', category: 'maintenance', ageRange: [40, 70], traits: ['early-riser', 'routine'] },
    { title: 'Security Guard', category: 'security', ageRange: [35, 65], traits: ['vigilant', 'familiar'] },
    { title: 'Delivery Person', category: 'transport', ageRange: [20, 50], traits: ['fast', 'mobile'] },
    { title: 'Estate Manager', category: 'administrative', ageRange: [35, 55], traits: ['responsible', 'problem-solver'] },
    { title: 'Lift Technician', category: 'maintenance', ageRange: [25, 55], traits: ['technical', 'responsive'] },
    { title: 'Pest Control', category: 'maintenance', ageRange: [25, 50], traits: ['practical', 'thorough'] },
    { title: 'Grass Cutter', category: 'maintenance', ageRange: [35, 60], traits: ['outdoor', 'routine'] },
    { title: 'Karang Guni Man', category: 'service', ageRange: [40, 70], traits: ['mobile', 'familiar'] },
  ],
  community: [
    { title: 'CC Manager', category: 'administrative', ageRange: [35, 55], traits: ['organized', 'community'] },
    { title: 'Course Instructor', category: 'education', ageRange: [25, 60], traits: ['skilled', 'patient'] },
    { title: 'Volunteer', category: 'community', ageRange: [18, 75], traits: ['helpful', 'dedicated'] },
    { title: 'Member', category: 'community', ageRange: [25, 70], traits: ['regular', 'social'] },
    { title: 'Event Organizer', category: 'administrative', ageRange: [25, 50], traits: ['organized', 'creative'] },
    { title: 'Receptionist', category: 'administrative', ageRange: [22, 50], traits: ['friendly', 'helpful'] },
    { title: 'Sports Coach', category: 'education', ageRange: [25, 55], traits: ['fit', 'motivating'] },
    { title: 'Cleaner', category: 'maintenance', ageRange: [35, 65], traits: ['thorough', 'routine'] },
    { title: 'Security', category: 'security', ageRange: [30, 60], traits: ['vigilant', 'calm'] },
    { title: 'Grassroots Leader', category: 'community', ageRange: [40, 70], traits: ['respected', 'connected'] },
  ],
};

// ============================================
// PERSONALITIES
// ============================================

export const personalityPairs: [string, string][] = [
  ['nervous', 'fidgety'],
  ['calm', 'collected'],
  ['aggressive', 'defensive'],
  ['friendly', 'helpful'],
  ['quiet', 'reserved'],
  ['loud', 'attention-seeking'],
  ['suspicious', 'evasive'],
  ['confident', 'articulate'],
  ['confused', 'scattered'],
  ['angry', 'hostile'],
  ['sad', 'withdrawn'],
  ['cheerful', 'optimistic'],
  ['anxious', 'worried'],
  ['arrogant', 'dismissive'],
  ['shy', 'timid'],
  ['charming', 'persuasive'],
  ['stubborn', 'inflexible'],
  ['curious', 'nosy'],
  ['lazy', 'unmotivated'],
  ['hardworking', 'dedicated'],
  ['honest', 'straightforward'],
  ['secretive', 'guarded'],
  ['talkative', 'gossipy'],
  ['formal', 'proper'],
  ['casual', 'relaxed'],
];

// ============================================
// MOTIVES
// ============================================

export const motives = [
  'needed money urgently for family medical bills',
  'was jealous of someone else\'s success',
  'wanted revenge for a past grievance',
  'was pressured by someone threatening them',
  'believed they deserved it more than others',
  'made a mistake and tried to cover it up',
  'wanted to impress someone important to them',
  'was struggling financially and saw an opportunity',
  'had a gambling debt to pay off',
  'wanted to sabotage a competitor',
  'felt underappreciated and resentful',
  'was blackmailed into doing it',
  'thought no one would notice or care',
  'did it as a prank that went too far',
  'was trying to help someone else in trouble',
  'wanted to protect their reputation',
  'was addicted and needed to fund the habit',
  'believed they were correcting an injustice',
  'was manipulated by someone they trusted',
  'wanted to prove they could get away with it',
  'needed to maintain a certain lifestyle',
  'was desperate after losing their job',
  'wanted to teach someone a lesson',
  'felt entitled because of past contributions',
  'was covering for someone else\'s mistake',
  'believed it was a victimless crime',
  'wanted attention they weren\'t getting',
  'was testing security for later use',
  'needed to pay for education expenses',
  'wanted to escape a difficult situation',
];

// ============================================
// ALIBIS
// ============================================

export const alibis = [
  'was at a doctor\'s appointment',
  'was picking up children from school',
  'was stuck in traffic on the PIE',
  'was attending a family gathering',
  'was on the phone with a client',
  'was working overtime in another location',
  'was at a religious service',
  'was grocery shopping at NTUC',
  'was exercising at the gym',
  'was meeting a friend for coffee',
  'was at the bank handling some matters',
  'was helping a neighbour move furniture',
  'was at the clinic waiting to see a doctor',
  'was attending a course at the CC',
  'was visiting elderly parents',
  'was taking a nap at home',
  'was watching a movie at the cinema',
  'was attending a wedding dinner',
  'was at a parent-teacher meeting',
  'was doing laundry at the laundromat',
  'was sending car for servicing',
  'was at the temple/mosque/church',
  'was volunteering at a charity event',
  'was waiting for a delivery at home',
  'was at a job interview',
  'was renewing passport at ICA',
  'was attending a funeral',
  'was at the library studying',
  'was meeting with a lawyer',
  'was getting a haircut',
];

// ============================================
// RELATIONSHIPS
// ============================================

export const relationshipTypes = [
  'colleagues who work closely together',
  'friendly acquaintances who chat occasionally',
  'former friends who had a falling out',
  'rivals competing for the same position',
  'mentor and mentee relationship',
  'neighbours who barely know each other',
  'old schoolmates who recently reconnected',
  'members of the same interest group',
  'people who dated briefly in the past',
  'distant relatives who rarely meet',
  'business partners with shared interests',
  'people connected through mutual friends',
  'teacher and former student',
  'customer and regular service provider',
  'childhood friends who grew apart',
];

// ============================================
// HELPER FUNCTIONS
// ============================================

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateCharacterName(
  ethnicity?: Ethnicity,
  gender?: 'male' | 'female'
): CharacterName {
  const eth = ethnicity || pickRandom(['chinese', 'malay', 'indian', 'eurasian'] as Ethnicity[]);
  const gen = gender || pickRandom(['male', 'female'] as const);

  let first: string;
  let last: string;

  switch (eth) {
    case 'chinese':
      first = gen === 'male'
        ? pickRandom(chineseFirstNamesMale)
        : pickRandom(chineseFirstNamesFemale);
      last = pickRandom(chineseSurnames);
      break;
    case 'malay':
      first = gen === 'male'
        ? pickRandom(malayFirstNamesMale)
        : pickRandom(malayFirstNamesFemale);
      last = gen === 'male'
        ? pickRandom(malayPatronymicMale)
        : pickRandom(malayPatronymicFemale);
      break;
    case 'indian':
      first = gen === 'male'
        ? pickRandom(indianFirstNamesMale)
        : pickRandom(indianFirstNamesFemale);
      last = pickRandom(indianSurnames);
      break;
    case 'eurasian':
    case 'others':
      first = gen === 'male'
        ? pickRandom(eurasianFirstNamesMale)
        : pickRandom(eurasianFirstNamesFemale);
      last = pickRandom(eurasianSurnames);
      break;
    default:
      first = 'Unknown';
      last = 'Person';
  }

  return { first, last, ethnicity: eth, gender: gen };
}

export function getFullName(name: CharacterName): string {
  if (name.ethnicity === 'malay') {
    return `${name.first} ${name.last}`;
  }
  return `${name.first} ${name.last}`;
}

export function getOccupationsForLocation(locationType: string): Occupation[] {
  return occupationsByLocation[locationType] || occupationsByLocation['community'];
}

export function generateAge(occupation: Occupation): number {
  const [min, max] = occupation.ageRange;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomPersonality(): [string, string] {
  return pickRandom(personalityPairs);
}

export function getRandomMotive(): string {
  return pickRandom(motives);
}

export function getRandomAlibi(): string {
  return pickRandom(alibis);
}

export function getRandomRelationship(): string {
  return pickRandom(relationshipTypes);
}

// Calculate total name combinations
// Chinese: 40 male + 40 female first names × 40 surnames = 3,200 names
// Malay: 40 male + 40 female first names × 24 patronymics = 1,920 names
// Indian: 40 male + 40 female first names × 40 surnames = 3,200 names
// Eurasian: 30 male + 30 female first names × 29 surnames = 1,740 names
// Total unique names: ~10,060 combinations
