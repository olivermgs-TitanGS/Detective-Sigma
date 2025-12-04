/**
 * CONTEXTUAL VARIATIONS
 * Seasonal, time-based, and event contexts for Singapore
 */

// ============================================
// TYPES
// ============================================

export interface TimeContext {
  id: string;
  name: string;
  period: 'morning' | 'afternoon' | 'evening' | 'night';
  hourRange: [number, number];
  description: string;
  atmosphere: string[];
  activities: string[];
}

export interface SeasonContext {
  id: string;
  name: string;
  months: number[];
  weather: string[];
  events: string[];
  schoolStatus: 'school' | 'holiday' | 'exam';
  description: string;
}

export interface EventContext {
  id: string;
  name: string;
  type: EventType;
  description: string;
  locations: string[];
  activities: string[];
  crowdLevel: 'low' | 'medium' | 'high';
}

export type EventType =
  | 'cultural'
  | 'religious'
  | 'national'
  | 'school'
  | 'community'
  | 'commercial'
  | 'sports';

// ============================================
// TIME CONTEXTS (8 periods)
// ============================================

export const timeContexts: TimeContext[] = [
  {
    id: 'time-early-morning',
    name: 'Early Morning',
    period: 'morning',
    hourRange: [5, 7],
    description: 'The early hours when Singapore awakens',
    atmosphere: [
      'The air is still cool from the night',
      'Morning joggers start appearing',
      'Hawkers begin preparing for the day',
      'The MRT starts getting busier',
    ],
    activities: [
      'morning exercise in the park',
      'opening up shops and stalls',
      'early deliveries being made',
      'cleaners finishing their night shift',
    ],
  },
  {
    id: 'time-morning',
    name: 'Morning',
    period: 'morning',
    hourRange: [7, 10],
    description: 'Rush hour and school time',
    atmosphere: [
      'The morning rush is in full swing',
      'Students hurry to school',
      'Office workers crowd the MRT',
      'Breakfast crowds fill hawker centres',
    ],
    activities: [
      'students arriving at school',
      'commuters rushing to work',
      'breakfast service at hawkers',
      'morning assemblies and classes',
    ],
  },
  {
    id: 'time-mid-morning',
    name: 'Mid-Morning',
    period: 'morning',
    hourRange: [10, 12],
    description: 'A quieter period as everyone settles in',
    atmosphere: [
      'The morning rush has settled',
      'Schools are in full session',
      'Shops start receiving customers',
      'The heat begins to build up',
    ],
    activities: [
      'classes and lessons in progress',
      'recess time at schools',
      'housewives doing marketing',
      'elderly chatting at void decks',
    ],
  },
  {
    id: 'time-lunch',
    name: 'Lunch Time',
    period: 'afternoon',
    hourRange: [12, 14],
    description: 'The busy lunch period',
    atmosphere: [
      'Hawker centres are packed',
      'Office workers flood food courts',
      'The sun beats down intensely',
      'Air-conditioned spaces are popular',
    ],
    activities: [
      'lunch breaks at school canteens',
      'office workers queuing for food',
      'students rushing to eat',
      'delivery riders everywhere',
    ],
  },
  {
    id: 'time-afternoon',
    name: 'Afternoon',
    period: 'afternoon',
    hourRange: [14, 17],
    description: 'The post-lunch quieter hours',
    atmosphere: [
      'The afternoon sun is blazing',
      'Many seek shelter indoors',
      'Schools start dismissing',
      'After-school activities begin',
    ],
    activities: [
      'school dismissal and CCAs',
      'students at tuition centres',
      'afternoon tea breaks',
      'homework and revision time',
    ],
  },
  {
    id: 'time-evening',
    name: 'Evening',
    period: 'evening',
    hourRange: [17, 20],
    description: 'The end of day rush',
    atmosphere: [
      'The evening rush begins',
      'Hawkers serve dinner crowds',
      'Parks fill with families',
      'Shopping malls get busy',
    ],
    activities: [
      'dinner time at hawker centres',
      'evening exercise at parks',
      'family mall trips',
      'night markets opening',
    ],
  },
  {
    id: 'time-night',
    name: 'Night',
    period: 'night',
    hourRange: [20, 23],
    description: 'Evening leisure time',
    atmosphere: [
      'The city lights up',
      'HDB corridors quiet down',
      'Night markets are lively',
      'Some areas become quiet',
    ],
    activities: [
      'late night study sessions',
      'evening tuition classes ending',
      'families winding down',
      'last visitors leaving',
    ],
  },
  {
    id: 'time-late-night',
    name: 'Late Night',
    period: 'night',
    hourRange: [23, 5],
    description: 'The quiet late hours',
    atmosphere: [
      'Most places are closed',
      'Only essential workers around',
      'The city sleeps',
      'Occasional vehicles pass by',
    ],
    activities: [
      'security guards on patrol',
      'cleaners at work',
      '24-hour shops quiet',
      'taxi drivers waiting',
    ],
  },
];

// ============================================
// SEASONAL CONTEXTS (Singapore)
// ============================================

export const seasonContexts: SeasonContext[] = [
  // January-February
  {
    id: 'season-cny',
    name: 'Chinese New Year Period',
    months: [1, 2],
    weather: ['occasional rain', 'warm and humid'],
    events: [
      'Chinese New Year celebrations',
      'River Hongbao',
      'Chingay Parade',
      'Lo Hei gatherings',
    ],
    schoolStatus: 'school',
    description: 'The festive Chinese New Year period with red decorations everywhere',
  },
  // March-May
  {
    id: 'season-march-may',
    name: 'Inter-Monsoon (March-May)',
    months: [3, 4, 5],
    weather: ['warm days', 'afternoon thunderstorms', 'humid'],
    events: [
      'Good Friday',
      'Vesak Day',
      'Mother\'s Day',
      'School exams beginning',
    ],
    schoolStatus: 'exam',
    description: 'The warm inter-monsoon period with afternoon storms',
  },
  // June
  {
    id: 'season-june-hols',
    name: 'June School Holidays',
    months: [6],
    weather: ['hot', 'less rain', 'sunny'],
    events: [
      'Great Singapore Sale',
      'June school holidays',
      'Holiday programmes',
      'Family trips',
    ],
    schoolStatus: 'holiday',
    description: 'The mid-year school break when families go on holiday',
  },
  // July-August
  {
    id: 'season-national',
    name: 'National Day Season',
    months: [7, 8],
    weather: ['warm', 'dry spell', 'occasional rain'],
    events: [
      'Hari Raya Haji',
      'National Day celebrations',
      'NDP rehearsals',
      'Racial Harmony Day',
    ],
    schoolStatus: 'school',
    description: 'The patriotic season with Singapore flags everywhere',
  },
  // September-October
  {
    id: 'season-sept-oct',
    name: 'Year-End Exam Period',
    months: [9, 10],
    weather: ['transition weather', 'more rain', 'cloudy'],
    events: [
      'Mid-Autumn Festival',
      'Year-end school exams',
      'PSLE period',
      'Deepavali preparations',
    ],
    schoolStatus: 'exam',
    description: 'The stressful exam period for students',
  },
  // November
  {
    id: 'season-deepavali',
    name: 'Deepavali Season',
    months: [11],
    weather: ['northeast monsoon starting', 'rainy periods'],
    events: [
      'Deepavali celebrations',
      'Little India lights up',
      'School holidays begin',
      'Year-end shopping',
    ],
    schoolStatus: 'holiday',
    description: 'The Festival of Lights with Little India beautifully decorated',
  },
  // December
  {
    id: 'season-december',
    name: 'Year-End Holiday Season',
    months: [12],
    weather: ['monsoon season', 'heavy rain', 'cooler'],
    events: [
      'Christmas celebrations',
      'Orchard Road lights',
      'Year-end holidays',
      'Countdown events',
    ],
    schoolStatus: 'holiday',
    description: 'The festive year-end season with Christmas decorations',
  },
];

// ============================================
// EVENT CONTEXTS (40+)
// ============================================

export const eventContexts: EventContext[] = [
  // Cultural Events
  {
    id: 'event-cny-bazaar',
    name: 'Chinese New Year Bazaar',
    type: 'cultural',
    description: 'The bustling CNY bazaar with stalls selling festive goodies',
    locations: ['mall', 'community', 'hawker'],
    activities: ['shopping for CNY goodies', 'watching lion dance', 'buying decorations'],
    crowdLevel: 'high',
  },
  {
    id: 'event-mid-autumn',
    name: 'Mid-Autumn Festival',
    type: 'cultural',
    description: 'Lantern celebrations and mooncake festivities',
    locations: ['nature', 'community', 'school'],
    activities: ['lantern walks', 'mooncake sharing', 'cultural performances'],
    crowdLevel: 'medium',
  },
  {
    id: 'event-hari-raya',
    name: 'Hari Raya Celebration',
    type: 'cultural',
    description: 'The joyous end of Ramadan with open houses',
    locations: ['hdb', 'community', 'mall'],
    activities: ['visiting relatives', 'open houses', 'festive shopping'],
    crowdLevel: 'medium',
  },
  {
    id: 'event-deepavali',
    name: 'Deepavali Celebration',
    type: 'cultural',
    description: 'The Festival of Lights with beautiful decorations',
    locations: ['community', 'mall', 'hdb'],
    activities: ['lighting lamps', 'cultural performances', 'festive gatherings'],
    crowdLevel: 'medium',
  },
  {
    id: 'event-pongal',
    name: 'Pongal Festival',
    type: 'cultural',
    description: 'The Tamil harvest festival celebration',
    locations: ['community', 'attraction'],
    activities: ['cooking pongal', 'cultural performances', 'temple visits'],
    crowdLevel: 'low',
  },

  // National Events
  {
    id: 'event-ndp',
    name: 'National Day Parade',
    type: 'national',
    description: 'Singapore\'s birthday celebration',
    locations: ['attraction', 'community', 'hdb'],
    activities: ['watching parade', 'fireworks viewing', 'community celebrations'],
    crowdLevel: 'high',
  },
  {
    id: 'event-ndp-rehearsal',
    name: 'NDP Rehearsal',
    type: 'national',
    description: 'Rehearsals for the National Day Parade',
    locations: ['sports', 'attraction'],
    activities: ['watching rehearsal', 'community gathering', 'patriotic activities'],
    crowdLevel: 'medium',
  },
  {
    id: 'event-total-defence',
    name: 'Total Defence Day',
    type: 'national',
    description: 'Commemorating Singapore\'s fall in WWII',
    locations: ['school', 'community'],
    activities: ['drills', 'educational activities', 'remembrance'],
    crowdLevel: 'low',
  },

  // School Events
  {
    id: 'event-sports-day',
    name: 'School Sports Day',
    type: 'school',
    description: 'Annual inter-house sports competition',
    locations: ['school', 'sports'],
    activities: ['athletic events', 'cheering', 'prize giving'],
    crowdLevel: 'high',
  },
  {
    id: 'event-speech-day',
    name: 'Speech Day',
    type: 'school',
    description: 'Annual prize-giving ceremony',
    locations: ['school', 'community'],
    activities: ['awards ceremony', 'performances', 'speeches'],
    crowdLevel: 'medium',
  },
  {
    id: 'event-open-house',
    name: 'School Open House',
    type: 'school',
    description: 'School showcase for prospective students',
    locations: ['school'],
    activities: ['tours', 'exhibits', 'CCA showcases'],
    crowdLevel: 'high',
  },
  {
    id: 'event-science-fair',
    name: 'Science Fair',
    type: 'school',
    description: 'Exhibition of student science projects',
    locations: ['school'],
    activities: ['project displays', 'judging', 'demonstrations'],
    crowdLevel: 'medium',
  },
  {
    id: 'event-book-fair',
    name: 'Book Fair',
    type: 'school',
    description: 'Book sale and reading promotion event',
    locations: ['school', 'mall'],
    activities: ['book buying', 'author talks', 'reading activities'],
    crowdLevel: 'medium',
  },
  {
    id: 'event-teachers-day',
    name: 'Teachers\' Day Celebration',
    type: 'school',
    description: 'Honoring teachers with performances and gifts',
    locations: ['school'],
    activities: ['performances', 'gift giving', 'appreciation activities'],
    crowdLevel: 'medium',
  },
  {
    id: 'event-graduation',
    name: 'Graduation Ceremony',
    type: 'school',
    description: 'Celebrating students completing their education',
    locations: ['school', 'community'],
    activities: ['ceremony', 'photo taking', 'celebrations'],
    crowdLevel: 'medium',
  },
  {
    id: 'event-cca-showcase',
    name: 'CCA Showcase',
    type: 'school',
    description: 'Co-curricular activities exhibition',
    locations: ['school'],
    activities: ['performances', 'demonstrations', 'recruitment'],
    crowdLevel: 'medium',
  },

  // Community Events
  {
    id: 'event-cc-carnival',
    name: 'Community Centre Carnival',
    type: 'community',
    description: 'Neighbourhood carnival with games and food',
    locations: ['community', 'hdb'],
    activities: ['games', 'food stalls', 'performances'],
    crowdLevel: 'medium',
  },
  {
    id: 'event-charity-drive',
    name: 'Charity Drive',
    type: 'community',
    description: 'Fundraising event for a good cause',
    locations: ['school', 'mall', 'community'],
    activities: ['donation collection', 'charity sales', 'awareness'],
    crowdLevel: 'medium',
  },
  {
    id: 'event-clean-up',
    name: 'Community Clean-Up',
    type: 'community',
    description: 'Neighbourhood cleaning initiative',
    locations: ['nature', 'hdb', 'community'],
    activities: ['litter picking', 'recycling', 'community bonding'],
    crowdLevel: 'low',
  },
  {
    id: 'event-fitness-day',
    name: 'Community Fitness Day',
    type: 'community',
    description: 'Mass exercise event for residents',
    locations: ['sports', 'community', 'nature'],
    activities: ['exercise', 'health checks', 'fitness games'],
    crowdLevel: 'medium',
  },
  {
    id: 'event-movie-night',
    name: 'Outdoor Movie Night',
    type: 'community',
    description: 'Free movie screening for residents',
    locations: ['community', 'hdb'],
    activities: ['movie watching', 'picnic', 'socializing'],
    crowdLevel: 'medium',
  },

  // Commercial Events
  {
    id: 'event-gss',
    name: 'Great Singapore Sale',
    type: 'commercial',
    description: 'Island-wide shopping sale event',
    locations: ['mall'],
    activities: ['shopping', 'bargain hunting', 'queueing'],
    crowdLevel: 'high',
  },
  {
    id: 'event-food-fair',
    name: 'Food Fair',
    type: 'commercial',
    description: 'Festival showcasing various cuisines',
    locations: ['mall', 'hawker', 'attraction'],
    activities: ['food tasting', 'cooking demos', 'eating'],
    crowdLevel: 'high',
  },
  {
    id: 'event-tech-fair',
    name: 'IT/Tech Fair',
    type: 'commercial',
    description: 'Electronics and gadget sale event',
    locations: ['mall', 'attraction'],
    activities: ['shopping', 'demonstrations', 'comparing'],
    crowdLevel: 'high',
  },
  {
    id: 'event-weekend-market',
    name: 'Weekend Market',
    type: 'commercial',
    description: 'Pop-up market with local vendors',
    locations: ['community', 'nature', 'mall'],
    activities: ['browsing', 'buying', 'food tasting'],
    crowdLevel: 'medium',
  },

  // Sports Events
  {
    id: 'event-running',
    name: 'Running Event',
    type: 'sports',
    description: 'Community running race or marathon',
    locations: ['nature', 'sports', 'attraction'],
    activities: ['running', 'cheering', 'collecting medals'],
    crowdLevel: 'high',
  },
  {
    id: 'event-swimming-gala',
    name: 'Swimming Gala',
    type: 'sports',
    description: 'Swimming competition',
    locations: ['sports'],
    activities: ['racing', 'cheering', 'timing'],
    crowdLevel: 'medium',
  },
  {
    id: 'event-sports-carnival',
    name: 'Sports Carnival',
    type: 'sports',
    description: 'Multi-sport community event',
    locations: ['sports', 'school'],
    activities: ['various sports', 'team games', 'prizes'],
    crowdLevel: 'medium',
  },

  // Religious Events (kid-friendly representation)
  {
    id: 'event-vesak-day',
    name: 'Vesak Day',
    type: 'religious',
    description: 'Buddhist celebration with temple visits',
    locations: ['attraction', 'community'],
    activities: ['temple visits', 'charitable activities', 'peaceful gatherings'],
    crowdLevel: 'medium',
  },
  {
    id: 'event-thaipusam',
    name: 'Thaipusam',
    type: 'religious',
    description: 'Hindu festival with processions',
    locations: ['attraction', 'community'],
    activities: ['procession watching', 'cultural observation'],
    crowdLevel: 'high',
  },
];

// ============================================
// DAY OF WEEK CONTEXTS
// ============================================

export interface DayContext {
  name: string;
  isWeekend: boolean;
  characteristics: string[];
  schoolStatus: string;
  crowdExpectation: 'low' | 'medium' | 'high';
}

export const dayContexts: Record<string, DayContext> = {
  Monday: {
    name: 'Monday',
    isWeekend: false,
    characteristics: ['start of work week', 'busy morning', 'fresh start'],
    schoolStatus: 'school day',
    crowdExpectation: 'medium',
  },
  Tuesday: {
    name: 'Tuesday',
    isWeekend: false,
    characteristics: ['regular work day', 'CCAs at school', 'routine'],
    schoolStatus: 'school day',
    crowdExpectation: 'medium',
  },
  Wednesday: {
    name: 'Wednesday',
    isWeekend: false,
    characteristics: ['mid-week', 'CCAs at school', 'routine'],
    schoolStatus: 'school day',
    crowdExpectation: 'medium',
  },
  Thursday: {
    name: 'Thursday',
    isWeekend: false,
    characteristics: ['approaching weekend', 'CCAs at school', 'routine'],
    schoolStatus: 'school day',
    crowdExpectation: 'medium',
  },
  Friday: {
    name: 'Friday',
    isWeekend: false,
    characteristics: ['end of work week', 'early dismissal often', 'weekend anticipation'],
    schoolStatus: 'school day (often shorter)',
    crowdExpectation: 'medium',
  },
  Saturday: {
    name: 'Saturday',
    isWeekend: true,
    characteristics: ['weekend', 'family time', 'enrichment classes', 'tuition'],
    schoolStatus: 'some CCAs/activities',
    crowdExpectation: 'high',
  },
  Sunday: {
    name: 'Sunday',
    isWeekend: true,
    characteristics: ['rest day', 'family outings', 'religious services'],
    schoolStatus: 'no school',
    crowdExpectation: 'high',
  },
};

// ============================================
// WEATHER CONTEXTS
// ============================================

export interface WeatherContext {
  id: string;
  name: string;
  description: string;
  effects: string[];
  visibility: 'good' | 'moderate' | 'poor';
}

export const weatherContexts: WeatherContext[] = [
  {
    id: 'weather-sunny',
    name: 'Hot and Sunny',
    description: 'Clear skies with strong sunshine',
    effects: ['people seek shade', 'outdoor activities limited', 'air-con places busy'],
    visibility: 'good',
  },
  {
    id: 'weather-cloudy',
    name: 'Cloudy',
    description: 'Overcast but no rain',
    effects: ['comfortable for outdoor activities', 'good for sports', 'pleasant weather'],
    visibility: 'good',
  },
  {
    id: 'weather-rain',
    name: 'Rainy',
    description: 'Rain showers in the area',
    effects: ['people sheltering', 'less outdoor activity', 'traffic jams'],
    visibility: 'moderate',
  },
  {
    id: 'weather-storm',
    name: 'Thunderstorm',
    description: 'Heavy rain with thunder and lightning',
    effects: ['everyone indoors', 'power cuts possible', 'transport affected'],
    visibility: 'poor',
  },
  {
    id: 'weather-hazy',
    name: 'Hazy',
    description: 'Haze affecting air quality',
    effects: ['outdoor activities cancelled', 'masks worn', 'people staying indoors'],
    visibility: 'poor',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getTimeContext(hour: number): TimeContext {
  return timeContexts.find(t =>
    (t.hourRange[0] <= hour && hour < t.hourRange[1]) ||
    (t.hourRange[0] > t.hourRange[1] && (hour >= t.hourRange[0] || hour < t.hourRange[1]))
  ) || timeContexts[0];
}

export function getSeasonContext(month: number): SeasonContext {
  return seasonContexts.find(s => s.months.includes(month)) || seasonContexts[0];
}

export function getRandomTimeContext(): TimeContext {
  return pickRandom(timeContexts);
}

export function getRandomSeasonContext(): SeasonContext {
  return pickRandom(seasonContexts);
}

export function getRandomEventContext(locationType?: string): EventContext {
  const available = locationType
    ? eventContexts.filter(e => e.locations.includes(locationType))
    : eventContexts;
  return pickRandom(available);
}

export function getRandomWeatherContext(): WeatherContext {
  return pickRandom(weatherContexts);
}

export function getEventsForLocation(locationType: string): EventContext[] {
  return eventContexts.filter(e => e.locations.includes(locationType));
}

export function getDayContext(dayName: string): DayContext {
  return dayContexts[dayName] || dayContexts['Monday'];
}

// Total contexts:
// - 8 time periods
// - 7 seasons
// - 35+ events
// - 7 days
// - 5 weather types
// Combined variations: 8 × 7 × 35 × 7 × 5 = 68,600 unique context combinations
