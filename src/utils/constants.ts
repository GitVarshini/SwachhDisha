import { REPORT_STATUS, REPORT_SEVERITY, WasteCategory } from '../types';

export { REPORT_STATUS, REPORT_SEVERITY };

export const WASTE_CATEGORIES: WasteCategory[] = [
  {
    id: 'plastic',
    name: 'Plastic Waste',
    description: 'Single-use packaging, PET bottles, microplastics, polythene bags, and non-biodegradable polymer dumps.',
    iconName: 'Package',
    color: '#0284c7', // Sky blue
  },
  {
    id: 'organic',
    name: 'Organic Waste',
    description: 'Rotting food scraps, kitchen refuse, market vegetable waste, leaf litter, and garden organic matter.',
    iconName: 'Apple',
    color: '#16a34a', // Emerald green
  },
  {
    id: 'e-waste',
    name: 'E-Waste',
    description: 'Discarded electronics, circuit boards, rechargeable lithium cells, broken peripherals, and cables.',
    iconName: 'Cpu',
    color: '#9333ea', // Purple
  },
  {
    id: 'construction',
    name: 'Construction Waste',
    description: 'Demolition debris, broken tiles, cement slurry, rubble, bricks, and drywall blocking rights of way.',
    iconName: 'Hammer',
    color: '#d97706', // Amber
  },
  {
    id: 'medical',
    name: 'Medical Waste',
    description: 'Contaminated syringes, used PPE, surgical gloves, ampoules, pharmaceutical blister packs, and biohazards.',
    iconName: 'Cross',
    color: '#e11d48', // Rose red
  },
  {
    id: 'hazardous',
    name: 'Hazardous Waste',
    description: 'Corrosive chemicals, industrial solvents, battery acids, pesticide cans, and toxic compounds.',
    iconName: 'AlertTriangle',
    color: '#dc2626', // Red
  },
  {
    id: 'mixed',
    name: 'Mixed Waste',
    description: 'Unsegregated roadside heap containing domestic, commercial, and dry rubbish in open public drains.',
    iconName: 'Trash2',
    color: '#64748b', // Slate
  },
];

export const CITY_WARDS = [
  'Ward 4 - Green Park & University',
  'Ward 7 - Metro Junction & Market',
  'Ward 12 - Civic Center & Bus Stand',
  'Ward 15 - Old Bazaar & Textile Row',
  'Ward 18 - Industrial Belt & Warehouses',
  'Ward 22 - Riverside Colony & Ghats',
];

export const DEFAULT_MAP_CENTER: [number, number] = [17.3850, 78.4867]; // Hyderabad central coordinates
export const DEFAULT_MAP_ZOOM = 13;

export const STATUS_CONFIG = {
  [REPORT_STATUS.PENDING]: {
    label: 'Pending Review',
    color: 'text-amber-700 bg-amber-50 border-amber-200',
    dotColor: 'bg-amber-500',
    description: 'Citizen report received, awaiting admin verification',
  },
  [REPORT_STATUS.VERIFIED]: {
    label: 'Verified',
    color: 'text-blue-700 bg-blue-50 border-blue-200',
    dotColor: 'bg-blue-500',
    description: 'Verified by municipality inspection team',
  },
  [REPORT_STATUS.IN_PROGRESS]: {
    label: 'In Progress',
    color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    dotColor: 'bg-indigo-500',
    description: 'Clean-up crew dispatched and clearing underway',
  },
  [REPORT_STATUS.RESOLVED]: {
    label: 'Resolved',
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    dotColor: 'bg-emerald-500',
    description: 'Site cleared, sanitized, and verified resolved',
  },
  [REPORT_STATUS.REJECTED]: {
    label: 'Rejected',
    color: 'text-rose-700 bg-rose-50 border-rose-200',
    dotColor: 'bg-rose-500',
    description: 'Duplicate report, out of municipal jurisdiction, or invalid entry',
  },
};

export const SEVERITY_CONFIG = {
  [REPORT_SEVERITY.LOW]: {
    label: 'Low',
    color: 'text-slate-700 bg-slate-100 border-slate-200',
    markerColor: '#64748b',
    border: '#475569',
  },
  [REPORT_SEVERITY.MEDIUM]: {
    label: 'Medium',
    color: 'text-amber-800 bg-amber-100 border-amber-300',
    markerColor: '#f59e0b',
    border: '#d97706',
  },
  [REPORT_SEVERITY.HIGH]: {
    label: 'High',
    color: 'text-orange-800 bg-orange-100 border-orange-300',
    markerColor: '#ea580c',
    border: '#c2410c',
  },
  [REPORT_SEVERITY.CRITICAL]: {
    label: 'Critical',
    color: 'text-rose-800 bg-rose-100 border-rose-300',
    markerColor: '#e11d48',
    border: '#be123c',
  },
};
