import { WasteReport, ReportUpdate, HotspotArea, User, REPORT_STATUS, REPORT_SEVERITY } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'usr_admin_01',
    name: 'Municipal Sanitation Officer',
    email: 'admin@swachhdisha.com',
    phone: '+91 98480 22331',
    role: 'ADMIN',
  },
  {
    id: 'usr_cit_01',
    name: 'Varshini A.',
    email: 'varshini.amudala06@gmail.com',
    phone: '+91 94401 55667',
    role: 'CITIZEN',
  },
];

export const INITIAL_REPORTS: WasteReport[] = [
  {
    id: 'REP-2026-8091',
    category: 'plastic',
    severity: 'HIGH',
    description: 'Heavy blockage of roadside stormwater drain caused by thousands of single-use beverage bottles and polyethylene carry bags. Water stagnant and beginning to overflow onto pedestrian footpath.',
    address: 'Near Pillar 142, Metro Junction Outer Ring Road',
    ward: 'Ward 7 - Metro Junction & Market',
    latitude: 17.3984,
    longitude: 78.4812,
    status: 'IN_PROGRESS',
    isAnonymous: false,
    reporterId: 'usr_cit_01',
    reporterName: 'Varshini A.',
    reporterContact: '+91 94401 55667',
    createdAt: '2026-10-02T08:30:00Z',
    updatedAt: '2026-10-04T10:15:00Z',
  },
  {
    id: 'REP-2026-8092',
    category: 'medical',
    severity: 'CRITICAL',
    description: 'Illegally dumped clinic waste including discarded intravenous tubes, syringe needles, and blood collection vials found exposed near municipal primary school perimeter fence.',
    address: 'Plot 44, Lane 3 behind Community Health Centre, Old Bazaar',
    ward: 'Ward 15 - Old Bazaar & Textile Row',
    latitude: 17.3752,
    longitude: 78.4719,
    status: 'VERIFIED',
    isAnonymous: true,
    createdAt: '2026-10-03T11:45:00Z',
    updatedAt: '2026-10-03T16:20:00Z',
  },
  {
    id: 'REP-2026-8093',
    category: 'organic',
    severity: 'MEDIUM',
    description: 'Decomposing wholesale vegetable crates and fruit pulp left uncollected for 3 days outside wholesale mandi. Strong foul odor attracting stray cattle and pack flies.',
    address: 'Wholesale Mandi Gate 2, Subzi Market Road',
    ward: 'Ward 15 - Old Bazaar & Textile Row',
    latitude: 17.3688,
    longitude: 78.4795,
    status: 'PENDING',
    isAnonymous: false,
    reporterId: 'usr_cit_01',
    reporterName: 'Varshini A.',
    reporterContact: '+91 94401 55667',
    createdAt: '2026-10-04T06:10:00Z',
    updatedAt: '2026-10-04T06:10:00Z',
  },
  {
    id: 'REP-2026-8094',
    category: 'construction',
    severity: 'HIGH',
    description: 'Night dumping of approximately 4 metric tons of concrete demolition rubble, broken masonry slabs, and ceramic tiles obstructing the two-wheeler lane.',
    address: 'Survey No. 89, University Link Road, near East Campus Gate',
    ward: 'Ward 4 - Green Park & University',
    latitude: 17.4125,
    longitude: 78.4930,
    status: 'VERIFIED',
    isAnonymous: false,
    reporterId: 'usr_cit_02',
    reporterName: 'Ramesh Rao',
    reporterContact: '+91 99882 11223',
    createdAt: '2026-10-01T14:20:00Z',
    updatedAt: '2026-10-02T09:00:00Z',
  },
  {
    id: 'REP-2026-8095',
    category: 'e-waste',
    severity: 'LOW',
    description: 'Commercial shop dumped broken cathode ray monitors, charred inverter batteries, and plastic circuit casings adjacent to the transformer enclosure.',
    address: 'Electronics Lane, Opposite State Bank branch',
    ward: 'Ward 12 - Civic Center & Bus Stand',
    latitude: 17.3871,
    longitude: 78.4845,
    status: 'RESOLVED',
    isAnonymous: false,
    reporterId: 'usr_cit_01',
    reporterName: 'Varshini A.',
    reporterContact: '+91 94401 55667',
    createdAt: '2026-09-28T10:00:00Z',
    updatedAt: '2026-09-30T17:40:00Z',
  },
  {
    id: 'REP-2026-8096',
    category: 'hazardous',
    severity: 'CRITICAL',
    description: 'Leaking chemical drums emitting pungent chemical fumes near the public water canal inlet. Immediate municipal hazmat team intervention requested.',
    address: 'Canal Bank, Phase 2 Industrial Bypass Road',
    ward: 'Ward 18 - Industrial Belt & Warehouses',
    latitude: 17.3620,
    longitude: 78.5020,
    status: 'IN_PROGRESS',
    isAnonymous: true,
    createdAt: '2026-10-04T09:15:00Z',
    updatedAt: '2026-10-04T11:00:00Z',
  },
  {
    id: 'REP-2026-8097',
    category: 'mixed',
    severity: 'MEDIUM',
    description: 'Overflowing public secondary dumper bin with garbage scattered up to 20 meters across the road after weekend festival crowd.',
    address: 'Near Old Bus Stand Central Roundabout',
    ward: 'Ward 12 - Civic Center & Bus Stand',
    latitude: 17.3895,
    longitude: 78.4770,
    status: 'RESOLVED',
    isAnonymous: false,
    reporterId: 'usr_cit_03',
    reporterName: 'Sunita Reddy',
    reporterContact: '+91 98765 43210',
    createdAt: '2026-09-29T16:30:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'REP-2026-8098',
    category: 'plastic',
    severity: 'HIGH',
    description: 'Open burning of synthetic plastic packaging and thermocol crates behind the warehouse cluster causing dense noxious black smoke.',
    address: 'Behind Plot 12B, Warehouse Alley 4',
    ward: 'Ward 18 - Industrial Belt & Warehouses',
    latitude: 17.3580,
    longitude: 78.5140,
    status: 'PENDING',
    isAnonymous: false,
    reporterId: 'usr_cit_01',
    reporterName: 'Varshini A.',
    reporterContact: '+91 94401 55667',
    createdAt: '2026-10-05T01:20:00Z',
    updatedAt: '2026-10-05T01:20:00Z',
  },
  {
    id: 'REP-2026-8099',
    category: 'organic',
    severity: 'LOW',
    description: 'Piles of seasonal pruned tree branches and garden shrub cuttings left on road curb following street maintenance.',
    address: 'Park Avenue 4th Cross, Green Park Colony',
    ward: 'Ward 4 - Green Park & University',
    latitude: 17.4190,
    longitude: 78.4880,
    status: 'RESOLVED',
    isAnonymous: false,
    reporterId: 'usr_cit_04',
    reporterName: 'Dr. K. Srinivas',
    reporterContact: '+91 97001 23456',
    createdAt: '2026-09-27T08:15:00Z',
    updatedAt: '2026-09-28T15:00:00Z',
  },
  {
    id: 'REP-2026-8100',
    category: 'mixed',
    severity: 'MEDIUM',
    description: 'Littered plastic pouches, cups, and food wrappers on riverfront steps following weekend night bazaar.',
    address: 'Ghat Steps No. 3, Riverside Promenade',
    ward: 'Ward 22 - Riverside Colony & Ghats',
    latitude: 17.3710,
    longitude: 78.4620,
    status: 'IN_PROGRESS',
    isAnonymous: false,
    reporterId: 'usr_cit_01',
    reporterName: 'Varshini A.',
    reporterContact: '+91 94401 55667',
    createdAt: '2026-10-03T18:00:00Z',
    updatedAt: '2026-10-04T08:30:00Z',
  },
];

export const INITIAL_UPDATES: Record<string, ReportUpdate[]> = {
  'REP-2026-8091': [
    {
      id: 'upd_8091_1',
      reportId: 'REP-2026-8091',
      status: 'PENDING',
      message: 'Citizen report logged with high severity. Assigned to Ward 7 Zonal Officer.',
      updatedBy: 'System Automated Router',
      createdAt: '2026-10-02T08:30:00Z',
    },
    {
      id: 'upd_8091_2',
      reportId: 'REP-2026-8091',
      status: 'VERIFIED',
      message: 'Field Inspector inspected stormwater drain. Verified critical blockage from non-biodegradable plastics.',
      updatedBy: 'Zonal Inspector Ward 7',
      createdAt: '2026-10-03T09:10:00Z',
    },
    {
      id: 'upd_8091_3',
      reportId: 'REP-2026-8091',
      status: 'IN_PROGRESS',
      message: 'Hydraulic desilting vehicle and 4-person sanitation crew deployed on site. Clearing drain culvert.',
      updatedBy: 'Sanitation Superintending Officer',
      createdAt: '2026-10-04T10:15:00Z',
    },
  ],
  'REP-2026-8092': [
    {
      id: 'upd_8092_1',
      reportId: 'REP-2026-8092',
      status: 'PENDING',
      message: 'Anonymous biohazard report received near school zone.',
      updatedBy: 'Citizen Dispatch Desk',
      createdAt: '2026-10-03T11:45:00Z',
    },
    {
      id: 'upd_8092_2',
      reportId: 'REP-2026-8092',
      status: 'VERIFIED',
      message: 'Municipal Health Officer confirmed clinical waste dumping. Area cordoned off with safety tape; show-cause notice initiated to nearby private clinics.',
      updatedBy: 'Dr. Ananya Sen, Health Officer',
      createdAt: '2026-10-03T16:20:00Z',
    },
  ],
  'REP-2026-8093': [
    {
      id: 'upd_8093_1',
      reportId: 'REP-2026-8093',
      status: 'PENDING',
      message: 'Report logged by citizen Varshini A. Queued for morning vegetable market clearing round.',
      updatedBy: 'Central Portal Dispatch',
      createdAt: '2026-10-04T06:10:00Z',
    },
  ],
  'REP-2026-8094': [
    {
      id: 'upd_8094_1',
      reportId: 'REP-2026-8094',
      status: 'PENDING',
      message: 'Debris obstruction logged on University Link Road.',
      updatedBy: 'Public Complaint Line',
      createdAt: '2026-10-01T14:20:00Z',
    },
    {
      id: 'upd_8094_2',
      reportId: 'REP-2026-8094',
      status: 'VERIFIED',
      message: 'Site verified. Heavy earthmover requested for rubble pickup.',
      updatedBy: 'Ward 4 Supervisor',
      createdAt: '2026-10-02T09:00:00Z',
    },
  ],
  'REP-2026-8095': [
    {
      id: 'upd_8095_1',
      reportId: 'REP-2026-8095',
      status: 'PENDING',
      message: 'E-waste discard logged near electrical transformer.',
      updatedBy: 'Civic Helpdesk',
      createdAt: '2026-09-28T10:00:00Z',
    },
    {
      id: 'upd_8095_2',
      reportId: 'REP-2026-8095',
      status: 'VERIFIED',
      message: 'Verified hazardous proximity to transformer.',
      updatedBy: 'Civic Center Inspector',
      createdAt: '2026-09-29T11:00:00Z',
    },
    {
      id: 'upd_8095_3',
      reportId: 'REP-2026-8095',
      status: 'IN_PROGRESS',
      message: 'Certified e-waste recycling agency vehicle dispatched.',
      updatedBy: 'Material Recovery Officer',
      createdAt: '2026-09-30T10:00:00Z',
    },
    {
      id: 'upd_8095_4',
      reportId: 'REP-2026-8095',
      status: 'RESOLVED',
      message: 'All e-waste safely collected, cataloged, and transported to municipal authorized recycling hub.',
      updatedBy: 'Material Recovery Officer',
      createdAt: '2026-09-30T17:40:00Z',
    },
  ],
  'REP-2026-8096': [
    {
      id: 'upd_8096_1',
      reportId: 'REP-2026-8096',
      status: 'PENDING',
      message: 'Emergency chemical hazard alert received.',
      updatedBy: 'Civic Emergency Escalation',
      createdAt: '2026-10-04T09:15:00Z',
    },
    {
      id: 'upd_8096_2',
      reportId: 'REP-2026-8096',
      status: 'VERIFIED',
      message: 'State Pollution Control Board notified. Verified solvent drum leaks.',
      updatedBy: 'Industrial Zone Officer',
      createdAt: '2026-10-04T10:00:00Z',
    },
    {
      id: 'upd_8096_3',
      reportId: 'REP-2026-8096',
      status: 'IN_PROGRESS',
      message: 'Chemical containment crew applying neutralizing sorbents and placing overpack salvage drums.',
      updatedBy: 'Hazmat Taskforce Alpha',
      createdAt: '2026-10-04T11:00:00Z',
    },
  ],
  'REP-2026-8097': [
    {
      id: 'upd_8097_1',
      reportId: 'REP-2026-8097',
      status: 'PENDING',
      message: 'Overflowing dumper bin reported by citizen Sunita Reddy.',
      updatedBy: 'Public Complaint Line',
      createdAt: '2026-09-29T16:30:00Z',
    },
    {
      id: 'upd_8097_2',
      reportId: 'REP-2026-8097',
      status: 'IN_PROGRESS',
      message: 'Compactor truck rerouted to bus stand roundabout.',
      updatedBy: 'Sanitation Dispatch',
      createdAt: '2026-09-30T07:00:00Z',
    },
    {
      id: 'upd_8097_3',
      reportId: 'REP-2026-8097',
      status: 'RESOLVED',
      message: 'Dumper emptied and surrounding pavement swept and lime-powder disinfected.',
      updatedBy: 'Sanitation Dispatch',
      createdAt: '2026-10-01T12:00:00Z',
    },
  ],
  'REP-2026-8098': [
    {
      id: 'upd_8098_1',
      reportId: 'REP-2026-8098',
      status: 'PENDING',
      message: 'Open burning complaint received. Ward 18 night squad alerted.',
      updatedBy: 'Citizen Dispatch Desk',
      createdAt: '2026-10-05T01:20:00Z',
    },
  ],
  'REP-2026-8099': [
    {
      id: 'upd_8099_1',
      reportId: 'REP-2026-8099',
      status: 'RESOLVED',
      message: 'Horticultural debris collected by green waste dumper truck.',
      updatedBy: 'Green Park Zone Inspector',
      createdAt: '2026-09-28T15:00:00Z',
    },
  ],
  'REP-2026-8100': [
    {
      id: 'upd_8100_1',
      reportId: 'REP-2026-8100',
      status: 'PENDING',
      message: 'Report logged for promenade steps.',
      updatedBy: 'Citizen Portal',
      createdAt: '2026-10-03T18:00:00Z',
    },
    {
      id: 'upd_8100_2',
      reportId: 'REP-2026-8100',
      status: 'IN_PROGRESS',
      message: 'Morning riverfront sanitation sweep in progress.',
      updatedBy: 'Riverside Ward Supervisor',
      createdAt: '2026-10-04T08:30:00Z',
    },
  ],
};

export const HOTSPOT_AREAS: HotspotArea[] = [
  {
    id: 'HOT-01',
    name: 'Metro Junction & Drainage Culvert Zone',
    ward: 'Ward 7 - Metro Junction & Market',
    reportCount: 38,
    severity: 'CRITICAL',
    commonCategory: 'plastic',
    lastReportedAt: '2026-10-04T10:15:00Z',
    latitude: 17.3980,
    longitude: 78.4810,
    description: 'Chronic bottleneck where multi-lane flyover footpaths meet central arterial stormwater drains. High density of single-use plastic cups, food wrappers, and commercial transit packaging.',
    resolutionRate: 68,
  },
  {
    id: 'HOT-02',
    name: 'Industrial Chemical Canal Corridor',
    ward: 'Ward 18 - Industrial Belt & Warehouses',
    reportCount: 42,
    severity: 'CRITICAL',
    commonCategory: 'hazardous',
    lastReportedAt: '2026-10-05T01:20:00Z',
    latitude: 17.3600,
    longitude: 78.5080,
    description: 'Unmonitored peripheral alleyways behind industrial sheds with repeated midnight dumping of toxic sludge, industrial paint thinners, and illegal plastic incineration heaps.',
    resolutionRate: 54,
  },
  {
    id: 'HOT-03',
    name: 'Old Bazaar Meat & Produce Alley',
    ward: 'Ward 15 - Old Bazaar & Textile Row',
    reportCount: 29,
    severity: 'HIGH',
    commonCategory: 'organic',
    lastReportedAt: '2026-10-04T06:10:00Z',
    latitude: 17.3710,
    longitude: 78.4760,
    description: 'High daily perishable volume without sufficient closed cold-storage composting bins. Rapid decay causes recurring pest hazards and runoff into neighborhood stormwater channels.',
    resolutionRate: 79,
  },
  {
    id: 'HOT-04',
    name: 'University Link Road Expansion Stretch',
    ward: 'Ward 4 - Green Park & University',
    reportCount: 22,
    severity: 'HIGH',
    commonCategory: 'construction',
    lastReportedAt: '2026-10-02T09:00:00Z',
    latitude: 17.4110,
    longitude: 78.4940,
    description: 'Unlit roadside margins frequently used by private construction contractors to dump brick rubble and excavation clay, narrowing pedestrian walking tracks.',
    resolutionRate: 72,
  },
  {
    id: 'HOT-05',
    name: 'Civic Center Inter-State Bus Terminus',
    ward: 'Ward 12 - Civic Center & Bus Stand',
    reportCount: 19,
    severity: 'MEDIUM',
    commonCategory: 'mixed',
    lastReportedAt: '2026-10-01T12:00:00Z',
    latitude: 17.3880,
    longitude: 78.4800,
    description: 'High passenger transit volume causing periodic overflowing of secondary waste bins during peak commute hours. Strong street-vendor packaging spillover.',
    resolutionRate: 84,
  },
  {
    id: 'HOT-06',
    name: 'Riverside Promenade Weekend Ghats',
    ward: 'Ward 22 - Riverside Colony & Ghats',
    reportCount: 15,
    severity: 'MEDIUM',
    commonCategory: 'plastic',
    lastReportedAt: '2026-10-04T08:30:00Z',
    latitude: 17.3700,
    longitude: 78.4630,
    description: 'Post-weekend accumulation of takeaway beverage containers and snack wrappers along the pedestrian riverfront steps and stone breakwaters.',
    resolutionRate: 86,
  },
];

export const AWARENESS_TOPICS = [
  {
    id: 'plastic',
    category: 'Plastic Waste',
    badge: 'Single-Use & Microplastics',
    whatItIs: 'Synthetic polymers derived from petrochemicals, including single-use carrier bags, PET water bottles, multilayer food wrappers, polystyrene thermocol, and straws.',
    howToDispose: 'Rinse milk pouches and food containers to remove grease before placing them in the dry-waste bin. Compact plastic bottles with lids loosened. Hand over dense hard plastics to registered local scrap dealers (kabadiwalas) for mechanical recycling.',
    commonMistakes: [
      'Throwing wet or oily plastic food delivery containers into recycling (grease contaminates entire batches).',
      'Open burning of plastic bags in winter or backyards (releases carcinogenic dioxins and furan fumes).',
      'Flushing microplastic cosmetic wipes or personal care wrappers down urban toilets.',
    ],
    practicalTips: [
      'Carry a washable canvas tote bag in your vehicle to eliminate single-use grocery plastic bags.',
      'Refuse disposable plastic cutlery and straws when ordering delivery.',
      'Participate in community plastic collection drives on Saturday mornings.',
    ],
  },
  {
    id: 'organic',
    category: 'Organic & Kitchen Waste',
    badge: 'Biodegradable Scraps',
    whatItIs: 'Biodegradable municipal waste including vegetable and fruit peelings, leftover cooked food, eggshells, coffee grounds, stale bread, and yard cuttings.',
    howToDispose: 'Keep a separate green-lidded ventilated countertop bin lined with newspaper instead of polythene bags. Hand over daily to municipal wet-waste collection or feed into a home terracotta composting pot (khamba).',
    commonMistakes: [
      'Wrapping wet food waste inside tightly knotted plastic carry bags before dumping.',
      'Mixing non-compostable tea bags containing polypropylene mesh with compost.',
      'Allowing wet waste to stagnate anaerobically for over 48 hours without ventilation.',
    ],
    practicalTips: [
      'Use dry leaves or sawdust as carbon "browns" to prevent foul smells in kitchen compost.',
      'Plan weekly grocery purchases with strict meal portions to minimize avoidable spoilage.',
      'Donate untouched banquet surplus to verified local food recovery networks within 3 hours.',
    ],
  },
  {
    id: 'e-waste',
    category: 'Electronic Waste (E-Waste)',
    badge: 'Toxic Heavy Metals & Circuits',
    whatItIs: 'End-of-life electrical equipment including broken smartphones, swollen lithium-ion power banks, motherboards, CRT/LED screens, chargers, and compact fluorescent lamps (CFLs).',
    howToDispose: 'Never put electronics into normal municipal bins. Deposit in authorized civic E-waste drop-off bins at designated post offices and electronics retail stores, or schedule an authorized e-waste pickup.',
    commonMistakes: [
      'Handing over old circuit boards to unorganized scrap burners who use acid baths over open fires.',
      'Puncturing or crushing old phone batteries in regular household trash compactors.',
      'Leaving expired alkaline cells inside corroded remote controls.',
    ],
    practicalTips: [
      'Tape battery contact terminals with non-conductive electrical tape before dropping them off.',
      'Wipe personal data via factory reset before donating or recycling smartphones.',
      'Check manufacturer take-back buyback programs during new electronics purchases.',
    ],
  },
  {
    id: 'hazardous',
    category: 'Hazardous & Medical Waste',
    badge: 'Biohazards & Corrosives',
    whatItIs: 'Pathogenic medical refuse (used needles, surgical masks, discarded medication) alongside domestic chemical hazards (battery acid, aerosol solvents, chemical pesticides, motor oil).',
    howToDispose: 'Wrap syringes and sharp lancets in puncture-resistant thick cardboard cartons clearly marked with red cross tape. Hand medical waste directly to biomedical waste collection vehicles or designated hospital collection points.',
    commonMistakes: [
      'Throwing naked insulin syringes and used razor blades loosely into public garbage bins.',
      'Flushing expired antibiotic pills and strong cough syrups down toilets, contaminating ground aquifers.',
      'Pouring synthetic motor engine oil down storm drains or road edges.',
    ],
    practicalTips: [
      'Keep a dedicated puncture-proof container for family diabetic needles and insulin lancets.',
      'Return unused sealed medicines to municipal pharmaceutical take-back kiosks.',
      'Store paint thinners and garden pesticides in their original warning-labeled containers.',
    ],
  },
];

export const AWARENESS_FAQS = [
  {
    q: 'How does SwachhDisha handle anonymous reports?',
    a: 'When you toggle "Report Anonymously", your name and phone number are completely stripped before being submitted to the municipal review queue. Only the location coordinates, waste category, severity, and photo are visible to inspecting staff.',
  },
  {
    q: 'What is the average response time for critical waste issues?',
    a: 'Critical waste reports (such as exposed biohazard clinics or chemical leaks) are escalated to zonal supervisors within 2 hours. Our municipal SLA mandates initial verification within 6 hours and containment within 24 hours.',
  },
  {
    q: 'Why does my report status change from Verified to In Progress?',
    a: '“Verified” indicates an authorized zonal inspector has visited the coordinates and confirmed the issue. “In Progress” indicates a municipal sanitation vehicle and clean-up crew have been dispatched and actively clearing the site.',
  },
  {
    q: 'How can our resident welfare association declare our colony a clean zone?',
    a: 'Neighborhoods maintaining a 90%+ prompt resolution rate and zero open dumping hotspots for 60 consecutive days receive municipal clean-ward recognition and prioritized civic sanitation resources.',
  },
];

// Safe storage wrapper for iframe and sandbox environments
const memoryCache: Record<string, string> = {};

const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // In sandboxed iframes without storage permission
    }
    return memoryCache[key] ?? null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // In sandboxed iframes without storage permission
    }
    memoryCache[key] = value;
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // In sandboxed iframes without storage permission
    }
    delete memoryCache[key];
  },
};

const STORAGE_KEYS = {
  REPORTS: 'swachhdisha_reports_v1',
  UPDATES: 'swachhdisha_updates_v1',
  AUTH: 'swachhdisha_current_user_v1',
};

export const getStoredReports = (): WasteReport[] => {
  try {
    const data = safeStorage.getItem(STORAGE_KEYS.REPORTS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to read stored reports', e);
  }
  return INITIAL_REPORTS;
};

export const saveStoredReports = (reports: WasteReport[]) => {
  try {
    safeStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  } catch (e) {
    console.error('Failed to save reports', e);
  }
};

export const getStoredUpdates = (): Record<string, ReportUpdate[]> => {
  try {
    const data = safeStorage.getItem(STORAGE_KEYS.UPDATES);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to read stored updates', e);
  }
  return INITIAL_UPDATES;
};

export const saveStoredUpdates = (updates: Record<string, ReportUpdate[]>) => {
  try {
    safeStorage.setItem(STORAGE_KEYS.UPDATES, JSON.stringify(updates));
  } catch (e) {
    console.error('Failed to save updates', e);
  }
};

export const getStoredAuthUser = (): User | null => {
  try {
    const data = safeStorage.getItem(STORAGE_KEYS.AUTH);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to read auth user', e);
  }
  // Default to citizen user for public experience
  return MOCK_USERS[1];
};

export const saveStoredAuthUser = (user: User | null) => {
  try {
    if (user) {
      safeStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
    } else {
      safeStorage.removeItem(STORAGE_KEYS.AUTH);
    }
  } catch (e) {
    console.error('Failed to save auth user', e);
  }
};
