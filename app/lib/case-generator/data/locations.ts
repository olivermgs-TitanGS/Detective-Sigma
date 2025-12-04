/**
 * SINGAPORE LOCATIONS DATABASE
 * 100+ unique locations for case variety
 */

export interface Location {
  id: string;
  name: string;
  area: string;
  type: LocationType;
  subType?: string;
  features: string[];
}

export type LocationType =
  | 'school'
  | 'hawker'
  | 'mall'
  | 'nature'
  | 'hdb'
  | 'community'
  | 'transport'
  | 'attraction'
  | 'religious'
  | 'sports'
  | 'healthcare'
  | 'commercial';

// ============================================
// SCHOOLS (20)
// ============================================
export const schools: Location[] = [
  { id: 'sch-001', name: 'Raffles Primary School', area: 'Bishan', type: 'school', subType: 'primary', features: ['heritage', 'prestigious', 'large campus'] },
  { id: 'sch-002', name: 'Nanyang Primary School', area: 'Bukit Timah', type: 'school', subType: 'primary', features: ['bilingual', 'established', 'SAP school'] },
  { id: 'sch-003', name: 'Tao Nan School', area: 'Marine Parade', type: 'school', subType: 'primary', features: ['historic', 'Chinese heritage', 'modern facilities'] },
  { id: 'sch-004', name: 'Fairfield Methodist Primary', area: 'Dover', type: 'school', subType: 'primary', features: ['mission school', 'values-based', 'community'] },
  { id: 'sch-005', name: 'CHIJ St. Nicholas Girls', area: 'Ang Mo Kio', type: 'school', subType: 'primary', features: ['girls school', 'Catholic', 'traditional'] },
  { id: 'sch-006', name: 'Henry Park Primary', area: 'Holland', type: 'school', subType: 'primary', features: ['popular', 'residential area', 'strong academics'] },
  { id: 'sch-007', name: 'Rosyth School', area: 'Serangoon', type: 'school', subType: 'primary', features: ['affiliated', 'co-ed', 'modern'] },
  { id: 'sch-008', name: 'Ai Tong School', area: 'Ang Mo Kio', type: 'school', subType: 'primary', features: ['SAP', 'Chinese culture', 'performing arts'] },
  { id: 'sch-009', name: 'Pei Hwa Presbyterian Primary', area: 'Bukit Timah', type: 'school', subType: 'primary', features: ['Christian', 'bilingual', 'community'] },
  { id: 'sch-010', name: 'Maha Bodhi School', area: 'Ubi', type: 'school', subType: 'primary', features: ['Buddhist', 'values education', 'diverse'] },
  { id: 'sch-011', name: 'Haig Girls School', area: 'Katong', type: 'school', subType: 'primary', features: ['girls school', 'arts', 'heritage area'] },
  { id: 'sch-012', name: 'Kong Hwa School', area: 'Eunos', type: 'school', subType: 'primary', features: ['SAP', 'Chinese culture', 'community'] },
  { id: 'sch-013', name: 'Methodist Girls School', area: 'Blackmore', type: 'school', subType: 'primary', features: ['girls school', 'Methodist', 'holistic'] },
  { id: 'sch-014', name: 'Red Swastika School', area: 'Bedok', type: 'school', subType: 'primary', features: ['Taoist', 'moral education', 'community'] },
  { id: 'sch-015', name: 'Northland Primary', area: 'Yishun', type: 'school', subType: 'primary', features: ['north', 'diverse', 'modern campus'] },
  { id: 'sch-016', name: 'Westwood Primary', area: 'Jurong West', type: 'school', subType: 'primary', features: ['west', 'community', 'sports'] },
  { id: 'sch-017', name: 'Tampines Primary', area: 'Tampines', type: 'school', subType: 'primary', features: ['east', 'large', 'integrated hub'] },
  { id: 'sch-018', name: 'Punggol Primary', area: 'Punggol', type: 'school', subType: 'primary', features: ['new town', 'modern', 'young families'] },
  { id: 'sch-019', name: 'Woodlands Primary', area: 'Woodlands', type: 'school', subType: 'primary', features: ['north', 'diverse', 'community'] },
  { id: 'sch-020', name: 'Queenstown Primary', area: 'Queenstown', type: 'school', subType: 'primary', features: ['mature estate', 'heritage', 'central'] },
];

// ============================================
// HAWKER CENTRES (20)
// ============================================
export const hawkerCentres: Location[] = [
  { id: 'hwk-001', name: 'Old Airport Road Food Centre', area: 'Geylang', type: 'hawker', features: ['famous', 'large', 'heritage'] },
  { id: 'hwk-002', name: 'Maxwell Food Centre', area: 'Chinatown', type: 'hawker', features: ['tourist spot', 'Tian Tian chicken rice', 'historic'] },
  { id: 'hwk-003', name: 'Tiong Bahru Market', area: 'Tiong Bahru', type: 'hawker', features: ['hipster area', 'wet market', 'heritage'] },
  { id: 'hwk-004', name: 'Chomp Chomp Food Centre', area: 'Serangoon', type: 'hawker', features: ['evening only', 'BBQ', 'famous'] },
  { id: 'hwk-005', name: 'Adam Road Food Centre', area: 'Bukit Timah', type: 'hawker', features: ['nasi lemak', 'small', 'popular'] },
  { id: 'hwk-006', name: 'Zion Riverside Food Centre', area: 'River Valley', type: 'hawker', features: ['char kway teow', 'riverside', 'heritage'] },
  { id: 'hwk-007', name: 'Amoy Street Food Centre', area: 'CBD', type: 'hawker', features: ['office crowd', 'lunch rush', 'central'] },
  { id: 'hwk-008', name: 'Golden Mile Food Centre', area: 'Beach Road', type: 'hawker', features: ['Thai food', 'diverse', 'large'] },
  { id: 'hwk-009', name: 'Tampines Round Market', area: 'Tampines', type: 'hawker', features: ['round building', 'wet market', 'community'] },
  { id: 'hwk-010', name: 'Bedok Interchange Food Centre', area: 'Bedok', type: 'hawker', features: ['transport hub', 'busy', 'diverse'] },
  { id: 'hwk-011', name: 'Clementi 448 Market', area: 'Clementi', type: 'hawker', features: ['near NUS', 'student crowd', 'affordable'] },
  { id: 'hwk-012', name: 'Toa Payoh Lorong 8 Market', area: 'Toa Payoh', type: 'hawker', features: ['heritage estate', 'community', 'traditional'] },
  { id: 'hwk-013', name: 'Whampoa Makan Place', area: 'Whampoa', type: 'hawker', features: ['famous prawn noodles', 'rooftop', 'heritage'] },
  { id: 'hwk-014', name: 'Chinatown Complex Food Centre', area: 'Chinatown', type: 'hawker', features: ['largest', 'Michelin stalls', 'historic'] },
  { id: 'hwk-015', name: 'Bukit Timah Market', area: 'Bukit Timah', type: 'hawker', features: ['wealthy area', 'quality food', 'wet market'] },
  { id: 'hwk-016', name: 'Jurong West 505 Market', area: 'Jurong West', type: 'hawker', features: ['west side', 'HDB heartland', 'family'] },
  { id: 'hwk-017', name: 'Yishun Park Hawker Centre', area: 'Yishun', type: 'hawker', features: ['near park', 'modern', 'community'] },
  { id: 'hwk-018', name: 'Pasir Ris Central Hawker', area: 'Pasir Ris', type: 'hawker', features: ['east coast', 'family area', 'modern'] },
  { id: 'hwk-019', name: 'Ang Mo Kio 628 Market', area: 'Ang Mo Kio', type: 'hawker', features: ['popular', 'community', 'diverse'] },
  { id: 'hwk-020', name: 'Serangoon Garden Market', area: 'Serangoon', type: 'hawker', features: ['landed area', 'expat crowd', 'quality'] },
];

// ============================================
// MALLS (20)
// ============================================
export const malls: Location[] = [
  { id: 'mal-001', name: 'VivoCity', area: 'HarbourFront', type: 'mall', features: ['largest mall', 'waterfront', 'Sentosa access'] },
  { id: 'mal-002', name: 'NEX', area: 'Serangoon', type: 'mall', features: ['north-east', 'MRT connected', 'large'] },
  { id: 'mal-003', name: 'Jurong Point', area: 'Jurong', type: 'mall', features: ['west', 'bus interchange', 'community'] },
  { id: 'mal-004', name: 'Tampines Mall', area: 'Tampines', type: 'mall', features: ['east', 'regional centre', 'family'] },
  { id: 'mal-005', name: 'Northpoint City', area: 'Yishun', type: 'mall', features: ['north', 'modern', 'integrated'] },
  { id: 'mal-006', name: 'Causeway Point', area: 'Woodlands', type: 'mall', features: ['near JB', 'transport hub', 'busy'] },
  { id: 'mal-007', name: 'Plaza Singapura', area: 'Dhoby Ghaut', type: 'mall', features: ['central', 'cinema', 'heritage'] },
  { id: 'mal-008', name: 'ION Orchard', area: 'Orchard', type: 'mall', features: ['luxury', 'flagship', 'tourist'] },
  { id: 'mal-009', name: 'Bugis Junction', area: 'Bugis', type: 'mall', features: ['air-con street', 'youth', 'central'] },
  { id: 'mal-010', name: 'Suntec City', area: 'Marina', type: 'mall', features: ['convention', 'fountain', 'office area'] },
  { id: 'mal-011', name: 'Century Square', area: 'Tampines', type: 'mall', features: ['east', 'neighbourhood', 'family'] },
  { id: 'mal-012', name: 'Bedok Mall', area: 'Bedok', type: 'mall', features: ['east', 'MRT connected', 'community'] },
  { id: 'mal-013', name: 'West Mall', area: 'Bukit Batok', type: 'mall', features: ['west', 'community', 'library'] },
  { id: 'mal-014', name: 'Lot One', area: 'Choa Chu Kang', type: 'mall', features: ['west', 'library', 'community'] },
  { id: 'mal-015', name: 'Clementi Mall', area: 'Clementi', type: 'mall', features: ['west', 'NUS nearby', 'transport hub'] },
  { id: 'mal-016', name: 'AMK Hub', area: 'Ang Mo Kio', type: 'mall', features: ['central-north', 'MRT', 'community'] },
  { id: 'mal-017', name: 'Hougang Mall', area: 'Hougang', type: 'mall', features: ['north-east', 'community', 'traditional'] },
  { id: 'mal-018', name: 'White Sands', area: 'Pasir Ris', type: 'mall', features: ['east', 'beach nearby', 'family'] },
  { id: 'mal-019', name: 'JCube', area: 'Jurong East', type: 'mall', features: ['ice rink', 'west', 'entertainment'] },
  { id: 'mal-020', name: 'Waterway Point', area: 'Punggol', type: 'mall', features: ['new town', 'waterway', 'family'] },
];

// ============================================
// NATURE PARKS (15)
// ============================================
export const natureParks: Location[] = [
  { id: 'nat-001', name: 'Singapore Botanic Gardens', area: 'Tanglin', type: 'nature', subType: 'garden', features: ['UNESCO', 'heritage', 'orchids'] },
  { id: 'nat-002', name: 'East Coast Park', area: 'East Coast', type: 'nature', subType: 'beach', features: ['beach', 'cycling', 'BBQ'] },
  { id: 'nat-003', name: 'Sungei Buloh Wetland Reserve', area: 'Kranji', type: 'nature', subType: 'wetland', features: ['birds', 'mangroves', 'nature'] },
  { id: 'nat-004', name: 'MacRitchie Reservoir', area: 'Central', type: 'nature', subType: 'reservoir', features: ['treetop walk', 'trails', 'monkeys'] },
  { id: 'nat-005', name: 'Labrador Nature Reserve', area: 'Labrador', type: 'nature', subType: 'coastal', features: ['WWII history', 'coastal', 'quiet'] },
  { id: 'nat-006', name: 'Bukit Timah Nature Reserve', area: 'Bukit Timah', type: 'nature', subType: 'forest', features: ['highest hill', 'primary forest', 'trails'] },
  { id: 'nat-007', name: 'Pasir Ris Park', area: 'Pasir Ris', type: 'nature', subType: 'beach', features: ['mangroves', 'playground', 'camping'] },
  { id: 'nat-008', name: 'West Coast Park', area: 'West Coast', type: 'nature', subType: 'coastal', features: ['playground', 'family', 'quiet'] },
  { id: 'nat-009', name: 'Bishan-Ang Mo Kio Park', area: 'Bishan', type: 'nature', subType: 'park', features: ['river', 'naturalized', 'large'] },
  { id: 'nat-010', name: 'Punggol Waterway Park', area: 'Punggol', type: 'nature', subType: 'waterway', features: ['new town', 'cycling', 'modern'] },
  { id: 'nat-011', name: 'Jurong Lake Gardens', area: 'Jurong', type: 'nature', subType: 'garden', features: ['new', 'lake', 'playground'] },
  { id: 'nat-012', name: 'Gardens by the Bay', area: 'Marina', type: 'nature', subType: 'garden', features: ['Supertrees', 'domes', 'tourist'] },
  { id: 'nat-013', name: 'HortPark', area: 'Alexandra', type: 'nature', subType: 'garden', features: ['gardening', 'education', 'connector'] },
  { id: 'nat-014', name: 'Coney Island', area: 'Punggol', type: 'nature', subType: 'island', features: ['rustic', 'cycling', 'wildlife'] },
  { id: 'nat-015', name: 'Pulau Ubin', area: 'Changi', type: 'nature', subType: 'island', features: ['kampung life', 'cycling', 'nature'] },
];

// ============================================
// HDB ESTATES (15)
// ============================================
export const hdbEstates: Location[] = [
  { id: 'hdb-001', name: 'Block 123 Ang Mo Kio', area: 'Ang Mo Kio', type: 'hdb', features: ['mature estate', 'community', 'central'] },
  { id: 'hdb-002', name: 'Block 456 Bedok North', area: 'Bedok', type: 'hdb', features: ['east', 'established', 'diverse'] },
  { id: 'hdb-003', name: 'Block 789 Tampines', area: 'Tampines', type: 'hdb', features: ['east', 'young families', 'modern'] },
  { id: 'hdb-004', name: 'Block 234 Woodlands', area: 'Woodlands', type: 'hdb', features: ['north', 'near causeway', 'diverse'] },
  { id: 'hdb-005', name: 'Block 567 Jurong East', area: 'Jurong East', type: 'hdb', features: ['west', 'near lake', 'hub'] },
  { id: 'hdb-006', name: 'Block 890 Toa Payoh', area: 'Toa Payoh', type: 'hdb', features: ['heritage estate', 'elderly', 'central'] },
  { id: 'hdb-007', name: 'Block 345 Yishun', area: 'Yishun', type: 'hdb', features: ['north', 'young estate', 'facilities'] },
  { id: 'hdb-008', name: 'Block 678 Bukit Merah', area: 'Bukit Merah', type: 'hdb', features: ['central', 'mature', 'heritage'] },
  { id: 'hdb-009', name: 'Block 901 Clementi', area: 'Clementi', type: 'hdb', features: ['west', 'near NUS', 'students'] },
  { id: 'hdb-010', name: 'Block 112 Punggol', area: 'Punggol', type: 'hdb', features: ['new town', 'waterway', 'young'] },
  { id: 'hdb-011', name: 'Block 223 Sengkang', area: 'Sengkang', type: 'hdb', features: ['new town', 'families', 'modern'] },
  { id: 'hdb-012', name: 'Block 334 Queenstown', area: 'Queenstown', type: 'hdb', features: ['oldest estate', 'heritage', 'central'] },
  { id: 'hdb-013', name: 'Block 445 Hougang', area: 'Hougang', type: 'hdb', features: ['north-east', 'established', 'community'] },
  { id: 'hdb-014', name: 'Block 556 Pasir Ris', area: 'Pasir Ris', type: 'hdb', features: ['east', 'near beach', 'family'] },
  { id: 'hdb-015', name: 'Block 667 Bukit Panjang', area: 'Bukit Panjang', type: 'hdb', features: ['west', 'LRT', 'nature nearby'] },
];

// ============================================
// COMMUNITY CENTRES (10)
// ============================================
export const communityCentres: Location[] = [
  { id: 'cc-001', name: 'Bishan Community Club', area: 'Bishan', type: 'community', features: ['central', 'modern', 'popular'] },
  { id: 'cc-002', name: 'Our Tampines Hub', area: 'Tampines', type: 'community', features: ['largest', 'integrated', 'sports'] },
  { id: 'cc-003', name: 'Pasir Ris Sports Centre', area: 'Pasir Ris', type: 'community', features: ['sports', 'swimming', 'family'] },
  { id: 'cc-004', name: 'Woodlands Civic Centre', area: 'Woodlands', type: 'community', features: ['north', 'library', 'services'] },
  { id: 'cc-005', name: 'Jurong Spring CC', area: 'Jurong', type: 'community', features: ['west', 'classes', 'community'] },
  { id: 'cc-006', name: 'Toa Payoh Central CC', area: 'Toa Payoh', type: 'community', features: ['heritage', 'elderly', 'central'] },
  { id: 'cc-007', name: 'Bedok CC', area: 'Bedok', type: 'community', features: ['east', 'established', 'activities'] },
  { id: 'cc-008', name: 'Yishun CC', area: 'Yishun', type: 'community', features: ['north', 'modern', 'integrated'] },
  { id: 'cc-009', name: 'Serangoon CC', area: 'Serangoon', type: 'community', features: ['north-east', 'popular', 'diverse'] },
  { id: 'cc-010', name: 'Clementi CC', area: 'Clementi', type: 'community', features: ['west', 'near MRT', 'classes'] },
];

// ============================================
// TRANSPORT HUBS (10)
// ============================================
export const transportHubs: Location[] = [
  { id: 'trn-001', name: 'Changi Airport', area: 'Changi', type: 'transport', subType: 'airport', features: ['world-class', 'Jewel', 'tourist'] },
  { id: 'trn-002', name: 'Woodlands Checkpoint', area: 'Woodlands', type: 'transport', subType: 'checkpoint', features: ['Malaysia border', 'busy', 'north'] },
  { id: 'trn-003', name: 'Tuas Checkpoint', area: 'Tuas', type: 'transport', subType: 'checkpoint', features: ['second link', 'industrial', 'west'] },
  { id: 'trn-004', name: 'Jurong East MRT', area: 'Jurong East', type: 'transport', subType: 'MRT', features: ['interchange', 'busy', 'west hub'] },
  { id: 'trn-005', name: 'Dhoby Ghaut MRT', area: 'Dhoby Ghaut', type: 'transport', subType: 'MRT', features: ['triple line', 'central', 'busy'] },
  { id: 'trn-006', name: 'Raffles Place MRT', area: 'CBD', type: 'transport', subType: 'MRT', features: ['business district', 'peak hour', 'central'] },
  { id: 'trn-007', name: 'Serangoon MRT', area: 'Serangoon', type: 'transport', subType: 'MRT', features: ['interchange', 'NEX', 'busy'] },
  { id: 'trn-008', name: 'HarbourFront MRT', area: 'HarbourFront', type: 'transport', subType: 'MRT', features: ['Sentosa', 'cruise', 'tourist'] },
  { id: 'trn-009', name: 'Bishan MRT', area: 'Bishan', type: 'transport', subType: 'MRT', features: ['interchange', 'central', 'busy'] },
  { id: 'trn-010', name: 'Tampines MRT', area: 'Tampines', type: 'transport', subType: 'MRT', features: ['east hub', 'interchange', 'busy'] },
];

// ============================================
// ATTRACTIONS (10)
// ============================================
export const attractions: Location[] = [
  { id: 'att-001', name: 'Singapore Zoo', area: 'Mandai', type: 'attraction', features: ['animals', 'open concept', 'family'] },
  { id: 'att-002', name: 'Night Safari', area: 'Mandai', type: 'attraction', features: ['night', 'unique', 'animals'] },
  { id: 'att-003', name: 'River Wonders', area: 'Mandai', type: 'attraction', features: ['river animals', 'pandas', 'family'] },
  { id: 'att-004', name: 'Universal Studios', area: 'Sentosa', type: 'attraction', features: ['theme park', 'rides', 'tourist'] },
  { id: 'att-005', name: 'S.E.A. Aquarium', area: 'Sentosa', type: 'attraction', features: ['marine life', 'large', 'educational'] },
  { id: 'att-006', name: 'Science Centre', area: 'Jurong East', type: 'attraction', features: ['educational', 'interactive', 'school trips'] },
  { id: 'att-007', name: 'ArtScience Museum', area: 'Marina Bay', type: 'attraction', features: ['exhibitions', 'iconic', 'modern'] },
  { id: 'att-008', name: 'National Museum', area: 'Bras Basah', type: 'attraction', features: ['history', 'heritage', 'educational'] },
  { id: 'att-009', name: 'Singapore Flyer', area: 'Marina Bay', type: 'attraction', features: ['observation wheel', 'views', 'tourist'] },
  { id: 'att-010', name: 'Chinatown Heritage Centre', area: 'Chinatown', type: 'attraction', features: ['history', 'culture', 'educational'] },
];

// ============================================
// SPORTS FACILITIES (10)
// ============================================
export const sportsFacilities: Location[] = [
  { id: 'spt-001', name: 'Singapore Sports Hub', area: 'Kallang', type: 'sports', features: ['national stadium', 'events', 'modern'] },
  { id: 'spt-002', name: 'OCBC Aquatic Centre', area: 'Kallang', type: 'sports', features: ['swimming', 'Olympic', 'training'] },
  { id: 'spt-003', name: 'Bedok Stadium', area: 'Bedok', type: 'sports', features: ['athletics', 'community', 'east'] },
  { id: 'spt-004', name: 'Jurong West Swimming Complex', area: 'Jurong West', type: 'sports', features: ['swimming', 'family', 'west'] },
  { id: 'spt-005', name: 'Hougang Sports Hall', area: 'Hougang', type: 'sports', features: ['indoor', 'badminton', 'community'] },
  { id: 'spt-006', name: 'Yio Chu Kang Swimming Complex', area: 'Ang Mo Kio', type: 'sports', features: ['swimming', 'north', 'family'] },
  { id: 'spt-007', name: 'Sengkang Sports Centre', area: 'Sengkang', type: 'sports', features: ['modern', 'integrated', 'north-east'] },
  { id: 'spt-008', name: 'Clementi Sports Hall', area: 'Clementi', type: 'sports', features: ['basketball', 'community', 'west'] },
  { id: 'spt-009', name: 'Choa Chu Kang Sports Centre', area: 'Choa Chu Kang', type: 'sports', features: ['swimming', 'gym', 'west'] },
  { id: 'spt-010', name: 'Tampines Sports Hall', area: 'Tampines', type: 'sports', features: ['indoor', 'events', 'east'] },
];

// ============================================
// COMBINED EXPORTS
// ============================================
export const allLocations: Location[] = [
  ...schools,
  ...hawkerCentres,
  ...malls,
  ...natureParks,
  ...hdbEstates,
  ...communityCentres,
  ...transportHubs,
  ...attractions,
  ...sportsFacilities,
];

export const locationsByType: Record<LocationType, Location[]> = {
  school: schools,
  hawker: hawkerCentres,
  mall: malls,
  nature: natureParks,
  hdb: hdbEstates,
  community: communityCentres,
  transport: transportHubs,
  attraction: attractions,
  sports: sportsFacilities,
  religious: [], // To be added
  healthcare: [], // To be added
  commercial: [], // To be added
};

// ============================================
// HELPER FUNCTIONS
// ============================================
export function getRandomLocation(): Location {
  return allLocations[Math.floor(Math.random() * allLocations.length)];
}

export function getLocationsByType(type: LocationType): Location[] {
  return locationsByType[type] || [];
}

export function getLocationsByArea(area: string): Location[] {
  return allLocations.filter(loc =>
    loc.area.toLowerCase().includes(area.toLowerCase())
  );
}

export function getLocationById(id: string): Location | undefined {
  return allLocations.find(loc => loc.id === id);
}

// Total: 130 unique locations
