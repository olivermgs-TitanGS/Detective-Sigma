/**
 * PROCEDURAL NAME GENERATOR
 *
 * Generates unique Singapore character names procedurally.
 * Combines first name + surname components for massive variety.
 */

export type AgeCategory = 'child' | 'teen' | 'young_adult' | 'adult' | 'middle_aged' | 'senior';

export interface ProceduralCharacter {
  id: string;
  name: string;
  ethnicity: 'Chinese' | 'Malay' | 'Indian' | 'Eurasian';
  gender: 'male' | 'female';
  ageGroup: 'young' | 'middle' | 'senior';
  // Enhanced age system
  ageCategory?: AgeCategory;
  specificAge?: number;
  displayAge?: string;
  role: string;
  personality: string[];
  isGuilty: boolean;
}

// ============================================
// NAME COMPONENT POOLS
// ============================================

export const NAME_COMPONENTS = {
  chinese: {
    surnames: [
      'Tan', 'Lim', 'Lee', 'Ng', 'Wong', 'Goh', 'Chua', 'Ong', 'Koh', 'Teo',
      'Chan', 'Chen', 'Low', 'Sim', 'Yeo', 'Ho', 'Foo', 'Chong', 'Lau', 'Tay',
      'Leong', 'Yap', 'Seah', 'Pang', 'Ang', 'Loh', 'Quek', 'Wee', 'Soh', 'Chew',
    ],
    maleFirst: [
      'Wei', 'Jun', 'Ming', 'Hao', 'Jie', 'Yang', 'Kai', 'Zhi', 'Yi', 'Xuan',
      'Hock', 'Boon', 'Chee', 'Seng', 'Huat', 'Keng', 'Chuan', 'Teck', 'Wah', 'Kok',
      'Ah Kow', 'Ah Beng', 'Ah Seng', 'Ah Huat', 'Ah Long', 'Kian', 'Sheng', 'Hong', 'Jian', 'Feng',
      'Zheng', 'Liang', 'Yong', 'Cheng', 'Rong', 'Xing', 'Dong', 'Wen', 'Peng', 'Da',
      'Xiong', 'Hui', 'Guo', 'Jin', 'Chang', 'Jing', 'Bo', 'An', 'Hai', 'Long',
    ],
    femaleFirst: [
      'Mei', 'Ling', 'Hui', 'Xin', 'Ying', 'Fang', 'Jing', 'Li', 'Min', 'Yan',
      'Siew', 'Bee', 'Lan', 'Choo', 'Kim', 'Ah Lian', 'Ah Mei', 'Ah Hua', 'Ah Choo', 'Ah Eng',
      'Xiu', 'Ping', 'Fen', 'Na', 'Hong', 'Yun', 'Juan', 'Qing', 'Zhen', 'Xia',
      'Ying Ying', 'Mei Ling', 'Hui Ling', 'Xin Yi', 'Li Hua', 'Mei Xin', 'Shu Fen', 'Ai Ling', 'Pei Wen', 'Jia Min',
      'Zi Wei', 'Xiao Mei', 'Yu Ting', 'Jia Yi', 'Wen Ting', 'Rui Xin', 'Jia Xin', 'Yu Xin', 'Xin Ying', 'Yi Ling',
    ],
  },
  malay: {
    maleSurnames: ['bin Hassan', 'bin Ahmad', 'bin Ibrahim', 'bin Osman', 'bin Abdullah', 'bin Yusof', 'bin Omar', 'bin Ali', 'bin Rahman', 'bin Ismail',
                   'bin Mohd', 'bin Aziz', 'bin Karim', 'bin Jamal', 'bin Zain', 'bin Rahim', 'bin Said', 'bin Hamid', 'bin Rashid', 'bin Salim'],
    femaleSurnames: ['binti Hassan', 'binti Ahmad', 'binti Ibrahim', 'binti Osman', 'binti Abdullah', 'binti Yusof', 'binti Omar', 'binti Ali', 'binti Rahman', 'binti Ismail',
                     'binti Mohd', 'binti Aziz', 'binti Karim', 'binti Jamal', 'binti Zain', 'binti Rahim', 'binti Said', 'binti Hamid', 'binti Rashid', 'binti Salim'],
    maleFirst: [
      'Ahmad', 'Muhammad', 'Mohd', 'Abdul', 'Ali', 'Farid', 'Ismail', 'Rashid', 'Kamal', 'Hafiz',
      'Azman', 'Zulkifli', 'Aziz', 'Rahman', 'Ibrahim', 'Yusof', 'Hassan', 'Omar', 'Sulaiman', 'Amir',
      'Faisal', 'Rizal', 'Hakim', 'Irfan', 'Syafiq', 'Nazri', 'Khairul', 'Syahrul', 'Zaki', 'Farhan',
      'Adam', 'Imran', 'Danial', 'Arif', 'Fikri', 'Haris', 'Ikmal', 'Jazli', 'Luqman', 'Mikhail',
      'Nabil', 'Qusyairi', 'Razif', 'Shahril', 'Taufik', 'Umar', 'Wafi', 'Yazid', 'Zafri', 'Aiman',
    ],
    femaleFirst: [
      'Siti', 'Nur', 'Fatimah', 'Aminah', 'Zainab', 'Noraini', 'Aishah', 'Nurul', 'Farah', 'Aisha',
      'Mariam', 'Khadijah', 'Hajar', 'Sarah', 'Aisyah', 'Syahira', 'Nabila', 'Aina', 'Husna', 'Zahra',
      'Aliya', 'Balqis', 'Damia', 'Elyana', 'Fatin', 'Hanna', 'Irdina', 'Jasmine', 'Kayla', 'Liana',
      'Maisarah', 'Nadia', 'Qistina', 'Rania', 'Safiya', 'Tasnim', 'Umairah', 'Wardina', 'Yasmin', 'Zara',
      'Adriana', 'Batrisyia', 'Dahlia', 'Eryna', 'Farhana', 'Hana', 'Inara', 'Janna', 'Khairunnisa', 'Latifah',
    ],
  },
  indian: {
    surnames: [
      'Kumar', 'Menon', 'Pillai', 'Nair', 'Sharma', 'Krishnan', 'Subramaniam', 'Chandran', 'Rajan', 'Naidu',
      'Rao', 'Iyer', 'Iyengar', 'Aiyar', 'Panicker', 'Varma', 'Kaur', 'Singh', 'Dhillon', 'Gill',
      'Patel', 'Shah', 'Mehta', 'Gupta', 'Jain', 'Agarwal', 'Murthy', 'Reddy', 'Srinivasan', 'Venkatesh',
    ],
    maleFirst: [
      'Rajesh', 'Suresh', 'Vikram', 'Arjun', 'Ravi', 'Deepak', 'Arun', 'Vijay', 'Kumar', 'Anand',
      'Prakash', 'Sanjay', 'Ramesh', 'Ganesh', 'Mohan', 'Krishna', 'Venkat', 'Karthik', 'Ashwin', 'Naveen',
      'Harish', 'Girish', 'Sunil', 'Anil', 'Manoj', 'Vinod', 'Rahul', 'Rohit', 'Amit', 'Ajay',
      'Dinesh', 'Naresh', 'Mahesh', 'Lokesh', 'Rakesh', 'Mukesh', 'Hitesh', 'Nilesh', 'Paresh', 'Jayesh',
      'Aarav', 'Vihaan', 'Aditya', 'Arnav', 'Dhruv', 'Kabir', 'Ishaan', 'Shaurya', 'Atharv', 'Advait',
    ],
    femaleFirst: [
      'Priya', 'Lakshmi', 'Anita', 'Kavitha', 'Meera', 'Sunitha', 'Deepa', 'Vijaya', 'Usha', 'Geetha',
      'Radha', 'Sita', 'Padma', 'Kamala', 'Shanti', 'Devi', 'Rani', 'Parvathi', 'Saraswathi', 'Gayathri',
      'Bhavani', 'Nirmala', 'Revathi', 'Vani', 'Shobha', 'Sudha', 'Vidya', 'Madhavi', 'Jyothi', 'Anusha',
      'Sneha', 'Divya', 'Pooja', 'Shreya', 'Aishwarya', 'Trisha', 'Keerthi', 'Swathi', 'Nandini', 'Harini',
      'Aanya', 'Aaradhya', 'Ananya', 'Diya', 'Ira', 'Kiara', 'Myra', 'Navya', 'Pari', 'Riya',
    ],
  },
  eurasian: {
    surnames: [
      'Pereira', 'Santos', 'Oliveiro', 'Rodrigues', 'Monteiro', 'Fernandez', 'De Souza', 'D\'Silva', 'Gomes', 'Sequeira',
      'Barbosa', 'Carvalho', 'Costa', 'Da Cruz', 'De Mello', 'Dias', 'Fonseca', 'Henriques', 'Lopes', 'Martins',
      'Mendes', 'Noronha', 'Pinto', 'Rego', 'Rozario', 'Saldanha', 'Silva', 'Texeira', 'Vaz', 'Xavier',
    ],
    maleFirst: [
      'David', 'Michael', 'James', 'John', 'Peter', 'Andrew', 'Daniel', 'Matthew', 'Christopher', 'Anthony',
      'Joseph', 'Thomas', 'Charles', 'Steven', 'Kevin', 'Brian', 'George', 'Edward', 'Ronald', 'Timothy',
      'Jason', 'Jeffrey', 'Ryan', 'Jacob', 'Nicholas', 'Jonathan', 'Benjamin', 'Samuel', 'Patrick', 'Lawrence',
      'Marcus', 'Adrian', 'Nathan', 'Justin', 'Brandon', 'Raymond', 'Gregory', 'Joshua', 'Alexander', 'Vincent',
      'Eric', 'Christian', 'Keith', 'Derek', 'Gabriel', 'Ivan', 'Louis', 'Martin', 'Oscar', 'Philip',
    ],
    femaleFirst: [
      'Sarah', 'Emma', 'Rachel', 'Jessica', 'Amanda', 'Michelle', 'Jennifer', 'Elizabeth', 'Catherine', 'Rebecca',
      'Maria', 'Christina', 'Angela', 'Victoria', 'Natalie', 'Stephanie', 'Nicole', 'Lauren', 'Melissa', 'Amy',
      'Emily', 'Samantha', 'Ashley', 'Hannah', 'Olivia', 'Grace', 'Sophia', 'Isabella', 'Mia', 'Charlotte',
      'Amelia', 'Ava', 'Ella', 'Lily', 'Chloe', 'Zoe', 'Madison', 'Evelyn', 'Harper', 'Aria',
      'Scarlett', 'Luna', 'Layla', 'Stella', 'Aurora', 'Violet', 'Hazel', 'Ivy', 'Ruby', 'Alice',
    ],
  },
};

// ============================================
// PERSONALITY POOLS
// ============================================

export const PERSONALITY_TRAITS = {
  positive: [
    'helpful', 'organized', 'friendly', 'diligent', 'honest', 'calm', 'professional', 'reliable',
    'patient', 'kind', 'thoughtful', 'cooperative', 'enthusiastic', 'meticulous', 'punctual', 'cheerful',
  ],
  negative: [
    'nervous', 'secretive', 'impatient', 'disorganized', 'defensive', 'evasive', 'short-tempered', 'aloof',
    'suspicious', 'calculating', 'withdrawn', 'irritable', 'dismissive', 'arrogant', 'careless', 'forgetful',
  ],
  neutral: [
    'quiet', 'observant', 'serious', 'traditional', 'methodical', 'reserved', 'pragmatic', 'formal',
    'analytical', 'focused', 'private', 'independent', 'cautious', 'practical', 'direct', 'structured',
  ],
};

// ============================================
// AGE-OCCUPATION COMPATIBILITY SYSTEM
// ============================================

const AGE_RANGES: Record<AgeCategory, { min: number; max: number }> = {
  child: { min: 7, max: 12 },
  teen: { min: 13, max: 17 },
  young_adult: { min: 18, max: 29 },
  adult: { min: 30, max: 45 },
  middle_aged: { min: 46, max: 60 },
  senior: { min: 61, max: 80 },
};

interface RoleAgeConstraint {
  validAges: AgeCategory[];
  preferredAges: AgeCategory[];
}

/**
 * Get valid age categories for a role
 */
function getRoleAgeConstraints(role: string): RoleAgeConstraint {
  const roleLower = role.toLowerCase();

  // Student roles - children and teens only
  if (/primary student|schoolchild/i.test(role)) {
    return { validAges: ['child'], preferredAges: ['child'] };
  }
  if (/secondary student|student helper|team captain/i.test(role)) {
    return { validAges: ['teen', 'young_adult'], preferredAges: ['teen'] };
  }
  if (/student/i.test(role)) {
    return { validAges: ['teen', 'young_adult'], preferredAges: ['teen'] };
  }

  // Child-specific detection
  if (/child|kid|boy|girl/i.test(role) && !/childcare|children's/i.test(role)) {
    return { validAges: ['child', 'teen'], preferredAges: ['child'] };
  }

  // Intern/Trainee - young adults
  if (/intern|trainee|apprentice/i.test(role)) {
    return { validAges: ['young_adult'], preferredAges: ['young_adult'] };
  }

  // Junior/Assistant roles
  if (/junior|assistant|cashier|waiter/i.test(role)) {
    return { validAges: ['young_adult', 'adult'], preferredAges: ['young_adult'] };
  }

  // Cleaner/Security - adults to senior
  if (/cleaner|security guard|driver/i.test(role)) {
    return { validAges: ['adult', 'middle_aged', 'senior'], preferredAges: ['middle_aged'] };
  }

  // Professional roles
  if (/teacher|librarian|coach|nurse|technician/i.test(role)) {
    return { validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] };
  }

  // Vendor/Owner roles
  if (/vendor|owner|hawker|stall/i.test(role)) {
    return { validAges: ['adult', 'middle_aged', 'senior'], preferredAges: ['middle_aged'] };
  }

  // Management roles
  if (/manager|supervisor/i.test(role)) {
    return { validAges: ['adult', 'middle_aged'], preferredAges: ['adult', 'middle_aged'] };
  }

  // Senior/Executive roles
  if (/senior|head|director|chief|ceo|chairman|principal|professor/i.test(role)) {
    return { validAges: ['middle_aged', 'senior'], preferredAges: ['middle_aged', 'senior'] };
  }

  // Retiree roles
  if (/retiree|retired|elderly|pensioner/i.test(role)) {
    return { validAges: ['senior'], preferredAges: ['senior'] };
  }

  // Default: working adults
  return { validAges: ['young_adult', 'adult', 'middle_aged'], preferredAges: ['adult'] };
}

/**
 * Get a contextually appropriate age for a role
 */
export function getAgeForRole(role: string): {
  ageCategory: AgeCategory;
  ageGroup: 'young' | 'middle' | 'senior';
  specificAge: number;
  displayAge: string;
} {
  const constraints = getRoleAgeConstraints(role);

  // 70% preferred, 30% any valid
  const agePool = Math.random() < 0.7 ? constraints.preferredAges : constraints.validAges;
  const ageCategory = agePool[Math.floor(Math.random() * agePool.length)];
  const range = AGE_RANGES[ageCategory];

  const specificAge = range.min + Math.floor(Math.random() * (range.max - range.min + 1));

  // Map to legacy ageGroup
  let ageGroup: 'young' | 'middle' | 'senior';
  if (ageCategory === 'child' || ageCategory === 'teen' || ageCategory === 'young_adult') {
    ageGroup = 'young';
  } else if (ageCategory === 'adult' || ageCategory === 'middle_aged') {
    ageGroup = 'middle';
  } else {
    ageGroup = 'senior';
  }

  // Generate display string
  let displayAge: string;
  if (ageCategory === 'child') {
    displayAge = `${specificAge} year old child`;
  } else if (ageCategory === 'teen') {
    displayAge = `${specificAge} year old teenager`;
  } else if (specificAge < 30) {
    displayAge = `young adult in their ${Math.floor(specificAge / 10) * 10}s`;
  } else if (specificAge < 60) {
    displayAge = `${Math.floor(specificAge / 10) * 10}s`;
  } else {
    displayAge = `elderly, ${Math.floor(specificAge / 10) * 10}s`;
  }

  return { ageCategory, ageGroup, specificAge, displayAge };
}

// ============================================
// NAME GENERATION FUNCTIONS
// ============================================

/**
 * Generate a unique procedural name
 */
export function generateProceduralName(
  ethnicity: ProceduralCharacter['ethnicity'],
  gender: ProceduralCharacter['gender']
): string {
  const components = NAME_COMPONENTS[ethnicity.toLowerCase() as keyof typeof NAME_COMPONENTS];

  if (ethnicity === 'Chinese') {
    const surname = components.surnames[Math.floor(Math.random() * components.surnames.length)];
    const firstName = gender === 'male'
      ? components.maleFirst[Math.floor(Math.random() * components.maleFirst.length)]
      : components.femaleFirst[Math.floor(Math.random() * components.femaleFirst.length)];
    return `${surname} ${firstName}`;
  }

  if (ethnicity === 'Malay') {
    const firstName = gender === 'male'
      ? components.maleFirst[Math.floor(Math.random() * components.maleFirst.length)]
      : components.femaleFirst[Math.floor(Math.random() * components.femaleFirst.length)];
    const surname = gender === 'male'
      ? components.maleSurnames[Math.floor(Math.random() * components.maleSurnames.length)]
      : components.femaleSurnames[Math.floor(Math.random() * components.femaleSurnames.length)];
    return `${firstName} ${surname}`;
  }

  if (ethnicity === 'Indian') {
    const firstName = gender === 'male'
      ? components.maleFirst[Math.floor(Math.random() * components.maleFirst.length)]
      : components.femaleFirst[Math.floor(Math.random() * components.femaleFirst.length)];
    const surname = components.surnames[Math.floor(Math.random() * components.surnames.length)];
    return `${firstName} ${surname}`;
  }

  if (ethnicity === 'Eurasian') {
    const firstName = gender === 'male'
      ? components.maleFirst[Math.floor(Math.random() * components.maleFirst.length)]
      : components.femaleFirst[Math.floor(Math.random() * components.femaleFirst.length)];
    const surname = components.surnames[Math.floor(Math.random() * components.surnames.length)];
    return `${firstName} ${surname}`;
  }

  return 'Unknown Person';
}

/**
 * Generate random personality traits
 */
export function generatePersonality(isGuilty: boolean = false): string[] {
  const traits: string[] = [];

  // Add positive trait
  traits.push(PERSONALITY_TRAITS.positive[Math.floor(Math.random() * PERSONALITY_TRAITS.positive.length)]);

  // Add neutral trait
  traits.push(PERSONALITY_TRAITS.neutral[Math.floor(Math.random() * PERSONALITY_TRAITS.neutral.length)]);

  // Guilty characters have more negative traits
  if (isGuilty) {
    traits.push(PERSONALITY_TRAITS.negative[Math.floor(Math.random() * PERSONALITY_TRAITS.negative.length)]);
  } else {
    // Innocent might have negative or neutral
    if (Math.random() < 0.3) {
      traits.push(PERSONALITY_TRAITS.negative[Math.floor(Math.random() * PERSONALITY_TRAITS.negative.length)]);
    }
  }

  return traits;
}

/**
 * Generate a complete procedural character with contextually appropriate age
 */
export function generateProceduralCharacter(
  role: string,
  isGuilty: boolean = false
): ProceduralCharacter {
  const ethnicities: ProceduralCharacter['ethnicity'][] = ['Chinese', 'Malay', 'Indian', 'Eurasian'];
  const genders: ProceduralCharacter['gender'][] = ['male', 'female'];

  const ethnicity = ethnicities[Math.floor(Math.random() * ethnicities.length)];
  const gender = genders[Math.floor(Math.random() * genders.length)];

  // Use age-occupation compatibility system for contextually appropriate ages
  const ageInfo = getAgeForRole(role);

  const name = generateProceduralName(ethnicity, gender);
  const personality = generatePersonality(isGuilty);

  return {
    id: `char-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    name,
    ethnicity,
    gender,
    ageGroup: ageInfo.ageGroup,
    ageCategory: ageInfo.ageCategory,
    specificAge: ageInfo.specificAge,
    displayAge: ageInfo.displayAge,
    role,
    personality,
    isGuilty,
  };
}

/**
 * Generate a set of unique characters
 */
export function generateCharacterSet(
  count: number,
  roles: string[]
): ProceduralCharacter[] {
  const characters: ProceduralCharacter[] = [];
  const usedNames = new Set<string>();
  const shuffledRoles = [...roles].sort(() => Math.random() - 0.5);

  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let character: ProceduralCharacter;

    do {
      const role = shuffledRoles[i % shuffledRoles.length];
      character = generateProceduralCharacter(role, false);
      attempts++;
    } while (usedNames.has(character.name) && attempts < 10);

    usedNames.add(character.name);
    characters.push(character);
  }

  return characters;
}

// ============================================
// STATISTICS
// ============================================

export function getNameStatistics() {
  const chinese = NAME_COMPONENTS.chinese;
  const malay = NAME_COMPONENTS.malay;
  const indian = NAME_COMPONENTS.indian;
  const eurasian = NAME_COMPONENTS.eurasian;

  const chineseNames = chinese.surnames.length * (chinese.maleFirst.length + chinese.femaleFirst.length);
  const malayNames = (malay.maleFirst.length * malay.maleSurnames.length) + (malay.femaleFirst.length * malay.femaleSurnames.length);
  const indianNames = indian.surnames.length * (indian.maleFirst.length + indian.femaleFirst.length);
  const eurasianNames = eurasian.surnames.length * (eurasian.maleFirst.length + eurasian.femaleFirst.length);

  const totalUniqueNames = chineseNames + malayNames + indianNames + eurasianNames;

  return {
    chinese: chineseNames,
    malay: malayNames,
    indian: indianNames,
    eurasian: eurasianNames,
    total: totalUniqueNames,
    withPersonality: totalUniqueNames * (16 * 16 * 16), // 3 traits from 16 options each
    withAge: totalUniqueNames * 3,
    fullCharacters: totalUniqueNames * 3 * 48, // age × personality combinations
  };
}

// Output: ~12,000 unique names × 3 ages × 48 personality combos = 1.7+ million unique characters
