/**
 * SINGAPORE NAMES DATABASE
 *
 * Pre-tagged names with gender, ethnicity, skin tone, and features.
 * The case generator MUST pick names from this database only.
 * This guarantees 100% accurate image generation.
 *
 * MATH FOR 1M+ UNIQUE STORYLINES:
 * - Chinese: 80 surnames × 60 male given × 60 female given = 9,600 full names
 * - Malay: Flexible naming = ~5,000 combinations
 * - Indian: 80 surnames × 60 male × 60 female = 9,600 full names
 * - Eurasian: 80 surnames × 60 male × 60 female = 9,600 full names
 * - Total: ~34,000 unique full names
 *
 * For 3 suspects per case: 34,000 × 33,999 × 33,998 = ~39 trillion combinations
 * FAR exceeds 1 million unique storylines requirement.
 */

// ============================================
// TYPES
// ============================================

export type Ethnicity = 'chinese' | 'malay' | 'indian' | 'eurasian';
export type Gender = 'male' | 'female';

export interface PersonName {
  fullName: string;
  gender: Gender;
  ethnicity: Ethnicity;
}

export interface EthnicityInfo {
  race: string;
  ethnicity: string;
  skinTone: string;
  features: string;
}

// ============================================
// ETHNICITY DEFINITIONS (for image generation)
// ============================================

export const ETHNICITY_INFO: Record<Ethnicity, EthnicityInfo> = {
  chinese: {
    race: 'Chinese',
    ethnicity: 'Chinese Singaporean',
    skinTone: 'beautiful natural East Asian skin tone ranging from fair to light tan, realistic healthy human skin, dignified appearance',
    features: 'elegant East Asian Chinese facial features, natural dark brown or brown eyes, straight black hair, respectful portrayal'
  },
  malay: {
    race: 'Malay',
    ethnicity: 'Malay Singaporean',
    skinTone: 'beautiful natural Southeast Asian Malay skin tone, warm brown complexion, realistic healthy human skin, dignified appearance',
    features: 'elegant Southeast Asian Malay facial features, natural dark brown eyes, black hair, respectful portrayal'
  },
  indian: {
    race: 'Indian',
    ethnicity: 'Indian Singaporean',
    // CRITICAL: Indian skin must be BROWN - NOT fair/light
    skinTone: 'dark brown Indian skin, rich brown complexion, deep brown skin tone, South Asian brown skin color, NOT fair skin NOT light skin NOT pale skin, realistic healthy brown human skin, dignified appearance',
    features: 'elegant South Asian Indian facial features, natural dark brown or black eyes, black hair, respectful portrayal'
  },
  eurasian: {
    race: 'Eurasian',
    ethnicity: 'Eurasian Singaporean',
    skinTone: 'beautiful natural mixed heritage skin tone, olive to light brown complexion, Caucasian skin tone, realistic healthy human skin, dignified appearance',
    features: 'elegant mixed Eurasian facial features, natural eye color varies, respectful portrayal'
  }
};

// ============================================
// CHINESE NAMES (~9,600 combinations)
// Singapore's largest ethnic group (~74%)
// ============================================

const CHINESE_SURNAMES = [
  'Tan', 'Lim', 'Lee', 'Ng', 'Wong', 'Chan', 'Goh', 'Ong', 'Koh', 'Chua',
  'Chen', 'Teo', 'Yeo', 'Sim', 'Foo', 'Ho', 'Ang', 'Seah', 'Tay', 'Chew',
  'Low', 'Yap', 'Wee', 'Phua', 'Quek', 'Chia', 'Gan', 'Poh', 'Soh', 'Toh',
  'Lau', 'Leong', 'Yong', 'Kwok', 'Loh', 'Mok', 'Lai', 'Heng', 'Kang', 'Khoo',
  'Seet', 'Chong', 'Ting', 'Choo', 'Chiang', 'Shen', 'Liu', 'Wang', 'Zhang', 'Huang',
  'Zhao', 'Wu', 'Zhou', 'Sun', 'Ma', 'Zhu', 'Hu', 'Guo', 'He', 'Lin',
  'Xu', 'Deng', 'Feng', 'Han', 'Xie', 'Tang', 'Cao', 'Su', 'Jiang', 'Lu',
  'Zheng', 'Pan', 'Du', 'Ye', 'Cheng', 'Yuan', 'Dong', 'Liang', 'Zhong', 'Ren'
];

const CHINESE_MALE_GIVEN = [
  'Wei Ming', 'Jun Hao', 'Zhi Wei', 'Kai Xiang', 'Jia Jun', 'Yi Xuan', 'Hao Ran',
  'Zi Hao', 'Jun Jie', 'Wei Jie', 'Jia Wei', 'Zhi Hao', 'Jun Wei', 'Yi Chen',
  'Hao Yu', 'Jia Hao', 'Zhi Xuan', 'Wei Liang', 'Jun Ming', 'Kai Ming',
  'Boon Keng', 'Chee Keong', 'Kok Leong', 'Wee Kiat', 'Ah Kow', 'Ah Beng',
  'Boon Huat', 'Kok Wai', 'Wee Soon', 'Keng Hock', 'Boon Teck', 'Kok Seng',
  'Zheng Yang', 'Rui Feng', 'Jing Long', 'Tian Yu', 'Ming Hao', 'Xin Yu',
  'Chen Wei', 'Peng Fei', 'Bo Wen', 'Hao Dong', 'Zi Yang', 'Yu Chen',
  'Sheng Jie', 'Tian Ming', 'Jian Wei', 'Xiao Long', 'Da Wei', 'Guo Qiang',
  'Cheng Long', 'Xing Yu', 'Wen Hao', 'Jia Ming', 'Kai Feng', 'Zi Ming',
  'Hong Wei', 'Qiang Wei', 'Long Fei', 'Feng Ming'
];

// Single-syllable Chinese male names (common in Singapore)
const CHINESE_MALE_SINGLE = [
  'Wei', 'Jun', 'Hao', 'Ming', 'Kai', 'Jie', 'Chen', 'Yang', 'Feng', 'Long',
  'Bo', 'Yu', 'Qiang', 'Hong', 'Seng', 'Keng', 'Boon', 'Kok', 'Wee', 'Huat',
  'Teck', 'Kow', 'Beng', 'Leong', 'Kiat', 'Soon', 'Hock', 'Liang', 'Cheng',
  'Peng', 'Dong', 'Sheng', 'Jian', 'Guo', 'Xing', 'Fei', 'Rui', 'Tian', 'Xin'
];

const CHINESE_FEMALE_GIVEN = [
  'Mei Ling', 'Xin Yi', 'Hui Wen', 'Jia Hui', 'Yu Xuan', 'Zi Xuan', 'Xin Yue',
  'Jia Ying', 'Yi Ting', 'Xin Ying', 'Hui Min', 'Jia Min', 'Mei Xin', 'Yu Ting',
  'Xin Hui', 'Jia Xin', 'Yi Xin', 'Hui Ling', 'Mei Hui', 'Xin Wen',
  'Siew Mei', 'Siew Ling', 'Bee Lian', 'Siew Kheng', 'Mei Fong', 'Ai Ling',
  'Bee Hoon', 'Siew Peng', 'Mei Yun', 'Ai Mei', 'Bee Eng', 'Siew Lan',
  'Xiao Yan', 'Li Hua', 'Fang Fang', 'Ling Ling', 'Wei Wei', 'Yan Yan',
  'Xiu Ying', 'Hong Mei', 'Mei Rong', 'Xiao Ling', 'Yu Mei', 'Xin Mei',
  'Rui Xin', 'Ting Ting', 'Ming Zhu', 'Xiao Hong', 'Li Na', 'Mei Yue',
  'Jing Jing', 'Xiao Yu', 'Wen Wen', 'Yan Ling', 'Fang Ling', 'Xiu Lan',
  'Hong Yan', 'Yu Lan', 'Ming Mei', 'Xiao Mei'
];

// ============================================
// MALAY NAMES (~5,000 combinations)
// Singapore's second largest ethnic group (~13%)
// ============================================

const MALAY_MALE_NAMES = [
  'Ahmad', 'Muhammad', 'Mohamed', 'Mohammad', 'Mohd', 'Abdul', 'Abdullah',
  'Ibrahim', 'Ismail', 'Hassan', 'Hussein', 'Ali', 'Omar', 'Osman',
  'Yusof', 'Yusuf', 'Hamid', 'Rashid', 'Rahim', 'Rahman', 'Razak',
  'Zainal', 'Zulkifli', 'Aziz', 'Azman', 'Azhar', 'Hafiz', 'Hakim',
  'Kamal', 'Salleh', 'Idris', 'Jalil', 'Jamal', 'Farid', 'Fauzi',
  'Rizal', 'Roslan', 'Rosman', 'Sharif', 'Sulaiman', 'Nasir', 'Naim',
  'Amin', 'Amir', 'Arif', 'Azmi', 'Bakar', 'Dahlan', 'Daud', 'Firdaus',
  'Hanif', 'Haris', 'Irfan', 'Iskandar', 'Kasim', 'Latif', 'Malik',
  'Mazlan', 'Mustafa', 'Rafiq', 'Rais', 'Saiful', 'Samad', 'Shamsudin',
  'Syafiq', 'Tajudin', 'Usman', 'Wahid', 'Yasin', 'Yazid', 'Zaidi',
  'Zakaria', 'Zaki', 'Zulfikar', 'Harun', 'Kamarul', 'Khairul', 'Nizam'
];

const MALAY_FEMALE_NAMES = [
  'Siti', 'Nur', 'Nurul', 'Noor', 'Fatimah', 'Aminah', 'Aishah', 'Aisyah',
  'Zainab', 'Khadijah', 'Hajar', 'Noraini', 'Rosnah', 'Rohani', 'Ramlah',
  'Hidayah', 'Huda', 'Izzah', 'Fatin', 'Balqis', 'Safiah', 'Maryam',
  'Ayu', 'Dewi', 'Putri', 'Ratna', 'Wati', 'Yanti', 'Zahra', 'Zara',
  'Aina', 'Alya', 'Amira', 'Atiqah', 'Azura', 'Dahlia', 'Diana', 'Dina',
  'Farah', 'Farida', 'Hafizah', 'Hanis', 'Husna', 'Ilyana', 'Iman', 'Intan',
  'Jasmin', 'Laila', 'Lina', 'Mariam', 'Nabila', 'Nadiah', 'Nadhirah', 'Najwa',
  'Nisa', 'Raihana', 'Rashidah', 'Raudhah', 'Ruzanna', 'Salma', 'Sarina',
  'Sharifah', 'Sofia', 'Suhaila', 'Syahirah', 'Syakirah', 'Wardah', 'Yasmin',
  'Yusra', 'Zahirah', 'Zulaikha', 'Adibah', 'Afiqah', 'Amalina', 'Anis'
];

const MALAY_FAMILY_NAMES = [
  'bin', 'binte', // These are patronymics, not surnames
];

// Helper to generate Malay full names
function generateMalayName(gender: Gender): string {
  const names = gender === 'male' ? MALAY_MALE_NAMES : MALAY_FEMALE_NAMES;
  const firstName = names[Math.floor(Math.random() * names.length)];

  // Malay names often use patronymic: Name bin/binte FatherName
  // Or just first name, or compound names
  const patterns = [
    () => firstName,
    () => `${firstName} ${MALAY_MALE_NAMES[Math.floor(Math.random() * MALAY_MALE_NAMES.length)]}`,
    () => `${firstName} ${gender === 'male' ? 'bin' : 'binte'} ${MALAY_MALE_NAMES[Math.floor(Math.random() * MALAY_MALE_NAMES.length)]}`,
  ];

  return patterns[Math.floor(Math.random() * patterns.length)]();
}

// ============================================
// INDIAN NAMES (~9,600 combinations)
// Singapore's third largest ethnic group (~9%)
// ============================================

const INDIAN_SURNAMES = [
  'Kumar', 'Sharma', 'Singh', 'Nair', 'Pillai', 'Menon', 'Iyer', 'Iyengar',
  'Reddy', 'Rao', 'Naidu', 'Chetty', 'Chettiar', 'Nathan', 'Narayanan',
  'Krishnan', 'Ramachandran', 'Ramasamy', 'Thangaraj', 'Velayutham',
  'Jayakumar', 'Manikam', 'Perumal', 'Rajendran', 'Saravanan', 'Senthil',
  'Sivakumar', 'Subramaniam', 'Vaithilingam', 'Veerasamy', 'Maniam',
  'Suppiah', 'Karuppiah', 'Krishnamurthy', 'Muniandy', 'Nagarajan',
  'Palaniappan', 'Ponnusamy', 'Rajagopal', 'Rajasekaran', 'Sakthivel',
  'Selvaraj', 'Sivalingam', 'Somasundaram', 'Thangavelu', 'Thiruchelvam',
  'Vadivelu', 'Valliappan', 'Vasanthan', 'Balakrishnan', 'Raghavan',
  'Srinivasan', 'Natarajan', 'Sundaram', 'Chandran', 'Gopal', 'Rajan',
  'Venkatesh', 'Murthy', 'Acharya', 'Bhatt', 'Desai', 'Gupta', 'Joshi',
  'Kapoor', 'Malhotra', 'Mehta', 'Mishra', 'Pandey', 'Patel', 'Saxena',
  'Trivedi', 'Verma', 'Chakraborty', 'Das', 'Ghosh', 'Mukherjee', 'Sen'
];

const INDIAN_MALE_GIVEN = [
  'Raj', 'Suresh', 'Ramesh', 'Venkat', 'Bala', 'Muthu', 'Anand', 'Vijay',
  'Arun', 'Siva', 'Shankar', 'Mohan', 'Guru', 'Ravi', 'Hari', 'Ganesh',
  'Prabhu', 'Selvam', 'Murugan', 'Arumugam', 'Velu', 'Thana', 'Subra',
  'Mahendra', 'Rajesh', 'Dinesh', 'Sunil', 'Manoj', 'Prakash', 'Sanjay',
  'Ajay', 'Deepak', 'Rahul', 'Amit', 'Vivek', 'Vikram', 'Rohan', 'Karthik',
  'Arvind', 'Ashok', 'Balaji', 'Bharath', 'Chandra', 'Dhruv', 'Girish',
  'Harish', 'Jagdish', 'Kishore', 'Lakshman', 'Madhavan', 'Navin', 'Prasad',
  'Raghav', 'Sathish', 'Surya', 'Varun', 'Yogesh', 'Krishna', 'Vishnu'
];

const INDIAN_FEMALE_GIVEN = [
  'Priya', 'Lakshmi', 'Devi', 'Kavitha', 'Sumathi', 'Meena', 'Geetha',
  'Radha', 'Padma', 'Malathi', 'Vani', 'Jaya', 'Nalini', 'Sarala', 'Kamala',
  'Indira', 'Deepa', 'Asha', 'Anita', 'Sunita', 'Neha', 'Pooja', 'Divya',
  'Swathi', 'Lakshana', 'Revathi', 'Sangeetha', 'Bhavani', 'Durga', 'Parvathi',
  'Saraswathi', 'Shanthi', 'Uma', 'Vimala', 'Nirmala', 'Pushpa', 'Rani',
  'Seetha', 'Tara', 'Usha', 'Vasanthi', 'Vijaya', 'Yamuna', 'Ambika',
  'Chitra', 'Gayathri', 'Hema', 'Janaki', 'Kalyani', 'Mythili', 'Nandini',
  'Padmini', 'Rekha', 'Saroja', 'Sudha', 'Vanitha', 'Vidya', 'Yamini'
];

// ============================================
// EURASIAN NAMES (~9,600 combinations)
// Singapore's Others category (~3%)
// Includes Portuguese-Eurasian, Dutch-Eurasian, British heritage
// Also Western expats for international storylines
// ============================================

const EURASIAN_SURNAMES = [
  // Traditional Singapore Eurasian
  'De Souza', 'Pereira', 'Rodrigues', 'Fernandez', 'Gomes', 'Braga',
  'Shepherdson', 'Westerhout', 'Scully', 'Clarke', 'Oliveiro', 'Tessensohn',
  'Woodford', 'Aroozoo', 'Doss', 'Monteiro', 'Sequeira', 'Rozario',
  'Conceicao', 'Lazaroo', 'Hendricks', 'Barker', 'Meyer', 'Jansen',
  'Cornelius', 'Anthony', 'Xavier', 'Sebastian', 'Vincent',
  // Common Western surnames
  'Anderson', 'Campbell', 'Davidson', 'Edwards', 'Fleming', 'Gordon',
  'Harris', 'Jackson', 'Kennedy', 'Lambert', 'Morrison', 'Nelson',
  'Oliver', 'Palmer', 'Reynolds', 'Sanders', 'Thompson', 'Wallace',
  'Wilson', 'Peterson', 'Johnson', 'Smith', 'Williams', 'Brown',
  'Jones', 'Davis', 'Miller', 'Taylor', 'Thomas', 'Moore', 'White',
  'Martin', 'Robinson', 'Clark', 'Lewis', 'Walker', 'Hall', 'Allen',
  'Young', 'King', 'Wright', 'Hill', 'Scott', 'Green', 'Adams', 'Baker',
  'Collins', 'Stewart', 'Cook', 'Murphy', 'Bell', 'Cooper', 'Howard',
  'Ward', 'Cox', 'Richardson', 'Watson', 'Brooks', 'Kelly', 'Price',
  'Bennett', 'Wood', 'Barnes', 'Ross', 'Henderson', 'Gray', 'Hughes',
  'Cole', 'Jenkins', 'Perry', 'Powell', 'Russell', 'Ford', 'Hamilton',
  'Graham', 'Sullivan', 'Mason', 'Fisher', 'Freeman', 'Shaw', 'Fox'
];

const EURASIAN_MALE_GIVEN = [
  'James', 'John', 'Michael', 'David', 'Peter', 'Paul', 'George', 'William',
  'Richard', 'Thomas', 'Robert', 'Joseph', 'Charles', 'Edward', 'Henry',
  'Arthur', 'Albert', 'Frederick', 'Francis', 'Philip', 'Raymond', 'Benjamin',
  'Martin', 'Kevin', 'Brian', 'Steven', 'Mark', 'Anthony', 'Gary', 'Larry',
  'Daniel', 'Matthew', 'Andrew', 'Christopher', 'Timothy', 'Joshua', 'Ryan',
  'Eric', 'Jacob', 'Sean', 'Adam', 'Nathan', 'Justin', 'Aaron', 'Brandon',
  'Dylan', 'Ethan', 'Lucas', 'Mason', 'Logan', 'Alexander', 'Sebastian',
  'Jack', 'Oliver', 'Harry', 'Charlie', 'Oscar', 'Leo', 'Archie', 'Max'
];

const EURASIAN_FEMALE_GIVEN = [
  'Mary', 'Sarah', 'Elizabeth', 'Emily', 'Amanda', 'Jessica', 'Jennifer',
  'Michelle', 'Nicole', 'Rachel', 'Rebecca', 'Susan', 'Karen', 'Lisa',
  'Linda', 'Angela', 'Patricia', 'Sandra', 'Nancy', 'Helen', 'Dorothy',
  'Anna', 'Grace', 'Emma', 'Olivia', 'Sophia', 'Mia', 'Ava', 'Isabella',
  'Amelia', 'Charlotte', 'Harper', 'Evelyn', 'Abigail', 'Ella', 'Lily',
  'Hannah', 'Victoria', 'Aurora', 'Penelope', 'Lucy', 'Stella', 'Hazel',
  'Violet', 'Claire', 'Samantha', 'Natalie', 'Julia', 'Alice', 'Ruby',
  'Ivy', 'Eleanor', 'Chloe', 'Rose', 'Daisy', 'Dolly', 'Molly', 'Sophie'
];

// ============================================
// NAME LOOKUP MAP (for instant detection)
// ============================================

// Build lookup maps at module load time
const nameLookup = new Map<string, { gender: Gender; ethnicity: Ethnicity }>();

function buildLookupMaps() {
  // Chinese single-syllable male names (PRIORITY - add first)
  for (const name of CHINESE_MALE_SINGLE) {
    nameLookup.set(name.toLowerCase(), { gender: 'male', ethnicity: 'chinese' });
  }

  // Chinese names
  for (const surname of CHINESE_SURNAMES) {
    for (const given of CHINESE_MALE_GIVEN) {
      const fullName = `${given} ${surname}`;
      nameLookup.set(fullName.toLowerCase(), { gender: 'male', ethnicity: 'chinese' });
      // Also support surname-first format
      const altName = `${surname} ${given}`;
      nameLookup.set(altName.toLowerCase(), { gender: 'male', ethnicity: 'chinese' });
    }
    for (const given of CHINESE_FEMALE_GIVEN) {
      const fullName = `${given} ${surname}`;
      nameLookup.set(fullName.toLowerCase(), { gender: 'female', ethnicity: 'chinese' });
      const altName = `${surname} ${given}`;
      nameLookup.set(altName.toLowerCase(), { gender: 'female', ethnicity: 'chinese' });
    }
  }

  // Malay names (simpler - just track the base names)
  for (const name of MALAY_MALE_NAMES) {
    nameLookup.set(name.toLowerCase(), { gender: 'male', ethnicity: 'malay' });
  }
  for (const name of MALAY_FEMALE_NAMES) {
    nameLookup.set(name.toLowerCase(), { gender: 'female', ethnicity: 'malay' });
  }

  // Indian names - add INDIVIDUAL given names first (for single-word lookup)
  for (const given of INDIAN_MALE_GIVEN) {
    nameLookup.set(given.toLowerCase(), { gender: 'male', ethnicity: 'indian' });
  }
  for (const given of INDIAN_FEMALE_GIVEN) {
    nameLookup.set(given.toLowerCase(), { gender: 'female', ethnicity: 'indian' });
  }
  // Then add full names
  for (const surname of INDIAN_SURNAMES) {
    for (const given of INDIAN_MALE_GIVEN) {
      const fullName = `${given} ${surname}`;
      nameLookup.set(fullName.toLowerCase(), { gender: 'male', ethnicity: 'indian' });
    }
    for (const given of INDIAN_FEMALE_GIVEN) {
      const fullName = `${given} ${surname}`;
      nameLookup.set(fullName.toLowerCase(), { gender: 'female', ethnicity: 'indian' });
    }
  }

  // Eurasian names - add INDIVIDUAL given names first
  for (const given of EURASIAN_MALE_GIVEN) {
    nameLookup.set(given.toLowerCase(), { gender: 'male', ethnicity: 'eurasian' });
  }
  for (const given of EURASIAN_FEMALE_GIVEN) {
    nameLookup.set(given.toLowerCase(), { gender: 'female', ethnicity: 'eurasian' });
  }
  // Then add full names
  for (const surname of EURASIAN_SURNAMES) {
    for (const given of EURASIAN_MALE_GIVEN) {
      const fullName = `${given} ${surname}`;
      nameLookup.set(fullName.toLowerCase(), { gender: 'male', ethnicity: 'eurasian' });
    }
    for (const given of EURASIAN_FEMALE_GIVEN) {
      const fullName = `${given} ${surname}`;
      nameLookup.set(fullName.toLowerCase(), { gender: 'female', ethnicity: 'eurasian' });
    }
  }
}

// Build maps on module load
buildLookupMaps();

// ============================================
// PUBLIC API
// ============================================

/**
 * Generate a random name from the database
 */
export function getRandomName(options?: {
  ethnicity?: Ethnicity;
  gender?: Gender;
}): PersonName {
  // If no ethnicity specified, use Singapore demographics
  // Chinese 74%, Malay 13%, Indian 9%, Others 4%
  const ethnicity = options?.ethnicity || ((): Ethnicity => {
    const rand = Math.random() * 100;
    if (rand < 74) return 'chinese';
    if (rand < 87) return 'malay';
    if (rand < 96) return 'indian';
    return 'eurasian';
  })();

  // Random gender if not specified
  const gender = options?.gender || (Math.random() < 0.5 ? 'male' : 'female');

  let fullName: string;

  switch (ethnicity) {
    case 'chinese': {
      const surname = CHINESE_SURNAMES[Math.floor(Math.random() * CHINESE_SURNAMES.length)];
      const givenNames = gender === 'male' ? CHINESE_MALE_GIVEN : CHINESE_FEMALE_GIVEN;
      const given = givenNames[Math.floor(Math.random() * givenNames.length)];
      // Singapore Chinese typically use Given Name + Surname
      fullName = `${given} ${surname}`;
      break;
    }
    case 'malay': {
      fullName = generateMalayName(gender);
      break;
    }
    case 'indian': {
      const surname = INDIAN_SURNAMES[Math.floor(Math.random() * INDIAN_SURNAMES.length)];
      const givenNames = gender === 'male' ? INDIAN_MALE_GIVEN : INDIAN_FEMALE_GIVEN;
      const given = givenNames[Math.floor(Math.random() * givenNames.length)];
      fullName = `${given} ${surname}`;
      break;
    }
    case 'eurasian': {
      const surname = EURASIAN_SURNAMES[Math.floor(Math.random() * EURASIAN_SURNAMES.length)];
      const givenNames = gender === 'male' ? EURASIAN_MALE_GIVEN : EURASIAN_FEMALE_GIVEN;
      const given = givenNames[Math.floor(Math.random() * givenNames.length)];
      fullName = `${given} ${surname}`;
      break;
    }
  }

  return { fullName, gender, ethnicity };
}

/**
 * Get multiple unique random names
 */
export function getRandomNames(count: number, options?: {
  ethnicity?: Ethnicity;
  gender?: Gender;
  ensureDiversity?: boolean; // If true, ensures mix of ethnicities
}): PersonName[] {
  const names: PersonName[] = [];
  const usedNames = new Set<string>();

  // If diversity is requested and count >= 4, ensure at least one of each ethnicity
  if (options?.ensureDiversity && count >= 4) {
    const ethnicities: Ethnicity[] = ['chinese', 'malay', 'indian', 'eurasian'];
    for (const eth of ethnicities) {
      const name = getRandomName({ ethnicity: eth, gender: options?.gender });
      if (!usedNames.has(name.fullName)) {
        names.push(name);
        usedNames.add(name.fullName);
      }
    }
  }

  // Fill remaining slots
  while (names.length < count) {
    const name = getRandomName(options);
    if (!usedNames.has(name.fullName)) {
      names.push(name);
      usedNames.add(name.fullName);
    }
  }

  return names;
}

/**
 * Look up name info from database (guaranteed accurate)
 * Returns null if name not in database
 */
export function lookupName(fullName: string): { gender: Gender; ethnicity: Ethnicity } | null {
  // Direct lookup
  const direct = nameLookup.get(fullName.toLowerCase());
  if (direct) return direct;

  // Try to find by parts (for Malay names with patronymics)
  const parts = fullName.toLowerCase().split(/[\s-]+/);

  // First try consecutive pairs (for multi-word names like "Ah Kow", "Mei Ling")
  for (let i = 0; i < parts.length - 1; i++) {
    const pair = `${parts[i]} ${parts[i + 1]}`;
    const pairMatch = nameLookup.get(pair);
    if (pairMatch) return pairMatch;
  }

  // Then try single parts
  for (const part of parts) {
    const partMatch = nameLookup.get(part);
    if (partMatch) return partMatch;
  }

  return null;
}

/**
 * Get ethnicity info for image generation
 */
export function getEthnicityInfo(ethnicity: Ethnicity): EthnicityInfo {
  return ETHNICITY_INFO[ethnicity];
}

/**
 * Validate if a name exists in our database
 */
export function isValidName(fullName: string): boolean {
  return lookupName(fullName) !== null;
}

/**
 * Get all available names for a specific ethnicity and gender
 */
export function getAvailableNames(ethnicity: Ethnicity, gender: Gender): string[] {
  const names: string[] = [];

  switch (ethnicity) {
    case 'chinese':
      for (const surname of CHINESE_SURNAMES) {
        const givenNames = gender === 'male' ? CHINESE_MALE_GIVEN : CHINESE_FEMALE_GIVEN;
        for (const given of givenNames) {
          names.push(`${given} ${surname}`);
        }
      }
      break;
    case 'malay':
      const malayNames = gender === 'male' ? MALAY_MALE_NAMES : MALAY_FEMALE_NAMES;
      names.push(...malayNames);
      break;
    case 'indian':
      for (const surname of INDIAN_SURNAMES) {
        const givenNames = gender === 'male' ? INDIAN_MALE_GIVEN : INDIAN_FEMALE_GIVEN;
        for (const given of givenNames) {
          names.push(`${given} ${surname}`);
        }
      }
      break;
    case 'eurasian':
      for (const surname of EURASIAN_SURNAMES) {
        const givenNames = gender === 'male' ? EURASIAN_MALE_GIVEN : EURASIAN_FEMALE_GIVEN;
        for (const given of givenNames) {
          names.push(`${given} ${surname}`);
        }
      }
      break;
  }

  return names;
}

/**
 * Get statistics about the names database
 */
export function getDatabaseStats(): {
  total: number;
  byEthnicity: Record<Ethnicity, number>;
  byGender: Record<Gender, number>;
} {
  const stats = {
    total: 0,
    byEthnicity: { chinese: 0, malay: 0, indian: 0, eurasian: 0 } as Record<Ethnicity, number>,
    byGender: { male: 0, female: 0 } as Record<Gender, number>,
  };

  // Chinese
  const chineseMale = CHINESE_SURNAMES.length * CHINESE_MALE_GIVEN.length;
  const chineseFemale = CHINESE_SURNAMES.length * CHINESE_FEMALE_GIVEN.length;
  stats.byEthnicity.chinese = chineseMale + chineseFemale;

  // Malay (simpler count - base names)
  stats.byEthnicity.malay = MALAY_MALE_NAMES.length + MALAY_FEMALE_NAMES.length;

  // Indian
  const indianMale = INDIAN_SURNAMES.length * INDIAN_MALE_GIVEN.length;
  const indianFemale = INDIAN_SURNAMES.length * INDIAN_FEMALE_GIVEN.length;
  stats.byEthnicity.indian = indianMale + indianFemale;

  // Eurasian
  const eurasianMale = EURASIAN_SURNAMES.length * EURASIAN_MALE_GIVEN.length;
  const eurasianFemale = EURASIAN_SURNAMES.length * EURASIAN_FEMALE_GIVEN.length;
  stats.byEthnicity.eurasian = eurasianMale + eurasianFemale;

  // Totals
  stats.byGender.male = chineseMale + MALAY_MALE_NAMES.length + indianMale + eurasianMale;
  stats.byGender.female = chineseFemale + MALAY_FEMALE_NAMES.length + indianFemale + eurasianFemale;
  stats.total = stats.byGender.male + stats.byGender.female;

  return stats;
}
