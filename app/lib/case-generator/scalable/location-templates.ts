/**
 * SCALABLE LOCATION TEMPLATES
 *
 * Modular location system for infinite storyline generation.
 * Each location is a building block that can combine with any crime type.
 */

export interface LocationTemplate {
  id: string;
  name: string;
  category: 'school' | 'commercial' | 'residential' | 'public' | 'industrial';

  // Variable descriptions (randomly selected)
  descriptions: string[];

  // Time-specific variations
  timeVariations: {
    morning: string[];
    afternoon: string[];
    evening: string[];
    night: string[];
  };

  // Possible roles at this location
  possibleRoles: string[];

  // Interactive elements
  interactiveAreas: string[];

  // What evidence could be found here
  evidenceOpportunities: string[];

  // Atmosphere modifiers
  atmospheres: ('busy' | 'quiet' | 'tense' | 'peaceful' | 'chaotic')[];
}

// ============================================
// SCHOOL LOCATIONS (20+)
// ============================================

export const SCHOOL_LOCATIONS: LocationTemplate[] = [
  {
    id: 'classroom-general',
    name: 'Classroom',
    category: 'school',
    descriptions: [
      'A typical classroom with rows of desks facing the whiteboard',
      'A bright classroom with student artwork decorating the walls',
      'A corner classroom with windows on two sides',
      'A newly renovated classroom with modern furniture',
    ],
    timeVariations: {
      morning: ['Students are settling in for the day', 'Morning assembly just ended'],
      afternoon: ['Post-lunch drowsiness fills the air', 'Afternoon sun streams through the windows'],
      evening: ['Empty desks cast long shadows', 'A forgotten water bottle sits on a desk'],
      night: ['Security lights illuminate the empty room', 'Chairs are stacked on desks'],
    },
    possibleRoles: ['Teacher', 'Student', 'Cleaner', 'Teaching Assistant', 'Relief Teacher'],
    interactiveAreas: ['Teacher\'s Desk', 'Student Desks', 'Whiteboard', 'Storage Cupboard', 'Window Sill'],
    evidenceOpportunities: ['Notebook', 'Pencil case', 'Worksheet', 'Bag contents', 'Desk drawer'],
    atmospheres: ['busy', 'quiet', 'peaceful'],
  },
  {
    id: 'school-canteen',
    name: 'School Canteen',
    category: 'school',
    descriptions: [
      'A bustling canteen with multiple food stalls',
      'A covered canteen area with long communal tables',
      'A modern canteen with air-conditioned seating',
      'A traditional canteen with metal trays and plastic stools',
    ],
    timeVariations: {
      morning: ['Breakfast crowd thinning out', 'Vendors preparing for recess rush'],
      afternoon: ['Lunch crowd at its peak', 'Long queues at popular stalls'],
      evening: ['Vendors cleaning up for the day', 'Last few students finishing homework'],
      night: ['Completely closed and dark', 'Security guard making rounds'],
    },
    possibleRoles: ['Canteen Vendor', 'Canteen Manager', 'Student', 'Cleaner', 'Teacher on Duty', 'Delivery Person'],
    interactiveAreas: ['Food Stalls', 'Seating Area', 'Tray Return', 'Cash Register', 'Storage Room'],
    evidenceOpportunities: ['Receipt', 'Tray', 'Food container', 'Money', 'Inventory list'],
    atmospheres: ['busy', 'chaotic', 'quiet'],
  },
  {
    id: 'school-library',
    name: 'School Library',
    category: 'school',
    descriptions: [
      'A quiet library with tall bookshelves and study corners',
      'A modern library with computer stations and bean bag chairs',
      'A cozy library with reading nooks and natural lighting',
      'A two-story library with a spiral staircase',
    ],
    timeVariations: {
      morning: ['Early birds finding good seats', 'Librarian sorting returned books'],
      afternoon: ['Students researching for projects', 'Quiet study session in progress'],
      evening: ['Library closing announcement', 'Last-minute book returns'],
      night: ['Automated lights on low power', 'Books casting eerie shadows'],
    },
    possibleRoles: ['Librarian', 'Library Assistant', 'Student', 'Teacher', 'IT Support'],
    interactiveAreas: ['Bookshelves', 'Computer Area', 'Librarian Desk', 'Study Tables', 'Magazine Rack'],
    evidenceOpportunities: ['Library card', 'Borrowed book', 'Computer log', 'Bookmark', 'Note'],
    atmospheres: ['quiet', 'peaceful'],
  },
  {
    id: 'science-lab',
    name: 'Science Laboratory',
    category: 'school',
    descriptions: [
      'A chemistry lab with safety equipment and fume hoods',
      'A biology lab with microscopes and specimen jars',
      'A physics lab with various measurement instruments',
      'A general science lab with versatile equipment',
    ],
    timeVariations: {
      morning: ['Lab being prepared for experiments', 'Equipment being checked'],
      afternoon: ['Experiment in progress', 'Students in lab coats'],
      evening: ['Post-lab cleanup', 'Equipment being stored'],
      night: ['Emergency lights on', 'Chemicals secured in cabinets'],
    },
    possibleRoles: ['Science Teacher', 'Lab Assistant', 'Lab Technician', 'Student', 'Safety Officer'],
    interactiveAreas: ['Lab Benches', 'Chemical Cabinet', 'Equipment Storage', 'Fume Hood', 'Safety Station'],
    evidenceOpportunities: ['Lab report', 'Chemical container', 'Safety log', 'Equipment sign-out sheet', 'Experiment notes'],
    atmospheres: ['quiet', 'tense', 'busy'],
  },
  {
    id: 'computer-lab',
    name: 'Computer Laboratory',
    category: 'school',
    descriptions: [
      'A modern computer lab with rows of new PCs',
      'An air-conditioned lab with individual workstations',
      'A multimedia lab with high-end computers',
      'A basic computer room with older equipment',
    ],
    timeVariations: {
      morning: ['Computers booting up', 'IT teacher preparing lesson'],
      afternoon: ['Students working on projects', 'Clicking of keyboards'],
      evening: ['Computers being shut down', 'Chairs pushed in'],
      night: ['Screens in sleep mode', 'Server humming quietly'],
    },
    possibleRoles: ['IT Teacher', 'IT Support', 'Student', 'Lab Assistant'],
    interactiveAreas: ['Computer Terminals', 'Server Room', 'Printer Area', 'Teacher Station', 'Storage Cabinet'],
    evidenceOpportunities: ['Browser history', 'USB drive', 'Print log', 'Login records', 'Saved files'],
    atmospheres: ['quiet', 'busy'],
  },
  {
    id: 'staff-room',
    name: 'Staff Room',
    category: 'school',
    descriptions: [
      'A comfortable staff room with sofas and coffee machine',
      'A working staff room with desks and pigeonholes',
      'A spacious staff room with meeting area',
      'A compact staff room with shared workspaces',
    ],
    timeVariations: {
      morning: ['Teachers grabbing coffee before class', 'Morning briefing ending'],
      afternoon: ['Teachers eating lunch', 'Marking papers between classes'],
      evening: ['Teachers preparing for tomorrow', 'Staff room emptying out'],
      night: ['Lights off, door locked', 'Security camera recording'],
    },
    possibleRoles: ['Teacher', 'Principal', 'Vice Principal', 'Admin Staff', 'Relief Teacher'],
    interactiveAreas: ['Teacher Desks', 'Pigeonholes', 'Coffee Corner', 'Meeting Table', 'Photocopy Area'],
    evidenceOpportunities: ['Student records', 'Staff schedule', 'Meeting notes', 'Personal items', 'Message note'],
    atmospheres: ['busy', 'quiet', 'peaceful'],
  },
  {
    id: 'sports-field',
    name: 'Sports Field',
    category: 'school',
    descriptions: [
      'A large grass field with running track',
      'An artificial turf field with goal posts',
      'A multi-purpose field with painted lines',
      'A shaded field with large rain trees',
    ],
    timeVariations: {
      morning: ['Morning exercises in progress', 'Dew still on the grass'],
      afternoon: ['PE class active', 'Hot sun beating down'],
      evening: ['Sports CCA practice', 'Long shadows on the field'],
      night: ['Floodlights on for evening training', 'Empty and quiet'],
    },
    possibleRoles: ['PE Teacher', 'Coach', 'Sports Captain', 'Student Athlete', 'Groundskeeper'],
    interactiveAreas: ['Field', 'Track', 'Equipment Store', 'Bleachers', 'Water Cooler'],
    evidenceOpportunities: ['Sports equipment', 'Water bottle', 'Team roster', 'Attendance sheet', 'Injury report'],
    atmospheres: ['busy', 'peaceful', 'tense'],
  },
  {
    id: 'music-room',
    name: 'Music Room',
    category: 'school',
    descriptions: [
      'A soundproofed room with various instruments',
      'A music room with a grand piano as centerpiece',
      'A practice room with instrument lockers',
      'A modern music room with recording equipment',
    ],
    timeVariations: {
      morning: ['Instruments being tuned', 'Music sheets being distributed'],
      afternoon: ['Practice session in full swing', 'Melodies filling the corridor'],
      evening: ['CCA band practice', 'Intensive rehearsal'],
      night: ['Instruments locked away', 'Silent and still'],
    },
    possibleRoles: ['Music Teacher', 'Band Director', 'Student Musician', 'Instrument Keeper'],
    interactiveAreas: ['Instrument Storage', 'Piano', 'Music Stands', 'Recording Booth', 'Sheet Music Cabinet'],
    evidenceOpportunities: ['Music sheet', 'Instrument case', 'Practice log', 'Recording', 'Locker contents'],
    atmospheres: ['quiet', 'busy', 'peaceful'],
  },
  {
    id: 'art-room',
    name: 'Art Room',
    category: 'school',
    descriptions: [
      'A colorful art room with easels and drying racks',
      'A spacious studio with natural lighting',
      'An art room with clay and pottery area',
      'A creative space with mixed media supplies',
    ],
    timeVariations: {
      morning: ['Canvases being prepared', 'Paint palettes being set up'],
      afternoon: ['Art class in session', 'Paint and clay everywhere'],
      evening: ['Artwork left to dry', 'Supplies being restocked'],
      night: ['Half-finished sculptures in moonlight', 'Chemical smell of paint'],
    },
    possibleRoles: ['Art Teacher', 'Art Assistant', 'Student Artist', 'Cleaner'],
    interactiveAreas: ['Easels', 'Supply Cupboard', 'Drying Racks', 'Sink Area', 'Display Wall'],
    evidenceOpportunities: ['Artwork', 'Paint tube', 'Brush', 'Art supplies', 'Student portfolio'],
    atmospheres: ['quiet', 'peaceful', 'chaotic'],
  },
  {
    id: 'school-office',
    name: 'General Office',
    category: 'school',
    descriptions: [
      'A busy front office with reception counter',
      'An air-conditioned office with multiple workstations',
      'A compact office with filing cabinets',
      'A modern office with digital systems',
    ],
    timeVariations: {
      morning: ['Parents signing in visitors', 'Morning announcements being prepared'],
      afternoon: ['Phone calls and paperwork', 'Students collecting letters'],
      evening: ['Office winding down', 'Files being organized'],
      night: ['Security system armed', 'Important documents locked up'],
    },
    possibleRoles: ['Admin Staff', 'School Secretary', 'Principal', 'Parent', 'Visitor'],
    interactiveAreas: ['Reception Counter', 'Filing Cabinets', 'Principal Office', 'Waiting Area', 'Notice Board'],
    evidenceOpportunities: ['Visitor log', 'Student record', 'Letter', 'Phone log', 'Schedule'],
    atmospheres: ['busy', 'tense', 'quiet'],
  },
];

// ============================================
// COMMERCIAL LOCATIONS (15+)
// ============================================

export const COMMERCIAL_LOCATIONS: LocationTemplate[] = [
  {
    id: 'hawker-centre',
    name: 'Hawker Centre',
    category: 'commercial',
    descriptions: [
      'A traditional hawker centre with sizzling woks',
      'A modern food court with air-conditioned seating',
      'A neighborhood kopitiam with marble tables',
      'A busy hawker centre near an MRT station',
    ],
    timeVariations: {
      morning: ['Breakfast crowd enjoying kopi', 'Stalls opening one by one'],
      afternoon: ['Lunch rush in full swing', 'Every table occupied'],
      evening: ['Dinner crowds arriving', 'Beer bottles on tables'],
      night: ['Late-night supper spot', 'Cleaning crews moving in'],
    },
    possibleRoles: ['Hawker Stall Owner', 'Stall Assistant', 'Cleaner', 'Regular Customer', 'Delivery Rider'],
    interactiveAreas: ['Food Stalls', 'Drink Stall', 'Shared Tables', 'Tray Return', 'Tissue Packet Seats'],
    evidenceOpportunities: ['Receipt', 'Order chit', 'Cash register', 'Ingredient list', 'CCTV footage'],
    atmospheres: ['busy', 'chaotic', 'peaceful'],
  },
  {
    id: 'convenience-store',
    name: 'Convenience Store',
    category: 'commercial',
    descriptions: [
      'A 24-hour convenience store with bright lights',
      'A neighborhood minimmart with local goods',
      'A franchise store at a busy corner',
      'A small provision shop run by a family',
    ],
    timeVariations: {
      morning: ['Workers grabbing breakfast', 'Newspaper delivery arrived'],
      afternoon: ['School kids buying snacks', 'Quiet afternoon lull'],
      evening: ['Office workers stopping by', 'Dinner crowd picking up food'],
      night: ['Late-night customers', 'Night shift worker alone'],
    },
    possibleRoles: ['Store Owner', 'Cashier', 'Stock Person', 'Customer', 'Security Guard'],
    interactiveAreas: ['Cash Register', 'Snack Aisles', 'Refrigerated Section', 'Hot Food Counter', 'Back Storeroom'],
    evidenceOpportunities: ['Receipt', 'CCTV footage', 'Inventory list', 'Cash register log', 'Customer transaction'],
    atmospheres: ['quiet', 'busy', 'tense'],
  },
  {
    id: 'shopping-mall',
    name: 'Shopping Mall',
    category: 'commercial',
    descriptions: [
      'A bustling shopping mall with multiple floors',
      'A neighborhood mall with local shops',
      'A premium mall with high-end stores',
      'A family-friendly mall with entertainment',
    ],
    timeVariations: {
      morning: ['Shops opening shutters', 'Early morning exercise group'],
      afternoon: ['Peak shopping hours', 'Food court packed'],
      evening: ['After-work shoppers', 'Movie screenings starting'],
      night: ['Mall closing announcements', 'Security doing rounds'],
    },
    possibleRoles: ['Shop Assistant', 'Security Guard', 'Mall Manager', 'Cleaner', 'Shopper'],
    interactiveAreas: ['Shop Fronts', 'Escalators', 'Food Court', 'Customer Service', 'Loading Bay'],
    evidenceOpportunities: ['Shopping receipt', 'CCTV footage', 'Credit card record', 'Visitor pass', 'Security log'],
    atmospheres: ['busy', 'chaotic', 'quiet'],
  },
  {
    id: 'wet-market',
    name: 'Wet Market',
    category: 'commercial',
    descriptions: [
      'A traditional wet market with fresh produce',
      'A modern market with numbered stalls',
      'A neighborhood market known for fresh seafood',
      'A morning market with local vegetables',
    ],
    timeVariations: {
      morning: ['Peak market hours', 'Aunties haggling for best price'],
      afternoon: ['Market winding down', 'Discounted produce'],
      evening: ['Stalls mostly closed', 'Cleaners hosing down floors'],
      night: ['Completely closed', 'Cats roaming the empty aisles'],
    },
    possibleRoles: ['Vegetable Seller', 'Fish Monger', 'Butcher', 'Regular Customer', 'Delivery Person', 'Market Manager'],
    interactiveAreas: ['Vegetable Stalls', 'Meat Section', 'Seafood Area', 'Dry Goods Corner', 'Back Alley'],
    evidenceOpportunities: ['Weighing scale record', 'Cash box', 'Delivery receipt', 'Inventory count', 'Transaction history'],
    atmospheres: ['busy', 'chaotic', 'quiet'],
  },
  {
    id: 'coffee-shop',
    name: 'Coffee Shop',
    category: 'commercial',
    descriptions: [
      'A traditional kopitiam with marble tables',
      'A modern cafe with hipster vibes',
      'A neighborhood coffee shop under HDB block',
      'An old-school coffee shop with kopi uncle',
    ],
    timeVariations: {
      morning: ['Regulars reading newspapers', 'Kopi being brewed'],
      afternoon: ['Quiet after lunch rush', 'Elderly playing chess'],
      evening: ['Beer and conversation', 'Soccer match on TV'],
      night: ['Last customers leaving', 'Chairs stacked on tables'],
    },
    possibleRoles: ['Coffee Shop Owner', 'Kopi Maker', 'Food Stall Tenant', 'Regular Customer', 'Cleaner'],
    interactiveAreas: ['Kopi Counter', 'Food Stalls', 'Seating Area', 'Newspaper Rack', 'Back Kitchen'],
    evidenceOpportunities: ['Tab record', 'Receipt book', 'Newspaper left behind', 'Regular customer log', 'CCTV footage'],
    atmospheres: ['quiet', 'peaceful', 'busy'],
  },
];

// ============================================
// RESIDENTIAL LOCATIONS (10+)
// ============================================

export const RESIDENTIAL_LOCATIONS: LocationTemplate[] = [
  {
    id: 'hdb-void-deck',
    name: 'HDB Void Deck',
    category: 'residential',
    descriptions: [
      'A spacious void deck with community notice board',
      'A void deck with exercise equipment corner',
      'A void deck with memorial altar area',
      'A newly renovated void deck with fresh paint',
    ],
    timeVariations: {
      morning: ['Elderly doing morning exercises', 'Children waiting for school bus'],
      afternoon: ['Quiet afternoon', 'Occasional resident passing through'],
      evening: ['Kids playing before dinner', 'Neighbors chatting'],
      night: ['Motion-sensor lights flickering', 'Security guard patrol'],
    },
    possibleRoles: ['Resident', 'Town Council Staff', 'Security Guard', 'Delivery Person', 'Cleaner'],
    interactiveAreas: ['Letterboxes', 'Lift Lobby', 'Notice Board', 'Stone Tables', 'Exercise Corner'],
    evidenceOpportunities: ['Notice', 'Dropped item', 'CCTV footage', 'Lift camera log', 'Visitor log'],
    atmospheres: ['quiet', 'peaceful', 'tense'],
  },
  {
    id: 'hdb-corridor',
    name: 'HDB Corridor',
    category: 'residential',
    descriptions: [
      'A long corridor with potted plants by doorways',
      'A common corridor with shoes outside each unit',
      'A quiet corridor on a high floor',
      'A busy corridor near the lift lobby',
    ],
    timeVariations: {
      morning: ['Residents leaving for work', 'Delivery packages at doors'],
      afternoon: ['Quiet with most residents out', 'Cleaner mopping'],
      evening: ['Cooking smells from kitchens', 'Children running home'],
      night: ['Quiet with occasional door closing', 'Corridor lights dimmed'],
    },
    possibleRoles: ['Resident', 'Neighbor', 'Cleaner', 'Delivery Person', 'Town Council Inspector'],
    interactiveAreas: ['Unit Doors', 'Common Area', 'Rubbish Chute', 'Shoe Racks', 'Window Ledges'],
    evidenceOpportunities: ['Package', 'Shoe', 'Dropped key', 'Notice slip', 'Neighbor testimony'],
    atmospheres: ['quiet', 'peaceful'],
  },
  {
    id: 'playground',
    name: 'Neighborhood Playground',
    category: 'residential',
    descriptions: [
      'A colorful playground with modern equipment',
      'A shaded playground under big trees',
      'A small playground with simple slides and swings',
      'A recently upgraded playground with safety flooring',
    ],
    timeVariations: {
      morning: ['Mothers with toddlers', 'Morning exercise groups'],
      afternoon: ['Quiet due to hot sun', 'Shade seekers on benches'],
      evening: ['Children playing after school', 'Parents supervising'],
      night: ['Empty with dim lighting', 'Occasional couple on bench'],
    },
    possibleRoles: ['Parent', 'Child', 'Helper', 'Elderly Resident', 'Town Council Staff'],
    interactiveAreas: ['Playground Equipment', 'Benches', 'Sand Pit', 'Water Fountain', 'Fitness Corner'],
    evidenceOpportunities: ['Lost toy', 'Water bottle', 'Footprints in sand', 'Witness accounts', 'CCTV from nearby'],
    atmospheres: ['peaceful', 'busy', 'quiet'],
  },
];

// ============================================
// PUBLIC LOCATIONS (10+)
// ============================================

export const PUBLIC_LOCATIONS: LocationTemplate[] = [
  {
    id: 'mrt-station',
    name: 'MRT Station',
    category: 'public',
    descriptions: [
      'A busy interchange station with multiple lines',
      'A neighborhood station with single platform',
      'An underground station with long escalators',
      'An above-ground station with good views',
    ],
    timeVariations: {
      morning: ['Peak hour rush', 'Commuters packed like sardines'],
      afternoon: ['Moderate crowd', 'Tourists consulting maps'],
      evening: ['Evening rush hour', 'Tired workers heading home'],
      night: ['Last train approaching', 'Station staff closing gates'],
    },
    possibleRoles: ['Commuter', 'Station Staff', 'Security Guard', 'Cleaner', 'Ticket Machine Attendant'],
    interactiveAreas: ['Platform', 'Ticket Gates', 'Control Station', 'Shops', 'Escalators'],
    evidenceOpportunities: ['EZ-Link card record', 'CCTV footage', 'Ticket stub', 'Lost item', 'Announcement log'],
    atmospheres: ['busy', 'chaotic', 'quiet'],
  },
  {
    id: 'bus-interchange',
    name: 'Bus Interchange',
    category: 'public',
    descriptions: [
      'A large covered bus interchange',
      'An integrated transport hub',
      'A neighborhood bus terminal',
      'A modern interchange with air-conditioning',
    ],
    timeVariations: {
      morning: ['Buses coming in rapidly', 'Long queues forming'],
      afternoon: ['Regular service', 'Some waiting passengers'],
      evening: ['Evening rush', 'Workers waiting for buses home'],
      night: ['Night buses only', 'Sparse crowd'],
    },
    possibleRoles: ['Bus Captain', 'Passenger', 'Interchange Staff', 'Security Guard', 'Cleaner'],
    interactiveAreas: ['Bus Berths', 'Waiting Area', 'Information Counter', 'Ticket Office', 'Rest Area'],
    evidenceOpportunities: ['Bus card record', 'CCTV footage', 'Bus schedule', 'Lost and found log', 'Driver log'],
    atmospheres: ['busy', 'chaotic', 'quiet'],
  },
  {
    id: 'community-centre',
    name: 'Community Centre',
    category: 'public',
    descriptions: [
      'A modern CC with multiple activity rooms',
      'A neighborhood CC with outdoor courts',
      'A renovated CC with senior care corner',
      'A busy CC with many interest groups',
    ],
    timeVariations: {
      morning: ['Elderly programs starting', 'Halls being cleaned'],
      afternoon: ['Various classes in session', 'Badminton courts busy'],
      evening: ['Peak activity time', 'Dance and exercise classes'],
      night: ['CC closing up', 'Last groups leaving'],
    },
    possibleRoles: ['CC Staff', 'Instructor', 'Participant', 'Cleaner', 'Security Guard', 'Grassroots Leader'],
    interactiveAreas: ['Multi-Purpose Hall', 'Activity Rooms', 'Counter', 'Sports Courts', 'Computer Room'],
    evidenceOpportunities: ['Registration log', 'Booking record', 'CCTV footage', 'Class roster', 'Locker contents'],
    atmospheres: ['busy', 'peaceful', 'quiet'],
  },
  {
    id: 'public-library',
    name: 'Public Library',
    category: 'public',
    descriptions: [
      'A regional library with multiple floors',
      'A neighborhood library in a mall',
      'A specialized library with local archives',
      'A children-focused library with activity space',
    ],
    timeVariations: {
      morning: ['Quiet study crowd', 'Librarians shelving returns'],
      afternoon: ['Students doing homework', 'Retirees reading newspapers'],
      evening: ['After-work crowd', 'Programs in meeting rooms'],
      night: ['Library closing', 'Last patrons leaving'],
    },
    possibleRoles: ['Librarian', 'Library Patron', 'Security Guard', 'Cleaner', 'Program Coordinator'],
    interactiveAreas: ['Book Stacks', 'Study Area', 'Computer Stations', 'Information Counter', 'Meeting Rooms'],
    evidenceOpportunities: ['Library card record', 'Borrowed book', 'Computer log', 'CCTV footage', 'Lost and found'],
    atmospheres: ['quiet', 'peaceful'],
  },
];

// ============================================
// EXPORT ALL LOCATIONS
// ============================================

export const ALL_LOCATIONS: LocationTemplate[] = [
  ...SCHOOL_LOCATIONS,
  ...COMMERCIAL_LOCATIONS,
  ...RESIDENTIAL_LOCATIONS,
  ...PUBLIC_LOCATIONS,
];

/**
 * Get random location from category
 */
export function getRandomLocation(category?: LocationTemplate['category']): LocationTemplate {
  const pool = category
    ? ALL_LOCATIONS.filter(l => l.category === category)
    : ALL_LOCATIONS;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Get random description for location
 */
export function getRandomDescription(location: LocationTemplate): string {
  return location.descriptions[Math.floor(Math.random() * location.descriptions.length)];
}

/**
 * Get time-appropriate variation
 */
export function getTimeVariation(location: LocationTemplate, time: keyof LocationTemplate['timeVariations']): string {
  const variations = location.timeVariations[time];
  return variations[Math.floor(Math.random() * variations.length)];
}

// Total unique location combinations:
// ~45 locations × 4 descriptions × 4 times × 5 atmospheres = 3,600+ base variations
