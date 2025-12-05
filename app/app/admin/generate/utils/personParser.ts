/**
 * Person parsing utilities for suspect image generation
 * Handles gender detection, age parsing, and religious attire
 */

import { lookupName, getEthnicityInfo } from '@/lib/names-database';
import type { PersonInfo, EthnicityInfo } from './types';

// FEMALE first names - Singapore context
const FEMALE_NAMES = /^(siti|nur|fatimah|aminah|mary|sarah|elizabeth|priya|lakshmi|devi|mei|ling|hui|xin|yan|aishah|zainab|khadijah|hajar|noraini|rosnah|rohani|kavitha|sumathi|mei ling|xiao|jia|ying|emily|amanda|jessica|jennifer|michelle|nicole|rachel|rebecca|susan|karen|lisa|linda|angela|patricia|sandra|nancy|betty|helen|dorothy|anna|grace|chloe|emma|olivia|sophia|mia|ava|isabella|amelia|charlotte|harper|evelyn|abigail|ella|scarlett|lily|hannah|aria|ellie|nora|zoey|riley|victoria|aurora|savannah|penelope|camila|lucy|layla|lillian|stella|hazel|violet|claire|samantha|natalie|julia|madelyn|brooklyn|alyssa|leah|zoe|audrey|maya|aaliyah|elena|gabriella|naomi|alice|sadie|hailey|eva|paisley|genesis|kaylee|caroline|adeline|kennedy|ruby|ivy|ariana|eleanor|athena|faith|melody|autumn|serenity|nevaeh|trinity|peyton|lydia|piper|taylor|madeline|mackenzie|kinsley|maria|anastasia|delilah|elena|everleigh|katherine|alexandra|jade|sarah|diana|valentina|melody|bailey|quinn|london|gianna|sienna|gracie|nadia|brianna|willow|cali|juniper|emilia|jasmine|isabelle|josie|charlie|emery|makayla|payton|brooke|reese|teagan|eden|wren|elliana|margaret|lila|molly|rose|phoebe|daisy|isla|june|freya|paige|kenzie|kimberly|nicole|christine|fiona|heather|diana|vanessa|cindy|tina|crystal|laura|carol|holly|jamie|brittany|kelly|danielle|brenda|pamela|gloria|cynthia|diana|rita|wendy|andrea|monica|sharon|tiffany|anna|marie|carol|joan|janice|julia|denise|anne|judith|frances|louise|phyllis|norma|paula|irene|alice|josephine|helen|margaret|ruth|virginia|judith|janice|jean|alice|frances|carolyn|janet|doris|catherine|maria|nancy|anne|bonnie|cheryl|julie|jacqueline|diane|donna|eve|judith|annie|rosa|sally|beverly|emma|clara|harriet|eva|sue|martha|gladys|agnes|ruby|ann|ellen|florence|jean|alice|marie|lucy|nina|rosa|stella|zelda|violet|vera|daisy|winnie|blossom|ivy|lily|petunia|hazel|pearl|opal|jade|ruby|amber|jasmine|rose|violet|daisy|poppy|flora|willow|ivy|fern|holly|iris|dahlia|lavender|marigold|orchid|tulip|lily|rose|camellia|jasmine|orchid|peony|magnolia|wisteria|begonia|gardenia|lotus|chrysanthemum|aster|azalea|freesia|hibiscus|honeysuckle|hydrangea|snapdragon|sunflower|zinnia|acacia|amaryllis|anemone|bluebell|buttercup|carnation|clover|columbine|cornflower|crocus|daffodil|dandelion|delphinium|erica|foxglove|geranium|gladiolus|heather|hyacinth|jonquil|larkspur|lilac|lupin|mimosa|narcissus|oleander|pansy|periwinkle|petunia|primrose|rhododendron|snowdrop|sweetpea|tansy|verbena|veronica|wallflower|yarrow|zinnia)/i;

// MALE first names - Singapore context (Hokkien/Teochew names added)
const MALE_NAMES = /^(ahmad|muhammad|ali|hassan|ibrahim|ismail|mohamed|abdul|razak|rahman|yusof|hamid|zainal|aziz|azman|azhar|hafiz|hakim|kamal|rashid|rahim|salleh|osman|omar|idris|jalil|jamal|farid|fauzi|rizal|roslan|rosman|sharif|sulaiman|zulkifli|nasir|naim|raj|kumar|suresh|ramesh|venkat|krishnan|gopal|rajan|chandran|sundaram|bala|subra|thana|velu|arumugam|selvam|murugan|ganesh|prabhu|anand|vijay|arun|siva|shankar|mohan|guru|sunder|ravi|balakrishnan|raghavan|srinivasan|natarajan|muthu|wei|jun|ming|jian|hao|chen|yang|lei|feng|long|tao|bo|kai|liang|fang|yu|zhi|qiang|gang|jie|cheng|peng|lin|xiang|yi|zheng|wen|bin|song|wang|li|zhang|liu|wu|zhou|xu|sun|ma|zhu|hu|guo|he|luo|jia|lin|huang|deng|xie|seng|keng|boon|kok|wee|huat|teck|kow|beng|leong|kiat|soon|hock|hong|ah|chee|swee|eng|tong|yew|san|fook|meng|siong|cheong|keong|chai|hua|kwang|kian|yong|tek|kong|choon|kim|kiong|james|john|michael|david|peter|paul|george|william|richard|thomas|robert|joseph|charles|edward|henry|arthur|albert|frederick|francis|philip|raymond|benjamin|martin|kevin|brian|steven|mark|donald|anthony|gary|larry|jerry|dennis|terry|raymond|eugene|gerald|roger|lawrence|samuel|gregory|patrick|frank|roy|jack|dennis|jerry|harold|carl|henry|arthur|ralph|albert|joe|willie|lawrence|harry|terry|george|bruce|douglas|phillip|randy|russell|wayne|johnny|howard|eugene|walter|henry|arthur|jesse|joshua|nicholas|jeffrey|christopher|timothy|andrew|daniel|matthew|anthony|joshua|ryan|eric|jacob|sean|adam|nathan|zachary|justin|aaron|jose|juan|carlos|luis|miguel|angel|francisco|manuel|antonio|ricardo|fernando|eduardo|mario|sergio|raul|rafael|roberto|enrique|pablo|alejandro|diego|gabriel|hector|jorge|oscar|adrian|ruben|marco|javier|victor|cesar|ivan|arturo|alfredo|andres|gerardo|julio|jesus|alberto|ignacio|ramon|armando|felipe|pedro|ernesto|salvador|gilberto|alejandro|gonzalo|gustavo|guillermo|leonardo|lorenzo|mariano|martin|mauricio|nicolas|orlando|rodrigo|santiago|sebastian|xavier|henry|alfred|bernard|clarence|ernest|harold|herbert|howard|leonard|norman|raymond|stanley|theodore|walter|gordon|gilbert|clifford|lloyd|lester|martin|russell|warren|wallace|harvey|vernon|eugene|cecil|clyde|elmer|milton|chester|leo|victor|morris|luther|marion|max|otis|felix|ellis|irving|leroy|wilbur|homer|emmett|oscar|archie|virgil|alvin|clement|nelson|dewey|levi|sherman|garland|roscoe|forrest|grover|harley|rufus|sylvester|ira|woodrow|lonnie|loyd|mack|cleo|lemuel|percy|maynard|jasper|edmond|ollie|sterling|elbert|hubert|norris|erwin|dudley|millard|orville|merle|odell|alphonso|gus|wendell|isaiah|grady|buford|columbus|cornelius|basil|herschel|horace|aubrey|denver|barney|claud|elijah|ezra|irvin|jonas|lawson|lowell|marcus|moses|noah|reuben|russel|shelby|silas|thurman|ulysses|wilfred|abraham|adolf|alonzo|ambrose|amos|augustus|casper|cleveland|cyrus|emery|ephraim|ezekiel|freeman|gideon|granville|hiram|isaac|isidore|jabez|jehiel|jeremiah|joel|josiah|judson|julius|leonidas|lester|lincoln|lucian|mahlon|malachi|marshall|mathias|matthias|melvin|merrill|micah|milford|mitchell|murray|myron|noel|oliver|parker|perry|phineas|prosper|quincy|randall|reginald|rodney|rollin|sanford|seymour|sigmund|silvester|solomon|spencer|thaddeus|tilden|truman|urban|valentine|vern|wallace|ward|webber|whitney|wiley|wilmer|winfred|zacharias)/i;

const FEMALE_ROLES = /\b(mother|wife|sister|daughter|aunt|grandmother|mrs|ms|miss|woman|lady|girl|waitress|actress|hostess|saleswoman|businesswoman|female|makcik|aunty|kakak|madam|mdm)\b/i;
const MALE_ROLES = /\b(father|husband|brother|son|uncle|grandfather|mr|man|boy|waiter|actor|host|salesman|businessman|male|pakcik|abang|encik|sir)\b/i;

// Age detection patterns
const CHILD_ROLES = /\b(child|kid|boy|girl|student|pupil|primary school|elementary)\b/i;
const TEEN_ROLES = /\b(teen|teenager|secondary school|high school|youth|young adult|polytechnic|ite|jc|junior college)\b/i;
const YOUNG_ADULT_ROLES = /\b(university|undergraduate|graduate|intern|trainee|fresh graduate|nsf|national service)\b/i;
const MIDDLE_AGED_ROLES = /\b(manager|supervisor|director|executive|professional|experienced)\b/i;
const ELDER_ROLES = /\b(elderly|old|senior|grandfather|grandmother|grandpa|grandma|retired|pakcik|makcik|veteran|retiree)\b/i;

/**
 * Parse suspect description for age, gender, and religion (Singapore-sensitive)
 */
export function parsePersonInfo(name: string, role: string): PersonInfo {
  const roleText = role.toLowerCase();

  let gender = 'person';
  let foundGender = false;

  // PRIORITY 1: Try database lookup
  const dbLookup = lookupName(name);
  if (dbLookup) {
    gender = dbLookup.gender === 'female' ? 'woman' : 'man';
    foundGender = true;
  }

  // PRIORITY 2: Fallback to regex patterns (check MALE first to avoid bias)
  if (!foundGender) {
    const nameParts = name.split(/[\s-]+/);
    for (const part of nameParts) {
      // Check MALE first - Singapore workforce skews male
      if (MALE_NAMES.test(part)) {
        gender = 'man';
        foundGender = true;
        break;
      } else if (FEMALE_NAMES.test(part)) {
        gender = 'woman';
        foundGender = true;
        break;
      }
    }
  }

  // PRIORITY 3: Check roles
  if (!foundGender) {
    if (FEMALE_ROLES.test(roleText)) {
      gender = 'woman';
    } else if (MALE_ROLES.test(roleText)) {
      gender = 'man';
    } else {
      gender = 'man'; // Default
    }
  }

  // Detect age
  const explicitAgeMatch = roleText.match(/(\d+)\s*(?:years?\s*old|yr\s*old|yo\b)/i);

  let age = 'adult';
  let ageDescriptor = '35-45 years old adult';
  let agePrompt = 'middle-aged adult';

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
  } else if (CHILD_ROLES.test(roleText)) {
    age = 'child';
    ageDescriptor = '8-12 years old child';
    agePrompt = 'young child, childlike face, small stature, innocent appearance';
    gender = gender === 'woman' ? 'girl' : gender === 'man' ? 'boy' : 'young child';
  } else if (TEEN_ROLES.test(roleText)) {
    age = 'teenager';
    ageDescriptor = '14-18 years old teenager';
    agePrompt = 'teenage appearance, adolescent, youthful face';
    gender = gender === 'woman' ? 'teenage girl' : gender === 'man' ? 'teenage boy' : 'teenager';
  } else if (YOUNG_ADULT_ROLES.test(roleText)) {
    age = 'young adult';
    ageDescriptor = '20-28 years old young adult';
    agePrompt = 'young adult, fresh face, energetic appearance';
  } else if (MIDDLE_AGED_ROLES.test(roleText)) {
    age = 'middle-aged';
    ageDescriptor = '40-55 years old';
    agePrompt = 'middle-aged adult, mature appearance, some wrinkles';
  } else if (ELDER_ROLES.test(roleText)) {
    age = 'elderly';
    ageDescriptor = '60-75 years old elderly';
    agePrompt = 'elderly person, gray hair, wrinkles, wise appearance, aged face';
    gender = gender === 'woman' ? 'elderly woman' : gender === 'man' ? 'elderly man' : 'elderly person';
  }

  // Religion detection - ONLY if explicitly mentioned
  let religion: string | null = null;
  let religiousAttire = '';

  if (/\b(muslim|islamic|imam|ustaz|ustazah|hajj|haji|hajjah)\b/i.test(roleText)) {
    religion = 'Muslim';
    if (gender === 'woman' || gender === 'girl' || gender === 'elderly woman') {
      religiousAttire = 'wearing elegant hijab headscarf, modest dignified Muslim woman with beautiful hijab, respectful traditional Muslim headscarf covering hair completely, graceful hijab style';
    } else {
      religiousAttire = 'wearing dignified songkok or kopiah cap, respectful Muslim attire';
    }
  } else if (/\b(sikh|singh|kaur)\b/i.test(roleText) || /\b(singh|kaur)$/i.test(name)) {
    religion = 'Sikh';
    if (gender === 'man' || gender === 'boy' || gender === 'elderly man') {
      religiousAttire = 'wearing dignified Sikh turban dastar, respectful traditional Sikh attire';
    }
  } else if (/\b(hindu|temple priest|pandit)\b/i.test(roleText)) {
    religion = 'Hindu';
    if (/\b(priest|pandit)\b/i.test(roleText)) {
      religiousAttire = 'wearing dignified traditional Hindu religious attire, respectful ceremonial dress';
    }
  } else if (/\b(buddhist monk|taoist priest|monk)\b/i.test(roleText)) {
    religion = 'Buddhist';
    religiousAttire = 'wearing dignified Buddhist monk robes, respectful monastic attire';
  } else if (/\b(pastor|priest|reverend|father|nun|sister)\b/i.test(roleText)) {
    religion = 'Christian';
    religiousAttire = 'wearing dignified clerical attire, respectful religious vestments';
  }

  return { gender, age, ageDescriptor, agePrompt, religiousAttire, religion };
}

// Ethnicity detection patterns
const CHINESE_SURNAMES = /^(Tan|Lim|Lee|Ng|Wong|Chan|Goh|Ong|Koh|Chua|Chen|Teo|Yeo|Sim|Foo|Ho|Ang|Seah|Tay|Chew|Low|Yap|Wee|Phua|Quek|Chia|Gan|Poh|Soh|Toh|Lau|Leong|Yong|Kwok|Loh|Mok|Lai|Heng|Kang|Khoo|Seet|Chong|Ting|Choo|Chiang|Shen|Liu|Wang|Zhang|Huang|Zhao|Wu|Zhou|Sun|Ma|Zhu|Hu|Guo|He|Lin|Xu|Deng|Feng|Han|Xie|Tang|Cao|Su|Jiang|Lu|Zheng|Pan|Du|Ye|Cheng|Yuan|Dong|Liang|Zhong|Ren|Peng|Zeng|Song|Xia|Fan|Shi|Tian|Kong|Bai|Jin|Mao|Qiu|Xiang|Yan|Dai|Fu|Gu|Guan|Hong|Hou|Hua|Jian|Ke|Lei|Long|Luo|Meng|Ning|Ou|Shan|Shao|Shu|Wan|Wen|Xue|Yang|Yin|Yue|Zhan|Zhuo|Zu)$/i;
const CHINESE_GIVEN_NAMES = /^(Mei|Ling|Hui|Xin|Yan|Xiao|Jia|Ying|Wei|Min|Fang|Qing|Yu|Zhi|Jun|Jing|Xuan|Ming|Hao|Chen|Lei|Feng|Long|Tao|Bo|Kai|Liang|Yi|Zheng|Wen|Bin|Song)$/i;
const MALAY_NAMES = /^(Ahmad|Muhammad|Siti|Nur|Abdul|Ibrahim|Mohamed|Ismail|Hassan|Ali|Fatimah|Aminah|Razak|Rahman|Yusof|Hamid|Zainal|Zainab|Aishah|Khadijah|Hajar|Noraini|Rosnah|Rohani|Aziz|Azman|Azhar|Hafiz|Hakim|Kamal|Rashid|Rahim|Salleh|Osman|Omar|Idris|Jalil|Jamal|Farid|Fauzi|Rizal|Roslan|Rosman|Sharif|Sulaiman|Zulkifli|Noor|Noordin|Nasir|Naim|Hidayah|Huda|Izzah|Fatin|Balqis|Safiah|Maryam|Amin|Amir|Arif|Azmi|Bakar|Dahlan|Daud|Firdaus|Hanif|Haris|Irfan|Iskandar|Kasim|Latif|Malik|Mazlan|Mustafa|Rafiq|Rais|Saiful|Samad|Shamsudin|Syafiq|Tajudin|Usman|Wahid|Yasin|Yazid|Zaidi|Zakaria|Zaki|Zulfikar|Nurul|Ayu|Dewi|Putri|Ratna|Wati|Yanti)$/i;
const INDIAN_NAMES = /^(Raj|Kumar|Sharma|Singh|Kaur|Devi|Muthu|Suresh|Ramesh|Lakshmi|Priya|Venkat|Krishnan|Nair|Pillai|Menon|Gopal|Rajan|Chandran|Sundaram|Bala|Subra|Thana|Velu|Arumugam|Selvam|Murugan|Ganesh|Prabhu|Anand|Vijay|Arun|Siva|Shankar|Mohan|Guru|Sunder|Kavitha|Sumathi|Meena|Geetha|Radha|Padma|Malathi|Vani|Jaya|Nalini|Sarala|Kamala|Indira|Deepa|Asha|Ravi|Balakrishnan|Raghavan|Srinivasan|Natarajan|Hari|Iyer|Iyengar|Reddy|Rao|Naidu|Chetty|Chettiar|Nathan|Narayanan|Ramachandran|Ramasamy|Thangaraj|Velayutham|Jayakumar|Manikam|Perumal|Rajendran|Saravanan|Senthil|Sivakumar|Subramaniam|Thirunavukkarasu|Vaithilingam|Veerasamy|Veerapan|Vengadasalam|Maniam|Suppiah|Karuppiah|Krishnamurthy|Letchumanan|Muniandy|Nagarajan|Palaniappan|Ponnusamy|Rajagopal|Rajasekaran|Sakthivel|Selvaraj|Sivalingam|Somasundaram|Thangavelu|Thiagamani|Thiruchelvam|Vadivelu|Valliappan|Vasanthan)$/i;
const EURASIAN_SURNAMES = /^(De Souza|Pereira|Rodrigues|Fernandez|Gomes|Braga|Shepherdson|Westerhout|Scully|Clarke|Oliveiro|Tessensohn|Woodford|Aroozoo|Doss|D'Silva|Sta Maria|Monteiro|Sequeira|D'Cruz|Rozario|D'Almeida|Conceicao|Lazaroo|Hendricks|Barker|Kraal|Scheerder|De Witt|Grosse|Meyer|Jansen|Werf|Cornelius|Anthony|Xavier|Sebastian|Vincent|Anderson|Campbell|Davidson|Edwards|Fleming|Gordon|Harris|Jackson|Kennedy|Lambert|Morrison|Nelson|Oliver|Palmer|Reynolds|Sanders|Thompson|Wallace|Warner|Wilson|Peterson|Johnson|Smith|Williams|Brown|Jones|Davis|Miller|Taylor|Thomas|Moore|White|Martin|Garcia|Martinez|Robinson|Clark|Rodriguez|Lewis|Walker|Hall|Allen|Young|King|Wright|Lopez|Hill|Scott|Green|Adams|Baker|Collins|Stewart|Cook|Murphy|Bell|Bailey|Cooper|Howard|Ward|Cox|Richardson|James|Watson|Brooks|Kelly|Price|Bennett|Wood|Barnes|Ross|Henderson|Gray|Grey|Hughes|Cole|Jenkins|Perry|Powell|Long|Patterson|Butler|Simmons|Foster|Gonzales|Bryant|Alexander|Russell|Griffin|Hayes|Diaz|Myers|Ford|Hamilton|Graham|Sullivan|Woods|West|Jordan|Hunt|Owens|Stone|Knight|Webb|Simpson|Stevens|Tucker|Porter|Crawford|Boyd|Mason|Morales|Little|Fowler|Fisher|Freeman|Ferguson|Nichols|Stephens|Weaver|Ryan|Shaw|Harvey|Dixon|Cunningham|Bradley|Lane|Andrews|Harper|Fox|Riley|Armstrong|Carpenter|Warren|Lawson|Perkins|Hawkins|Ellis|McDonald|O'Brien|O'Connor|O'Neill|McCarthy|Murray|Burns|Mcdonald|Roberts|Turner|Phillips|Evans|Parker|Morris|Rogers|Reed|Mitchell|Carter|Campbell|Morgan|Bailey|Stewart|Gonzalez|Sanchez|Rivera|Perez|Torres|Flores|Ramirez|Ortiz|Gomez|Cruz|Mendez|Gutierrez)$/i;

/**
 * Infer ethnicity from name for Singapore context (CMIO)
 */
export function inferEthnicity(name: string): EthnicityInfo {
  // PRIORITY 1: Database lookup
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

  // PRIORITY 2: Regex patterns
  const nameParts = name.split(/[\s-]+/);

  for (const part of nameParts) {
    if (CHINESE_SURNAMES.test(part)) {
      return {
        race: 'Chinese',
        ethnicity: 'Chinese Singaporean',
        skinTone: 'beautiful natural East Asian skin tone ranging from fair to light tan, realistic healthy human skin, dignified appearance',
        features: 'elegant East Asian Chinese facial features, natural dark brown or brown eyes, straight black hair, respectful portrayal'
      };
    }
  }

  for (const part of nameParts) {
    if (MALAY_NAMES.test(part)) {
      return {
        race: 'Malay',
        ethnicity: 'Malay Singaporean',
        skinTone: 'beautiful natural Southeast Asian Malay skin tone, warm brown complexion, realistic healthy human skin, dignified appearance',
        features: 'elegant Southeast Asian Malay facial features, natural dark brown eyes, black hair, respectful portrayal'
      };
    }
  }

  for (const part of nameParts) {
    if (INDIAN_NAMES.test(part)) {
      return {
        race: 'Indian',
        ethnicity: 'Indian Singaporean',
        skinTone: 'dark brown Indian skin, rich brown complexion, deep brown skin tone, South Asian brown skin color, NOT fair skin NOT light skin NOT pale skin, realistic healthy brown human skin, dignified appearance',
        features: 'elegant South Asian Indian facial features, natural dark brown or black eyes, black hair, respectful portrayal'
      };
    }
  }

  for (const part of nameParts) {
    if (EURASIAN_SURNAMES.test(part)) {
      return {
        race: 'Eurasian',
        ethnicity: 'Eurasian Singaporean',
        skinTone: 'beautiful natural mixed heritage skin tone, olive to light brown complexion, realistic healthy human skin, dignified appearance',
        features: 'elegant mixed Eurasian facial features, natural eye color varies, respectful portrayal'
      };
    }
  }

  for (const part of nameParts) {
    if (CHINESE_GIVEN_NAMES.test(part)) {
      return {
        race: 'Chinese',
        ethnicity: 'Chinese Singaporean',
        skinTone: 'beautiful natural East Asian skin tone ranging from fair to light tan, realistic healthy human skin, dignified appearance',
        features: 'elegant East Asian Chinese facial features, natural dark brown or brown eyes, straight black hair, respectful portrayal'
      };
    }
  }

  // Default
  return {
    race: 'Singaporean',
    ethnicity: 'Singaporean',
    skinTone: 'beautiful natural Asian skin tone, realistic healthy human skin, dignified appearance',
    features: 'elegant Asian facial features, natural dark eyes, black hair, respectful portrayal'
  };
}
