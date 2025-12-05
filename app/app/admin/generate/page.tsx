'use client';

import { useState } from 'react';
import { lookupName, getEthnicityInfo, type Ethnicity } from '@/lib/names-database';

type Difficulty = 'ROOKIE' | 'INSPECTOR' | 'DETECTIVE' | 'CHIEF';
type Subject = 'MATH' | 'SCIENCE' | 'INTEGRATED';
type GradeLevel = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6';
type PuzzleComplexity = 'BASIC' | 'STANDARD' | 'CHALLENGING' | 'EXPERT';

interface GeneratedCase {
  caseId: string;
  title: string;
  briefing: string;
  metadata: {
    difficulty: string;
    gradeLevel: string;
    subjectFocus: string;
    estimatedMinutes: number;
    puzzleComplexity?: string;
  };
  story: {
    setting: string;
    crime: string;
    resolution: string;
  };
  suspects: Array<{
    id: string;
    name: string;
    role: string;
    alibi: string;
    isGuilty: boolean;
  }>;
  scenes: Array<{
    id: string;
    name: string;
    description: string;
    locationType?: string;
  }>;
  clues: Array<{
    id: string;
    title: string;
    description: string;
    type: 'physical' | 'document' | 'testimony' | 'digital';
    relevance: 'critical' | 'supporting' | 'red-herring';
  }>;
  puzzles: Array<{
    id: string;
    title: string;
    question: string;
    answer: string;
    points: number;
  }>;
}

interface GeneratedImages {
  cover?: string;
  suspects: Record<string, string>;
  scenes: Record<string, string>;
  clues: Record<string, string>;
}

interface ImageGenProgress {
  current: string;
  completed: number;
  total: number;
}

export default function GenerateCasePage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('INSPECTOR');
  const [subject, setSubject] = useState<Subject>('MATH');
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>('P5');
  const [puzzleComplexity, setPuzzleComplexity] = useState<PuzzleComplexity>('STANDARD');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCase, setGeneratedCase] = useState<GeneratedCase | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedCaseId, setSavedCaseId] = useState<string | null>(null);

  // Image generation state
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImages>({ suspects: {}, scenes: {}, clues: {} });
  const [imageGenProgress, setImageGenProgress] = useState<ImageGenProgress | null>(null);
  const [imageGenError, setImageGenError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedCase(null);
    setSavedCaseId(null);
    // Reset images when generating new case
    setGeneratedImages({ suspects: {}, scenes: {}, clues: {} });
    setImageGenError(null);

    try {
      const response = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          difficulty,
          subject,
          gradeLevel,
          puzzleComplexity,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate case');
      }

      const data = await response.json();
      setGeneratedCase(data.case);
      // Check if image generation is available before auto-starting
      if (data.case) {
        try {
          const healthCheck = await fetch('/api/generate-image');
          const health = await healthCheck.json();
          if (health.status === 'online') {
            generateImagesForCase(data.case);
          } else {
            console.log('[INFO] Image generation unavailable - using placeholders');
            setImageGenError('Image generation unavailable (ComfyUI not connected). Click "Generate Images" when ready.');
          }
        } catch {
          console.log('[INFO] Image generation service not reachable');
          setImageGenError('Image generation unavailable. Run ComfyUI locally and click "Generate Images".');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedCase) return;

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/generate/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case: generatedCase }),
      });

      if (!response.ok) {
        throw new Error('Failed to save case');
      }

      const data = await response.json();
      setSavedCaseId(data.caseId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save case');
    } finally {
      setIsSaving(false);
    }
  };

  // Parse suspect description for age, gender, and religion (Singapore-sensitive)
  const parsePersonInfo = (name: string, role: string): {
    gender: string;
    age: string;
    ageDescriptor: string;
    agePrompt: string;
    religiousAttire: string;
    religion: string | null;
  } => {
    const roleText = role.toLowerCase();

    // Detect gender from name or role
    // FEMALE first names - Singapore context
    const femaleNames = /^(siti|nur|fatimah|aminah|mary|sarah|elizabeth|priya|lakshmi|devi|mei|ling|hui|xin|yan|aishah|zainab|khadijah|hajar|noraini|rosnah|rohani|kavitha|sumathi|mei ling|xiao|jia|ying|emily|amanda|jessica|jennifer|michelle|nicole|rachel|rebecca|susan|karen|lisa|linda|angela|patricia|sandra|nancy|betty|helen|dorothy|anna|grace|chloe|emma|olivia|sophia|mia|ava|isabella|amelia|charlotte|harper|evelyn|abigail|ella|scarlett|lily|hannah|aria|ellie|nora|zoey|riley|victoria|aurora|savannah|penelope|camila|lucy|layla|lillian|stella|hazel|violet|claire|samantha|natalie|julia|madelyn|brooklyn|alyssa|leah|zoe|audrey|maya|aaliyah|elena|gabriella|naomi|alice|sadie|hailey|eva|paisley|genesis|kaylee|caroline|adeline|kennedy|ruby|ivy|ariana|eleanor|athena|faith|melody|autumn|serenity|nevaeh|trinity|peyton|lydia|piper|taylor|madeline|mackenzie|kinsley|maria|anastasia|delilah|elena|everleigh|katherine|alexandra|jade|sarah|diana|valentina|melody|bailey|quinn|london|gianna|sienna|gracie|nadia|brianna|willow|cali|juniper|emilia|jasmine|isabelle|josie|charlie|emery|makayla|payton|brooke|reese|teagan|eden|wren|elliana|margaret|lila|molly|rose|phoebe|daisy|isla|june|freya|paige|kenzie|kimberly|nicole|christine|fiona|heather|diana|vanessa|cindy|tina|crystal|laura|carol|holly|jamie|brittany|kelly|danielle|brenda|pamela|gloria|cynthia|diana|rita|wendy|andrea|monica|sharon|tiffany|anna|marie|carol|joan|janice|julia|denise|anne|judith|frances|louise|phyllis|norma|paula|irene|alice|josephine|helen|margaret|ruth|virginia|judith|janice|jean|alice|frances|carolyn|janet|doris|catherine|maria|nancy|anne|bonnie|cheryl|julie|jacqueline|diane|donna|eve|judith|annie|rosa|sally|beverly|emma|clara|harriet|eva|sue|martha|gladys|agnes|ruby|ann|ellen|florence|jean|alice|marie|lucy|nina|rosa|stella|zelda|violet|vera|daisy|winnie|blossom|ivy|lily|petunia|hazel|pearl|opal|jade|ruby|amber|jasmine|rose|violet|daisy|poppy|flora|willow|ivy|fern|holly|iris|dahlia|lavender|marigold|orchid|tulip|lily|rose|camellia|jasmine|orchid|peony|magnolia|wisteria|begonia|gardenia|lotus|chrysanthemum|aster|azalea|freesia|hibiscus|honeysuckle|hydrangea|snapdragon|sunflower|zinnia|acacia|amaryllis|anemone|bluebell|buttercup|carnation|clover|columbine|cornflower|crocus|daffodil|dandelion|delphinium|erica|foxglove|geranium|gladiolus|heather|hyacinth|jonquil|larkspur|lilac|lupin|mimosa|narcissus|oleander|pansy|periwinkle|petunia|primrose|rhododendron|snowdrop|sweetpea|tansy|verbena|veronica|wallflower|yarrow|zinnia)/i;

    // MALE first names - Singapore context (Chinese, Malay, Indian, Eurasian)
    const maleNames = /^(ahmad|muhammad|ali|hassan|ibrahim|ismail|mohamed|abdul|razak|rahman|yusof|hamid|zainal|aziz|azman|azhar|hafiz|hakim|kamal|rashid|rahim|salleh|osman|omar|idris|jalil|jamal|farid|fauzi|rizal|roslan|rosman|sharif|sulaiman|zulkifli|nasir|naim|raj|kumar|suresh|ramesh|venkat|krishnan|gopal|rajan|chandran|sundaram|bala|subra|thana|velu|arumugam|selvam|murugan|ganesh|prabhu|anand|vijay|arun|siva|shankar|mohan|guru|sunder|ravi|balakrishnan|raghavan|srinivasan|natarajan|muthu|wei|jun|ming|jian|hao|chen|yang|lei|feng|long|tao|bo|kai|liang|fang|yu|zhi|qiang|gang|jie|cheng|peng|lin|xiang|yi|zheng|wen|bin|song|wang|li|zhang|liu|wu|zhou|xu|sun|ma|zhu|hu|guo|he|luo|jia|lin|huang|deng|xie|james|john|michael|david|peter|paul|george|william|richard|thomas|robert|joseph|charles|edward|henry|arthur|albert|frederick|francis|philip|raymond|benjamin|martin|kevin|brian|steven|mark|donald|anthony|gary|larry|jerry|dennis|terry|raymond|eugene|gerald|roger|lawrence|samuel|gregory|patrick|frank|roy|jack|dennis|jerry|harold|carl|henry|arthur|ralph|albert|joe|willie|lawrence|harry|terry|george|bruce|douglas|phillip|randy|russell|wayne|johnny|howard|eugene|walter|henry|arthur|jesse|joshua|nicholas|jeffrey|christopher|timothy|andrew|daniel|matthew|anthony|joshua|ryan|eric|jacob|sean|adam|nathan|zachary|justin|aaron|jose|juan|carlos|luis|miguel|angel|francisco|manuel|antonio|ricardo|fernando|eduardo|mario|sergio|raul|rafael|roberto|enrique|pablo|alejandro|diego|gabriel|hector|jorge|oscar|adrian|ruben|marco|javier|victor|cesar|ivan|arturo|alfredo|andres|gerardo|julio|jesus|alberto|ignacio|ramon|armando|felipe|pedro|ernesto|salvador|gilberto|alejandro|gonzalo|gustavo|guillermo|leonardo|lorenzo|mariano|martin|mauricio|nicolas|orlando|rodrigo|santiago|sebastian|xavier|henry|alfred|bernard|clarence|ernest|harold|herbert|howard|leonard|norman|raymond|stanley|theodore|walter|gordon|gilbert|clifford|lloyd|lester|martin|russell|warren|wallace|harvey|vernon|eugene|cecil|clyde|elmer|milton|chester|leo|victor|morris|luther|marion|max|otis|felix|ellis|irving|leroy|wilbur|homer|emmett|oscar|archie|virgil|alvin|clement|nelson|dewey|levi|sherman|garland|roscoe|forrest|grover|harley|rufus|sylvester|ira|woodrow|lonnie|loyd|mack|cleo|lemuel|percy|maynard|jasper|edmond|ollie|sterling|elbert|hubert|norris|erwin|dudley|millard|orville|merle|odell|alphonso|gus|wendell|isaiah|grady|buford|columbus|cornelius|basil|herschel|horace|aubrey|denver|barney|claud|elijah|ezra|irvin|jonas|lawson|lowell|marcus|moses|noah|reuben|russel|shelby|silas|thurman|ulysses|wilfred|abraham|adolf|alonzo|ambrose|amos|augustus|casper|cleveland|cyrus|emery|ephraim|ezekiel|freeman|gideon|granville|hiram|isaac|isidore|jabez|jehiel|jeremiah|joel|josiah|judson|julius|leonidas|lester|lincoln|lucian|mahlon|malachi|marshall|mathias|matthias|melvin|merrill|micah|milford|mitchell|murray|myron|noel|oliver|parker|perry|phineas|prosper|quincy|randall|reginald|rodney|rollin|sanford|seymour|sigmund|silvester|solomon|spencer|thaddeus|tilden|truman|urban|valentine|vern|wallace|ward|webber|whitney|wiley|wilmer|winfred|zacharias)/i;

    const femaleRoles = /\b(mother|wife|sister|daughter|aunt|grandmother|mrs|ms|miss|woman|lady|girl|waitress|actress|hostess|saleswoman|businesswoman|female|makcik|aunty|kakak|madam|mdm)\b/i;
    const maleRoles = /\b(father|husband|brother|son|uncle|grandfather|mr|man|boy|waiter|actor|host|salesman|businessman|male|pakcik|abang|encik|sir)\b/i;

    let gender = 'person';
    let foundGender = false;

    // PRIORITY 1: Try database lookup (guaranteed accurate for names from our database)
    const dbLookup = lookupName(name);
    if (dbLookup) {
      gender = dbLookup.gender === 'female' ? 'woman' : 'man';
      foundGender = true;
    }

    // PRIORITY 2: Fallback to regex patterns (for legacy names not in database)
    if (!foundGender) {
      // Check ALL parts of name (surname can be first OR last in Singapore)
      const nameParts = name.split(/[\s-]+/); // Split by space or hyphen

      for (const part of nameParts) {
        if (femaleNames.test(part)) {
          gender = 'woman';
          foundGender = true;
          break;
        } else if (maleNames.test(part)) {
          gender = 'man';
          foundGender = true;
          break;
        }
      }
    }

    // PRIORITY 3: Check roles if name detection failed
    if (!foundGender) {
      if (femaleRoles.test(roleText)) {
        gender = 'woman';
      } else if (maleRoles.test(roleText)) {
        gender = 'man';
      } else {
        // Default to man (most common in Singapore workforce)
        gender = 'man';
      }
    }

    // Detect age from role - MORE DETAILED age categories
    // FIRST: Check for explicit numeric ages like "7 years old", "10 year old"
    const explicitAgeMatch = roleText.match(/(\d+)\s*(?:years?\s*old|yr\s*old|yo\b)/i);

    const childRoles = /\b(child|kid|boy|girl|student|pupil|primary school|elementary)\b/i;
    const teenRoles = /\b(teen|teenager|secondary school|high school|youth|young adult|polytechnic|ite|jc|junior college)\b/i;
    const youngAdultRoles = /\b(university|undergraduate|graduate|intern|trainee|fresh graduate|nsf|national service)\b/i;
    const middleAgedRoles = /\b(manager|supervisor|director|executive|professional|experienced)\b/i;
    const elderRoles = /\b(elderly|old|senior|grandfather|grandmother|grandpa|grandma|retired|pakcik|makcik|veteran|retiree)\b/i;

    let age = 'adult';
    let ageDescriptor = '35-45 years old adult';
    let agePrompt = 'middle-aged adult';

    // If explicit age is given, use that first (highest priority)
    if (explicitAgeMatch) {
      const numericAge = parseInt(explicitAgeMatch[1], 10);
      if (numericAge <= 12) {
        age = 'child';
        ageDescriptor = `${numericAge} years old child`;
        agePrompt = `${numericAge} year old child, young child, childlike face, small stature, innocent appearance`;
        gender = gender === 'woman' ? 'girl' : gender === 'man' ? 'boy' : 'young child';
      } else if (numericAge <= 19) {
        age = 'teenager';
        ageDescriptor = `${numericAge} years old teenager`;
        agePrompt = `${numericAge} year old teenager, teenage appearance, adolescent, youthful face`;
        gender = gender === 'woman' ? 'teenage girl' : gender === 'man' ? 'teenage boy' : 'teenager';
      } else if (numericAge <= 30) {
        age = 'young adult';
        ageDescriptor = `${numericAge} years old young adult`;
        agePrompt = `${numericAge} year old young adult, fresh face, energetic appearance`;
      } else if (numericAge <= 55) {
        age = 'middle-aged';
        ageDescriptor = `${numericAge} years old`;
        agePrompt = `${numericAge} year old adult, mature appearance`;
      } else {
        age = 'elderly';
        ageDescriptor = `${numericAge} years old elderly`;
        agePrompt = `${numericAge} year old elderly person, gray hair, wrinkles, wise appearance, aged face`;
        gender = gender === 'woman' ? 'elderly woman' : gender === 'man' ? 'elderly man' : 'elderly person';
      }
    } else if (childRoles.test(roleText)) {
      age = 'child';
      ageDescriptor = '8-12 years old child';
      agePrompt = 'young child, childlike face, small stature, innocent appearance';
      gender = gender === 'woman' ? 'girl' : gender === 'man' ? 'boy' : 'young child';
    } else if (teenRoles.test(roleText)) {
      age = 'teenager';
      ageDescriptor = '14-18 years old teenager';
      agePrompt = 'teenage appearance, adolescent, youthful face';
      gender = gender === 'woman' ? 'teenage girl' : gender === 'man' ? 'teenage boy' : 'teenager';
    } else if (youngAdultRoles.test(roleText)) {
      age = 'young adult';
      ageDescriptor = '20-28 years old young adult';
      agePrompt = 'young adult, fresh face, energetic appearance';
    } else if (middleAgedRoles.test(roleText)) {
      age = 'middle-aged';
      ageDescriptor = '40-55 years old';
      agePrompt = 'middle-aged adult, mature appearance, some wrinkles';
    } else if (elderRoles.test(roleText)) {
      age = 'elderly';
      ageDescriptor = '60-75 years old elderly';
      agePrompt = 'elderly person, gray hair, wrinkles, wise appearance, aged face';
      gender = gender === 'woman' ? 'elderly woman' : gender === 'man' ? 'elderly man' : 'elderly person';
    }

    // IMPORTANT: Religion is ONLY detected if EXPLICITLY mentioned in role
    // Do NOT assume religion from race - this is Singapore-sensitive
    let religion: string | null = null;
    let religiousAttire = '';

    // Muslim - only if explicitly stated
    // CRITICAL: Muslim women MUST wear hijab - this is mandatory, respectful, and non-negotiable
    if (/\b(muslim|islamic|imam|ustaz|ustazah|hajj|haji|hajjah)\b/i.test(roleText)) {
      religion = 'Muslim';
      if (gender === 'woman' || gender === 'girl' || gender === 'elderly woman') {
        // MANDATORY hijab for Muslim women - dignified and respectful portrayal
        religiousAttire = 'wearing elegant hijab headscarf, modest dignified Muslim woman with beautiful hijab, respectful traditional Muslim headscarf covering hair completely, graceful hijab style';
      } else {
        religiousAttire = 'wearing dignified songkok or kopiah cap, respectful Muslim attire';
      }
    }
    // Sikh - only if explicitly stated - respectful portrayal
    else if (/\b(sikh|singh|kaur)\b/i.test(roleText) || /\b(singh|kaur)$/i.test(name)) {
      religion = 'Sikh';
      if (gender === 'man' || gender === 'boy' || gender === 'elderly man') {
        religiousAttire = 'wearing dignified Sikh turban dastar, respectful traditional Sikh attire';
      }
    }
    // Hindu - only if explicitly stated - respectful portrayal
    else if (/\b(hindu|temple priest|pandit)\b/i.test(roleText)) {
      religion = 'Hindu';
      // No specific attire unless temple priest
      if (/\b(priest|pandit)\b/i.test(roleText)) {
        religiousAttire = 'wearing dignified traditional Hindu religious attire, respectful ceremonial dress';
      }
    }
    // Buddhist/Taoist monk - only if explicitly stated - respectful portrayal
    else if (/\b(buddhist monk|taoist priest|monk)\b/i.test(roleText)) {
      religion = 'Buddhist';
      religiousAttire = 'wearing dignified Buddhist monk robes, respectful monastic attire';
    }
    // Christian clergy - only if explicitly stated - respectful portrayal
    else if (/\b(pastor|priest|reverend|father|nun|sister)\b/i.test(roleText)) {
      religion = 'Christian';
      religiousAttire = 'wearing dignified clerical attire, respectful religious vestments';
    }

    return { gender, age, ageDescriptor, agePrompt, religiousAttire, religion };
  };

  // Infer ethnicity from name for Singapore context (CMIO: Chinese, Malay, Indian, Others)
  // IMPORTANT: Race is determined by NAME only, never by religion
  // This respects Singapore's multi-racial, multi-religious society
  const inferEthnicity = (name: string): { ethnicity: string; skinTone: string; features: string; race: string } => {
    // PRIORITY 1: Try database lookup (guaranteed accurate for names from our database)
    const dbLookup = lookupName(name);
    if (dbLookup) {
      const info = getEthnicityInfo(dbLookup.ethnicity);
      return {
        race: info.race,
        ethnicity: info.ethnicity,
        skinTone: info.skinTone,
        features: info.features
      };
    }

    // PRIORITY 2: Fallback to regex patterns (for legacy names not in database)
    // Split name into parts - surname can be FIRST or LAST in Singapore
    const nameParts = name.split(/[\s-]+/);

    // CHINESE surnames - Singapore's largest ethnic group (~74%)
    // Check each part for Chinese surnames (Hokkien, Teochew, Cantonese, Hakka, Hainanese)
    const chineseSurnames = /^(Tan|Lim|Lee|Ng|Wong|Chan|Goh|Ong|Koh|Chua|Chen|Teo|Yeo|Sim|Foo|Ho|Ang|Seah|Tay|Chew|Low|Yap|Wee|Phua|Quek|Chia|Gan|Poh|Soh|Toh|Lau|Leong|Yong|Kwok|Loh|Mok|Lai|Heng|Kang|Khoo|Seet|Chong|Ting|Choo|Chiang|Shen|Liu|Wang|Zhang|Huang|Zhao|Wu|Zhou|Sun|Ma|Zhu|Hu|Guo|He|Lin|Xu|Deng|Feng|Han|Xie|Tang|Cao|Su|Jiang|Lu|Zheng|Pan|Du|Ye|Cheng|Yuan|Dong|Liang|Zhong|Ren|Peng|Zeng|Song|Xia|Fan|Shi|Tian|Kong|Bai|Jin|Mao|Qiu|Xiang|Yan|Dai|Fu|Gu|Guan|Hong|Hou|Hua|Jian|Ke|Lei|Long|Luo|Meng|Ning|Ou|Shan|Shao|Shu|Wan|Wen|Xue|Yang|Yin|Yue|Zhan|Zhuo|Zu)$/i;
    // Chinese given names
    const chineseGivenNames = /^(Mei|Ling|Hui|Xin|Yan|Xiao|Jia|Ying|Wei|Min|Fang|Qing|Yu|Zhi|Jun|Jing|Xuan|Ming|Hao|Chen|Lei|Feng|Long|Tao|Bo|Kai|Liang|Yi|Zheng|Wen|Bin|Song)$/i;

    // MALAY names - Singapore's second largest ethnic group (~13%)
    const malayNames = /^(Ahmad|Muhammad|Siti|Nur|Abdul|Ibrahim|Mohamed|Ismail|Hassan|Ali|Fatimah|Aminah|Razak|Rahman|Yusof|Hamid|Zainal|Zainab|Aishah|Khadijah|Hajar|Noraini|Rosnah|Rohani|Aziz|Azman|Azhar|Hafiz|Hakim|Kamal|Rashid|Rahim|Salleh|Osman|Omar|Idris|Jalil|Jamal|Farid|Fauzi|Rizal|Roslan|Rosman|Sharif|Sulaiman|Zulkifli|Noor|Nordin|Noordin|Nasir|Naim|Hidayah|Huda|Izzah|Fatin|Balqis|Safiah|Maryam|Amin|Amir|Arif|Azmi|Bakar|Dahlan|Daud|Firdaus|Hanif|Haris|Irfan|Iskandar|Kasim|Latif|Malik|Mazlan|Mustafa|Rafiq|Rais|Saiful|Samad|Shamsudin|Syafiq|Tajudin|Usman|Wahid|Yasin|Yazid|Zaidi|Zakaria|Zaki|Zulfikar|Nurul|Ayu|Dewi|Putri|Ratna|Wati|Yanti)$/i;

    // INDIAN names - Singapore's third largest ethnic group (~9%)
    const indianNames = /^(Raj|Kumar|Sharma|Singh|Kaur|Devi|Muthu|Suresh|Ramesh|Lakshmi|Priya|Venkat|Krishnan|Nair|Pillai|Menon|Gopal|Rajan|Chandran|Sundaram|Bala|Subra|Thana|Velu|Arumugam|Selvam|Murugan|Ganesh|Prabhu|Anand|Vijay|Arun|Siva|Shankar|Mohan|Guru|Sunder|Kavitha|Sumathi|Meena|Geetha|Radha|Padma|Malathi|Vani|Jaya|Nalini|Sarala|Kamala|Indira|Deepa|Asha|Ravi|Balakrishnan|Raghavan|Srinivasan|Natarajan|Hari|Iyer|Iyengar|Reddy|Rao|Naidu|Chetty|Chettiar|Nathan|Narayanan|Ramachandran|Ramasamy|Thangaraj|Velayutham|Jayakumar|Manikam|Perumal|Rajendran|Saravanan|Senthil|Sivakumar|Subramaniam|Thirunavukkarasu|Vaithilingam|Veerasamy|Veerapan|Vengadasalam|Maniam|Suppiah|Karuppiah|Krishnamurthy|Letchumanan|Muniandy|Nagarajan|Palaniappan|Ponnusamy|Rajagopal|Rajasekaran|Sakthivel|Selvaraj|Sivalingam|Somasundaram|Thangavelu|Thiagamani|Thiruchelvam|Vadivelu|Valliappan|Vasanthan)$/i;

    // EURASIAN surnames - (~3%) - Portuguese, Dutch-Eurasian, British heritage
    // Also includes common Western/Caucasian surnames for expats and international characters
    const eurasianSurnames = /^(De Souza|Pereira|Rodrigues|Fernandez|Gomes|Braga|Shepherdson|Westerhout|Scully|Clarke|Oliveiro|Tessensohn|Woodford|Aroozoo|Doss|D'Silva|Sta Maria|Monteiro|Sequeira|D'Cruz|Rozario|D'Almeida|Conceicao|Lazaroo|Hendricks|Barker|Kraal|Scheerder|De Witt|Grosse|Meyer|Jansen|Werf|Cornelius|Anthony|Xavier|Sebastian|Vincent|Anderson|Campbell|Davidson|Edwards|Fleming|Gordon|Harris|Jackson|Kennedy|Lambert|Morrison|Nelson|Oliver|Palmer|Reynolds|Sanders|Thompson|Wallace|Warner|Wilson|Peterson|Johnson|Smith|Williams|Brown|Jones|Davis|Miller|Taylor|Thomas|Moore|White|Martin|Garcia|Martinez|Robinson|Clark|Rodriguez|Lewis|Walker|Hall|Allen|Young|King|Wright|Lopez|Hill|Scott|Green|Adams|Baker|Collins|Stewart|Cook|Murphy|Bell|Bailey|Cooper|Howard|Ward|Cox|Richardson|James|Watson|Brooks|Kelly|Price|Bennett|Wood|Barnes|Ross|Henderson|Gray|Grey|Hughes|Cole|Jenkins|Perry|Powell|Long|Patterson|Butler|Simmons|Foster|Gonzales|Bryant|Alexander|Russell|Griffin|Hayes|Diaz|Myers|Ford|Hamilton|Graham|Sullivan|Woods|West|Jordan|Hunt|Owens|Stone|Knight|Webb|Simpson|Stevens|Tucker|Porter|Crawford|Boyd|Mason|Morales|Little|Fowler|Fisher|Freeman|Ferguson|Nichols|Stephens|Weaver|Ryan|Shaw|Harvey|Dixon|Cunningham|Bradley|Lane|Andrews|Harper|Fox|Riley|Armstrong|Carpenter|Warren|Lawson|Perkins|Hawkins|Ellis|McDonald|O'Brien|O'Connor|O'Neill|McCarthy|Murray|Burns|Mcdonald|Roberts|Turner|Phillips|Evans|Parker|Morris|Rogers|Reed|Mitchell|Carter|Campbell|Morgan|Bailey|Stewart|Gonzalez|Sanchez|Rivera|Perez|Torres|Flores|Ramirez|Ortiz|Gomez|Cruz|Mendez|Gutierrez)$/i;

    // Check each part of the name for ethnicity markers
    // Priority: Distinctive surnames first (more reliable than given names)
    for (const part of nameParts) {
      if (chineseSurnames.test(part)) {
        return {
          race: 'Chinese',
          ethnicity: 'Chinese Singaporean',
          skinTone: 'beautiful natural East Asian skin tone ranging from fair to light tan, realistic healthy human skin, dignified appearance',
          features: 'elegant East Asian Chinese facial features, natural dark brown or brown eyes, straight black hair, respectful portrayal'
        };
      }
    }

    for (const part of nameParts) {
      if (malayNames.test(part)) {
        return {
          race: 'Malay',
          ethnicity: 'Malay Singaporean',
          skinTone: 'beautiful natural Southeast Asian Malay skin tone, warm brown complexion, realistic healthy human skin, dignified appearance',
          features: 'elegant Southeast Asian Malay facial features, natural dark brown eyes, black hair, respectful portrayal'
        };
      }
    }

    for (const part of nameParts) {
      if (indianNames.test(part)) {
        return {
          race: 'Indian',
          ethnicity: 'Indian Singaporean',
          // CRITICAL: Indian skin must be BROWN - NOT fair/light
          skinTone: 'dark brown Indian skin, rich brown complexion, deep brown skin tone, South Asian brown skin color, NOT fair skin NOT light skin NOT pale skin, realistic healthy brown human skin, dignified appearance',
          features: 'elegant South Asian Indian facial features, natural dark brown or black eyes, black hair, respectful portrayal'
        };
      }
    }

    for (const part of nameParts) {
      if (eurasianSurnames.test(part)) {
        return {
          race: 'Eurasian',
          ethnicity: 'Eurasian Singaporean',
          skinTone: 'beautiful natural mixed heritage skin tone, olive to light brown complexion, realistic healthy human skin, dignified appearance',
          features: 'elegant mixed Eurasian facial features, natural eye color varies, respectful portrayal'
        };
      }
    }

    // Check Chinese given names last (less distinctive)
    for (const part of nameParts) {
      if (chineseGivenNames.test(part)) {
        return {
          race: 'Chinese',
          ethnicity: 'Chinese Singaporean',
          skinTone: 'beautiful natural East Asian skin tone ranging from fair to light tan, realistic healthy human skin, dignified appearance',
          features: 'elegant East Asian Chinese facial features, natural dark brown or brown eyes, straight black hair, respectful portrayal'
        };
      }
    }

    // Default - don't assume race, use neutral description with respect
    return {
      race: 'Singaporean',
      ethnicity: 'Singaporean',
      skinTone: 'beautiful natural Asian skin tone, realistic healthy human skin, dignified appearance',
      features: 'elegant Asian facial features, natural dark eyes, black hair, respectful portrayal'
    };
  };

  // Generate images for a case (called automatically after case generation)
  const generateImagesForCase = async (caseData: GeneratedCase) => {
    setIsGeneratingImages(true);
    setImageGenError(null);

    const newImages: GeneratedImages = { suspects: {}, scenes: {}, clues: {} };

    // Count total images: cover + suspects + scenes + clues (excluding testimony type)
    const cluesWithImages = (caseData.clues || []).filter(c => c.type !== 'testimony');
    const totalImages = 1 + (caseData.suspects?.length || 0) + (caseData.scenes?.length || 0) + cluesWithImages.length;

    try {
      let completed = 0;

      // 1. Generate cover image
      setImageGenProgress({ current: 'Case Cover', completed, total: totalImages });
      const storyKeywords = caseData.story.setting.split(' ').slice(0, 10).join(' ');
      const coverResponse = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageRequest: {
            id: `cover-${caseData.caseId}`,
            type: 'cover',
            prompt: `score_9, score_8_up, score_7_up, manila case folder file, detective case file, classified document, ${storyKeywords}, ${subject === 'MATH' ? 'mathematical equations' : subject === 'SCIENCE' ? 'scientific equipment' : 'math and science elements'}, mysterious noir atmosphere, dramatic lighting, vintage paper texture, masterpiece, best quality, 8k`,
            negativePrompt: 'score_6, score_5, worst quality, low quality, blurry, text, watermark, people, human',
            width: 512, height: 512,
            settings: { model: 'ponyDiffusionV6XL', sampler: 'euler', steps: 20, cfgScale: 7 },
            metadata: { caseId: caseData.caseId },
          },
          saveToPublic: false,
        }),
      });
      const coverData = await coverResponse.json();
      console.log('[DEBUG] Cover response:', { status: coverResponse.status, success: coverData.success, hasUrl: !!coverData.imageUrl, error: coverData.error });
      if (coverResponse.ok && coverData.success && coverData.imageUrl) {
        newImages.cover = coverData.imageUrl;
        console.log('[DEBUG] Cover image set, length:', coverData.imageUrl.length);
      } else {
        console.error('[DEBUG] Cover generation failed:', coverData);
      }
      completed++;
      setGeneratedImages({ ...newImages });

      // 2. Generate crime scene images
      for (const scene of (caseData.scenes || [])) {
        setImageGenProgress({ current: `Scene: ${scene.name}`, completed, total: totalImages });
        const sceneResponse = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageRequest: {
              id: `scene-${scene.id}`,
              type: 'scene',
              prompt: `score_9, score_8_up, score_7_up, ${scene.description}, ${scene.locationType || 'indoor location'}, Singapore setting, crime scene investigation area, evidence markers visible, forensic lighting, photorealistic, detailed environment, masterpiece, best quality, 8k, architectural photography`,
              negativePrompt: 'score_6, score_5, worst quality, low quality, blurry, text, watermark, people, human figure',
              width: 768, height: 512,
              settings: { model: 'ponyDiffusionV6XL', sampler: 'euler', steps: 20, cfgScale: 7 },
              metadata: { sceneId: scene.id, name: scene.name },
            },
            saveToPublic: false,
          }),
        });
        const sceneData = await sceneResponse.json();
        console.log(`[DEBUG] Scene ${scene.name}:`, { status: sceneResponse.status, success: sceneData.success, hasUrl: !!sceneData.imageUrl, error: sceneData.error });
        if (sceneResponse.ok && sceneData.success && sceneData.imageUrl) {
          newImages.scenes[scene.id] = sceneData.imageUrl;
        }
        completed++;
        setGeneratedImages({ ...newImages });
      }

      // 3. Generate suspect portraits
      for (const suspect of (caseData.suspects || [])) {
        setImageGenProgress({ current: `Suspect: ${suspect.name}`, completed, total: totalImages });
        const ethnicityInfo = inferEthnicity(suspect.name);
        const personInfo = parsePersonInfo(suspect.name, suspect.role);
        const expression = suspect.isGuilty ? 'slightly nervous expression' : 'calm confident expression';

        // Build prompt parts - CRITICAL ORDER: Religious attire FIRST for priority
        const promptParts = [
          // Quality tags for Pony Diffusion
          'score_9, score_8_up, score_7_up',
        ];

        // CRITICAL: Religious attire FIRST (highest priority) if Muslim
        // This ensures hijab is generated for Muslim women
        if (personInfo.religiousAttire && personInfo.religion === 'Muslim') {
          promptParts.push(personInfo.religiousAttire);
        }

        // Force realism with RESPECTFUL, DIGNIFIED portrayal
        promptParts.push(
          'photorealistic', 'realistic', 'real life photo', 'photograph', 'real person',
          'dignified', 'respectful portrayal', 'professional appearance',
          // Person details - GENDER and AGE are CRITICAL
          `1${personInfo.gender}`, 'solo',
          // AGE - VERY IMPORTANT for accurate portrayal
          personInfo.ageDescriptor,
          personInfo.agePrompt
        );

        // RACE - CRITICAL: Must be accurate, respectful, no fantasy colors
        // Emphasize natural realistic skin tone for this specific race with dignity
        promptParts.push(
          `${ethnicityInfo.race} ethnicity`,
          ethnicityInfo.ethnicity,
          // Double-emphasize natural realistic skin color with respect
          ethnicityInfo.skinTone,
          'natural realistic human skin color',
          'accurate ethnic skin tone',
          'beautiful natural complexion',
          ethnicityInfo.features
        );

        // Add other religious attire (non-Muslim)
        if (personInfo.religiousAttire && personInfo.religion !== 'Muslim') {
          promptParts.push(personInfo.religiousAttire);
        }

        // Role context - INCLUDE JOB/OCCUPATION for accurate portrayal
        // Extract occupation keywords from role
        const roleKeywords = suspect.role.toLowerCase();
        let occupationClothing = 'professional business attire';

        // Singapore-relevant occupations with accurate attire
        if (/teacher|educator|professor|lecturer|tutor/i.test(roleKeywords)) {
          occupationClothing = 'teacher wearing professional work attire, formal shirt, neat appearance';
        } else if (/doctor|physician|surgeon/i.test(roleKeywords)) {
          occupationClothing = 'doctor wearing white coat, stethoscope around neck, professional medical attire';
        } else if (/nurse|healthcare|medical staff/i.test(roleKeywords)) {
          occupationClothing = 'nurse wearing medical scrubs, professional healthcare uniform';
        } else if (/engineer|technician|it|programmer|developer/i.test(roleKeywords)) {
          occupationClothing = 'engineer wearing smart casual office attire, polo shirt';
        } else if (/chef|cook|kitchen/i.test(roleKeywords)) {
          occupationClothing = 'chef wearing white double-breasted chef jacket, chef hat, professional kitchen attire';
        } else if (/police|cop|detective|inspector/i.test(roleKeywords)) {
          occupationClothing = 'police officer wearing Singapore Police Force uniform, professional law enforcement attire';
        } else if (/security|guard/i.test(roleKeywords)) {
          occupationClothing = 'security guard wearing security uniform, professional security attire';
        } else if (/student|pupil|school/i.test(roleKeywords)) {
          occupationClothing = 'student wearing neat school uniform, white shirt, tie';
        } else if (/ceo|director|chairman|president/i.test(roleKeywords)) {
          occupationClothing = 'executive wearing expensive formal suit and tie, luxury business attire';
        } else if (/manager|supervisor|executive|business/i.test(roleKeywords)) {
          occupationClothing = 'business professional wearing formal suit and tie, professional office attire';
        } else if (/lawyer|attorney|advocate/i.test(roleKeywords)) {
          occupationClothing = 'lawyer wearing formal black suit, professional legal attire';
        } else if (/accountant|banker|finance/i.test(roleKeywords)) {
          occupationClothing = 'finance professional wearing formal business suit, office attire';
        } else if (/scientist|researcher|lab/i.test(roleKeywords)) {
          occupationClothing = 'scientist wearing white lab coat, safety glasses, professional research attire';
        } else if (/pilot|captain|aviator/i.test(roleKeywords)) {
          occupationClothing = 'pilot wearing airline uniform with captain stripes, professional pilot attire';
        } else if (/flight attendant|cabin crew|steward/i.test(roleKeywords)) {
          occupationClothing = 'cabin crew wearing airline uniform, professional flight attendant attire';
        } else if (/construction|builder|contractor/i.test(roleKeywords)) {
          occupationClothing = 'construction worker wearing safety vest, hard hat, work boots';
        } else if (/worker|labor|factory/i.test(roleKeywords)) {
          occupationClothing = 'worker wearing work clothes, safety vest, practical work attire';
        } else if (/shopkeeper|vendor|seller|merchant|retail/i.test(roleKeywords)) {
          occupationClothing = 'shopkeeper wearing casual work clothes, store apron';
        } else if (/cleaner|janitor|maintenance/i.test(roleKeywords)) {
          occupationClothing = 'cleaner wearing work uniform, practical cleaning attire';
        } else if (/taxi|grab|driver|delivery/i.test(roleKeywords)) {
          occupationClothing = 'driver wearing casual work shirt, comfortable driving attire';
        } else if (/waiter|waitress|server|f&b/i.test(roleKeywords)) {
          occupationClothing = 'waiter wearing restaurant uniform, bow tie, server apron';
        } else if (/barista|coffee|cafe/i.test(roleKeywords)) {
          occupationClothing = 'barista wearing cafe apron, casual work attire';
        } else if (/hawker|food stall|kopitiam/i.test(roleKeywords)) {
          occupationClothing = 'hawker wearing casual clothes, cooking apron, practical food vendor attire';
        } else if (/artist|designer|creative/i.test(roleKeywords)) {
          occupationClothing = 'creative professional wearing trendy casual clothes, artistic attire';
        } else if (/journalist|reporter|media/i.test(roleKeywords)) {
          occupationClothing = 'journalist wearing smart casual office wear, press attire';
        } else if (/athlete|sportsman|coach/i.test(roleKeywords)) {
          occupationClothing = 'athlete wearing sports attire, athletic wear, tracksuit';
        } else if (/farmer|gardener|agriculture/i.test(roleKeywords)) {
          occupationClothing = 'farmer wearing practical outdoor clothes, sun hat, gardening attire';
        } else if (/fisherman|sailor/i.test(roleKeywords)) {
          occupationClothing = 'fisherman wearing practical waterproof clothes, fishing attire';
        } else if (/military|army|soldier|saf/i.test(roleKeywords)) {
          occupationClothing = 'soldier wearing Singapore Armed Forces uniform, military attire';
        } else if (/firefighter|scdf/i.test(roleKeywords)) {
          occupationClothing = 'firefighter wearing fire service uniform, SCDF attire';
        } else if (/paramedic|ambulance|emergency/i.test(roleKeywords)) {
          occupationClothing = 'paramedic wearing emergency medical uniform, ambulance crew attire';
        } else if (/librarian|archivist/i.test(roleKeywords)) {
          occupationClothing = 'librarian wearing smart casual professional attire, glasses';
        } else if (/receptionist|admin|secretary/i.test(roleKeywords)) {
          occupationClothing = 'office staff wearing smart casual office attire, professional appearance';
        } else if (/electrician|plumber|mechanic/i.test(roleKeywords)) {
          occupationClothing = 'tradesman wearing work clothes, tool belt, practical work attire';
        } else if (/postman|mailman|singpost/i.test(roleKeywords)) {
          occupationClothing = 'postman wearing postal uniform, SingPost delivery attire';
        } else if (/housewife|homemaker|stay-at-home/i.test(roleKeywords)) {
          occupationClothing = 'wearing comfortable casual home clothes, neat appearance';
        } else if (/retiree|retired|pensioner/i.test(roleKeywords)) {
          occupationClothing = 'wearing comfortable casual clothes, relaxed neat attire';
        }

        promptParts.push(suspect.role, expression, occupationClothing);

        // Photography style - CRITICAL: FULLY CLOTHED for children's app
        promptParts.push(
          // MANDATORY: Fully clothed - CHILDREN'S APP
          'FULLY CLOTHED', 'wearing complete outfit', 'modest clothing', 'appropriate attire',
          'professional ID photo', 'passport photo style',
          'front facing', 'looking at camera',
          'neutral expression', 'natural pose',
          'soft natural lighting', 'plain white background',
          // Skin realism - CRITICAL
          'natural human skin only', 'realistic skin texture', 'natural skin pores',
          'normal human eyes', 'natural eye color brown or black',
          'NO fantasy colors', 'NO unnatural skin',
          // Technical
          'high resolution', 'sharp focus', 'detailed',
          '35mm photograph', 'natural colors only'
        );

        const portraitPrompt = promptParts.join(', ');

        // ULTRA-strong negative prompt - MUST block ALL fantasy/anime/unnatural elements
        // CRITICAL: Skin color accuracy is NON-NEGOTIABLE for Singapore context
        // CRITICAL: ZERO TOLERANCE FOR NUDITY - THIS IS A CHILDREN'S EDUCATIONAL APP
        const negativePromptParts = [
          // =========================================================
          // ABSOLUTE PRIORITY #1: BLOCK ALL NSFW/NUDITY - CHILDREN'S APP
          // =========================================================
          'NSFW', 'nude', 'naked', 'nudity', 'bare skin', 'exposed skin',
          'topless', 'shirtless', 'no clothes', 'no shirt', 'no pants',
          'underwear', 'lingerie', 'bikini', 'swimsuit', 'bra', 'panties',
          'cleavage', 'breasts', 'chest exposed', 'midriff', 'belly button',
          'revealing clothes', 'skimpy outfit', 'tight clothes', 'low cut',
          'suggestive', 'seductive', 'sexy', 'erotic', 'adult content',
          'inappropriate', 'explicit', 'mature content', 'adult only',
          'bedroom', 'bed scene', 'intimate', 'sensual',
          'skin showing', 'bare shoulders', 'bare legs', 'bare arms',
          'see through', 'transparent clothing', 'wet clothes',
          // =========================================================
          // Quality
          'score_6, score_5, score_4, score_3',
          'worst quality, low quality, blurry, jpeg artifacts',
          // BLOCK ALL FANTASY/ANIME - ABSOLUTELY NO EXCEPTIONS
          'anime, cartoon, comic, manga, illustration, drawing, painting, sketch, rendered, 3d',
          'cgi, digital art, concept art, fan art, deviantart, artstation',
          // BLOCK UNNATURAL EYES
          'glowing eyes, glowing, luminous eyes, bright eyes, shiny eyes',
          'unnatural eyes, fantasy eyes, magical eyes, anime eyes, big eyes, huge eyes',
          'colored eyes, red eyes, yellow eyes, purple eyes, blue eyes, green eyes, orange eyes, pink eyes, white eyes, black sclera',
          'cat eyes, slit pupils, unusual pupils, vertical pupils',
          // BLOCK UNNATURAL SKIN - ABSOLUTE PRIORITY - NO FANTASY COLORS
          'blue skin, green skin, purple skin, red skin, pink skin, orange skin, yellow skin',
          'grey skin, gray skin, silver skin, gold skin, metallic skin',
          'unnatural skin color, fantasy skin color, wrong skin color',
          'alien skin, zombie skin, undead skin, corpse skin, dead skin',
          'glowing skin, luminous skin, shiny skin, reflective skin',
          'plastic skin, waxy skin, doll skin, mannequin skin, artificial skin',
          'painted skin, colored skin, tinted skin, dyed skin',
          // BLOCK WRONG SKIN TONE FOR INDIANS - must be brown not fair
          'fair Indian skin, light Indian skin, pale Indian skin, white Indian',
          // BLOCK NON-HUMAN
          'alien, extraterrestrial, monster, creature, demon, devil, angel',
          'elf, orc, dwarf, goblin, fairy, vampire, werewolf, zombie, ghost, spirit',
          'robot, android, cyborg, mechanical, synthetic',
          'furry, anthropomorphic, animal, animal ears, cat ears, fox ears, dog ears, bunny ears',
          'horns, wings, tail, scales, fur, feathers, claws, fangs',
          // BLOCK DEFORMITIES
          'deformed, disfigured, mutated, ugly, distorted, malformed',
          'bad anatomy, bad proportions, wrong proportions',
          'extra limbs, missing limbs, extra arms, extra legs, extra fingers, fewer fingers, missing fingers',
          'bad hands, bad face, asymmetrical face, crooked face, weird face',
          // BLOCK STYLE ISSUES
          'oversaturated, overexposed, underexposed, high contrast, low contrast',
          'watermark, text, logo, signature, border, frame, username',
          'multiple people, crowd, group, two people, three people',
          // BLOCK DISRESPECTFUL/OFFENSIVE CONTENT - ZERO TOLERANCE
          'caricature, stereotypical, mocking, offensive, disrespectful',
          'ugly portrayal, unflattering, degrading, humiliating',
          'racist, discriminatory, insensitive, inappropriate attire',
          'wrong religious attire, incorrect cultural dress, misrepresented religion',
          'bare head muslim woman, uncovered hair hijabi, missing hijab',
          'wrong turban, incorrect religious symbols, cultural appropriation'
        ];

        // Add religion-specific negative prompts
        if (personInfo.religion !== 'Muslim') {
          // If NOT Muslim, no specific additions needed
        }

        const negativePrompt = negativePromptParts.join(', ');

        const suspectResponse = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageRequest: {
              id: `suspect-${suspect.id}`,
              type: 'suspect',
              prompt: portraitPrompt,
              negativePrompt: negativePrompt,
              width: 512, height: 512,
              // Use lower CFG for more natural results
              settings: { model: 'ponyDiffusionV6XL', sampler: 'euler', steps: 30, cfgScale: 6 },
              metadata: { suspectId: suspect.id, name: suspect.name, gender: personInfo.gender, age: personInfo.age },
            },
            saveToPublic: false,
          }),
        });
        if (suspectResponse.ok) {
          const data = await suspectResponse.json();
          if (data.success && data.imageUrl) newImages.suspects[suspect.id] = data.imageUrl;
        }
        completed++;
        setGeneratedImages({ ...newImages });
      }

      // 4. Generate evidence/clue images (skip testimony type)
      for (const clue of cluesWithImages) {
        setImageGenProgress({ current: `Evidence: ${clue.title}`, completed, total: totalImages });
        const clueResponse = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageRequest: {
              id: `clue-${clue.id}`,
              type: 'evidence',
              prompt: `score_9, score_8_up, score_7_up, ${clue.description}, ${clue.type} evidence, forensic evidence photography, evidence marker visible, close-up documentation shot, ${clue.relevance === 'critical' ? 'key evidence highlighted' : ''}, photorealistic, detailed textures, masterpiece, best quality, 8k, macro photography`,
              negativePrompt: 'score_6, score_5, worst quality, low quality, blurry, text, watermark, people, human hands',
              width: 512, height: 512,
              settings: { model: 'ponyDiffusionV6XL', sampler: 'euler', steps: 20, cfgScale: 7 },
              metadata: { clueId: clue.id, title: clue.title },
            },
            saveToPublic: false,
          }),
        });
        if (clueResponse.ok) {
          const data = await clueResponse.json();
          if (data.success && data.imageUrl) newImages.clues[clue.id] = data.imageUrl;
        }
        completed++;
        setGeneratedImages({ ...newImages });
      }

      setImageGenProgress(null);
    } catch (err) {
      setImageGenError(err instanceof Error ? err.message : 'Image generation failed');
    } finally {
      setIsGeneratingImages(false);
      setImageGenProgress(null);
    }
  };

  // Re-generate images button handler
  const handleGenerateImages = () => {
    if (generatedCase) {
      generateImagesForCase(generatedCase);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-amber-400 font-mono tracking-wider">
            CASE GENERATOR
          </h1>
          <p className="text-slate-400 mt-2">
            Procedurally generate new detective cases
          </p>
        </div>
      </div>

      {/* Generator Form */}
      <div className="bg-black/60 border-2 border-amber-600/50 rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-bold text-amber-400 font-mono">Generation Parameters</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Difficulty */}
          <div>
            <label className="block text-slate-300 font-mono text-sm mb-2">
              DIFFICULTY
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="w-full bg-slate-800 border-2 border-slate-600 rounded px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="ROOKIE">Rookie (P4)</option>
              <option value="INSPECTOR">Inspector (P5)</option>
              <option value="DETECTIVE">Detective (P6)</option>
              <option value="CHIEF">Chief (Advanced)</option>
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-slate-300 font-mono text-sm mb-2">
              SUBJECT
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as Subject)}
              className="w-full bg-slate-800 border-2 border-slate-600 rounded px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="MATH">Mathematics</option>
              <option value="SCIENCE">Science</option>
              <option value="INTEGRATED">Integrated</option>
            </select>
          </div>

          {/* Grade Level */}
          <div>
            <label className="block text-slate-300 font-mono text-sm mb-2">
              GRADE LEVEL
            </label>
            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value as GradeLevel)}
              className="w-full bg-slate-800 border-2 border-slate-600 rounded px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="P1">Primary 1</option>
              <option value="P2">Primary 2</option>
              <option value="P3">Primary 3</option>
              <option value="P4">Primary 4</option>
              <option value="P5">Primary 5</option>
              <option value="P6">Primary 6</option>
            </select>
          </div>

          {/* Puzzle Complexity */}
          <div>
            <label className="block text-slate-300 font-mono text-sm mb-2">
              PUZZLE COMPLEXITY
            </label>
            <select
              value={puzzleComplexity}
              onChange={(e) => setPuzzleComplexity(e.target.value as PuzzleComplexity)}
              className="w-full bg-slate-800 border-2 border-slate-600 rounded px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="BASIC">Basic (P1-P2 level)</option>
              <option value="STANDARD">Standard (P3-P4 level)</option>
              <option value="CHALLENGING">Challenging (P5-P6 level)</option>
              <option value="EXPERT">Advanced (Gifted/Olympiad)</option>
            </select>
            <p className="text-slate-500 text-xs mt-1">
              {puzzleComplexity === 'BASIC' && 'Simple single-step problems for younger students'}
              {puzzleComplexity === 'STANDARD' && 'Multi-step problems requiring reasoning'}
              {puzzleComplexity === 'CHALLENGING' && 'Complex puzzles with data tables and cross-referencing'}
              {puzzleComplexity === 'EXPERT' && 'Advanced puzzles for gifted students - Math Olympiad style'}
            </p>
          </div>

          {/* Estimated Time */}
          <div>
            <label className="block text-slate-300 font-mono text-sm mb-2">
              TIME (auto-calculated)
            </label>
            <div className="w-full bg-slate-800 border-2 border-slate-600 rounded px-4 py-2 text-slate-400">
              {puzzleComplexity === 'BASIC' && '~12-15 min'}
              {puzzleComplexity === 'STANDARD' && '~20-25 min'}
              {puzzleComplexity === 'CHALLENGING' && '~45-60 min'}
              {puzzleComplexity === 'EXPERT' && '~60-90 min'}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex flex-wrap gap-2 md:gap-4">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`px-4 md:px-8 py-2 md:py-3 font-mono font-bold tracking-wider rounded transition-all text-sm md:text-base ${
              isGenerating
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-500 text-black'
            }`}
          >
            {isGenerating ? 'GENERATING...' : 'GENERATE CASE'}
          </button>

          {generatedCase && !savedCaseId && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-4 md:px-8 py-2 md:py-3 font-mono font-bold tracking-wider rounded transition-all text-sm md:text-base ${
                isSaving
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-500 text-white'
              }`}
            >
              {isSaving ? 'SAVING...' : 'SAVE'}
            </button>
          )}

          {savedCaseId && (
            <a
              href={`/admin/cases/${savedCaseId}`}
              className="px-4 md:px-8 py-2 md:py-3 font-mono font-bold tracking-wider rounded bg-blue-600 hover:bg-blue-500 text-white transition-all text-sm md:text-base"
            >
              VIEW SAVED
            </a>
          )}

          {generatedCase && (
            <button
              onClick={handleGenerateImages}
              disabled={isGeneratingImages}
              className={`px-4 md:px-8 py-2 md:py-3 font-mono font-bold tracking-wider rounded transition-all text-sm md:text-base ${
                isGeneratingImages
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-500 text-white'
              }`}
            >
              {isGeneratingImages ? 'IMAGES...' : 'GEN IMAGES'}
            </button>
          )}
        </div>

        {/* Image Generation Progress */}
        {imageGenProgress && (
          <div className="bg-purple-900/30 border border-purple-600 rounded p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-300 font-mono">
                Generating: {imageGenProgress.current}
              </span>
              <span className="text-purple-400 font-mono">
                {imageGenProgress.completed}/{imageGenProgress.total}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(imageGenProgress.completed / imageGenProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {imageGenError && (
          <div className="bg-red-900/50 border border-red-600 rounded p-4 text-red-300">
            Image Error: {imageGenError}
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-600 rounded p-4 text-red-300">
            {error}
          </div>
        )}
      </div>

      {/* Generated Case Preview */}
      {generatedCase && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-amber-400 font-mono tracking-wider">
            GENERATED CASE PREVIEW
          </h2>

          {/* Case Overview */}
          <div className="bg-black/60 border-2 border-slate-600 rounded-lg p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              {/* Cover Image */}
              <div className="flex-shrink-0 flex justify-center md:justify-start">
                {generatedImages.cover ? (
                  <img
                    src={generatedImages.cover}
                    alt="Case Cover"
                    className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg border-2 border-amber-600"
                  />
                ) : (
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-800 rounded-lg border-2 border-slate-600 flex items-center justify-center">
                    <span className="text-slate-500 text-xs font-mono text-center px-2">
                      Click<br/>GENERATE<br/>IMAGES
                    </span>
                  </div>
                )}
              </div>

              {/* Case Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg md:text-xl font-bold text-white mb-4 break-words">{generatedCase.title}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-4 mb-4">
              <div className="text-center p-3 bg-slate-800 rounded">
                <div className="text-amber-400 font-mono text-sm">DIFFICULTY</div>
                <div className="text-white font-bold">{generatedCase.metadata.difficulty}</div>
              </div>
              <div className="text-center p-3 bg-slate-800 rounded">
                <div className="text-amber-400 font-mono text-sm">SUBJECT</div>
                <div className="text-white font-bold">{generatedCase.metadata.subjectFocus}</div>
              </div>
              <div className="text-center p-3 bg-slate-800 rounded">
                <div className="text-amber-400 font-mono text-sm">GRADE</div>
                <div className="text-white font-bold">{generatedCase.metadata.gradeLevel}</div>
              </div>
              <div className="text-center p-3 bg-slate-800 rounded">
                <div className="text-amber-400 font-mono text-sm">COMPLEXITY</div>
                <div className="text-white font-bold">{generatedCase.metadata.puzzleComplexity || puzzleComplexity}</div>
              </div>
              <div className="text-center p-3 bg-slate-800 rounded">
                <div className="text-amber-400 font-mono text-sm">EST. TIME</div>
                <div className="text-white font-bold">{generatedCase.metadata.estimatedMinutes} min</div>
              </div>
                </div>
                <div className="text-slate-300 whitespace-pre-line break-words text-sm md:text-base">{generatedCase.briefing}</div>
              </div>
            </div>
          </div>

          {/* Suspects */}
          <div className="bg-black/60 border-2 border-slate-600 rounded-lg p-6">
            <h3 className="text-xl font-bold text-red-400 font-mono mb-4">SUSPECTS ({generatedCase.suspects.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {generatedCase.suspects.map((suspect) => (
                <div
                  key={suspect.id}
                  className={`p-4 rounded border-2 ${
                    suspect.isGuilty
                      ? 'bg-red-900/30 border-red-600'
                      : 'bg-slate-800 border-slate-600'
                  }`}
                >
                  {/* Suspect Portrait */}
                  <div className="flex gap-3 mb-2">
                    {generatedImages.suspects[suspect.id] ? (
                      <img
                        src={generatedImages.suspects[suspect.id]}
                        alt={suspect.name}
                        className="w-16 h-16 object-cover rounded-lg border border-slate-500"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-slate-700 rounded-lg border border-slate-500 flex items-center justify-center">
                        <span className="text-slate-500 text-2xl">?</span>
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-white">{suspect.name}</div>
                      <div className="text-amber-400 text-sm">{suspect.role}</div>
                      {suspect.isGuilty && (
                        <div className="text-red-400 font-mono text-xs">GUILTY</div>
                      )}
                    </div>
                  </div>
                  <div className="text-slate-400 text-sm">{suspect.alibi}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Scenes / Locations */}
          {generatedCase.scenes && generatedCase.scenes.length > 0 && (
            <div className="bg-black/60 border-2 border-slate-600 rounded-lg p-6">
              <h3 className="text-xl font-bold text-green-400 font-mono mb-4">CRIME SCENES ({generatedCase.scenes.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedCase.scenes.map((scene) => (
                  <div key={scene.id} className="p-4 bg-slate-800 rounded border border-slate-600">
                    <div className="flex gap-4">
                      {generatedImages.scenes[scene.id] ? (
                        <img
                          src={generatedImages.scenes[scene.id]}
                          alt={scene.name}
                          className="w-32 h-24 object-cover rounded border border-slate-500 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-32 h-24 bg-slate-700 rounded border border-slate-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-slate-500 text-xs text-center">No image</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-bold text-white">{scene.name}</div>
                        {scene.locationType && (
                          <div className="text-green-400 text-sm font-mono">{scene.locationType}</div>
                        )}
                        <div className="text-slate-400 text-sm mt-1">{scene.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clues / Evidence */}
          {generatedCase.clues && generatedCase.clues.length > 0 && (
            <div className="bg-black/60 border-2 border-slate-600 rounded-lg p-6">
              <h3 className="text-xl font-bold text-cyan-400 font-mono mb-4">EVIDENCE ({generatedCase.clues.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedCase.clues.map((clue) => (
                  <div
                    key={clue.id}
                    className={`p-4 rounded border-2 ${
                      clue.relevance === 'critical'
                        ? 'bg-amber-900/30 border-amber-600'
                        : clue.relevance === 'red-herring'
                        ? 'bg-red-900/20 border-red-600/50'
                        : 'bg-slate-800 border-slate-600'
                    }`}
                  >
                    <div className="flex gap-3">
                      {clue.type !== 'testimony' && generatedImages.clues[clue.id] ? (
                        <img
                          src={generatedImages.clues[clue.id]}
                          alt={clue.title}
                          className="w-16 h-16 object-cover rounded border border-slate-500 flex-shrink-0"
                        />
                      ) : clue.type !== 'testimony' ? (
                        <div className="w-16 h-16 bg-slate-700 rounded border border-slate-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-slate-500 text-xs">?</span>
                        </div>
                      ) : null}
                      <div className="flex-1">
                        <div className="font-bold text-white text-sm">{clue.title}</div>
                        <div className="flex gap-2 mt-1">
                          <span className={`text-xs font-mono px-1 rounded ${
                            clue.type === 'physical' ? 'bg-blue-800 text-blue-200' :
                            clue.type === 'document' ? 'bg-yellow-800 text-yellow-200' :
                            clue.type === 'testimony' ? 'bg-purple-800 text-purple-200' :
                            'bg-green-800 text-green-200'
                          }`}>
                            {clue.type}
                          </span>
                          <span className={`text-xs font-mono px-1 rounded ${
                            clue.relevance === 'critical' ? 'bg-amber-700 text-amber-100' :
                            clue.relevance === 'red-herring' ? 'bg-red-700 text-red-100' :
                            'bg-slate-600 text-slate-200'
                          }`}>
                            {clue.relevance}
                          </span>
                        </div>
                        <div className="text-slate-400 text-xs mt-1 line-clamp-2">{clue.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Puzzles */}
          <div className="bg-black/60 border-2 border-slate-600 rounded-lg p-6">
            <h3 className="text-xl font-bold text-blue-400 font-mono mb-4">PUZZLES ({generatedCase.puzzles.length})</h3>
            <div className="space-y-4">
              {generatedCase.puzzles.map((puzzle, index) => (
                <div key={puzzle.id} className="p-4 bg-slate-800 rounded border border-slate-600">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-white">
                        {index + 1}. {puzzle.title}
                      </div>
                      <div className="text-slate-300 mt-2">{puzzle.question}</div>
                      <div className="text-green-400 text-sm mt-2">
                        Answer: {puzzle.answer}
                      </div>
                    </div>
                    <div className="text-amber-400 font-mono">{puzzle.points} pts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Story Details */}
          <div className="bg-black/60 border-2 border-slate-600 rounded-lg p-6">
            <h3 className="text-xl font-bold text-purple-400 font-mono mb-4">STORY DETAILS</h3>
            <div className="space-y-4 text-slate-300">
              <div>
                <span className="text-purple-400 font-mono">SETTING:</span>
                <p className="mt-1">{generatedCase.story.setting}</p>
              </div>
              <div>
                <span className="text-purple-400 font-mono">CRIME:</span>
                <p className="mt-1">{generatedCase.story.crime}</p>
              </div>
              <div>
                <span className="text-purple-400 font-mono">RESOLUTION:</span>
                <p className="mt-1">{generatedCase.story.resolution}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
