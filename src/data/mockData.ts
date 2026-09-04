export type TriageLevel = 'RED' | 'YELLOW' | 'GREEN' | 'BLACK';

export interface Vitals {
  hr: number;
  spo2: number;
  bpSys: number;
  bpDia: number;
  gcs: number;
}

export interface Patient {
  id: string;
  ambulance: string;
  eta: number;
  age: number;
  sex: 'Male' | 'Female';
  triage: TriageLevel;
  complaint: string;
  vitals: Vitals;
  alert?: string;
  sceneNotes: string[];
}

export type ResourceState = 'READY' | 'REQUESTED' | 'CONFIRMED';

export interface ResourceItem {
  id: string;
  icon: string;
  label: string;
  action: string;
  state: ResourceState;
}

export type ReportStatus = 'pending' | 'processing' | 'complete';

export interface ReportStep {
  label: string;
  done: boolean;
}

export interface ActivityEntry {
  time: string;
  text: string;
  level: 'info' | 'critical' | 'warn' | 'success';
}

export const PATIENTS: Patient[] = [
  {
    id: 'AP-8842',
    ambulance: 'Ambulance #04',
    eta: 8,
    age: 28,
    sex: 'Male',
    triage: 'RED',
    complaint: 'Trauma — MVA, internal hemorrhage suspected',
    vitals: { hr: 115, spo2: 88, bpSys: 90, bpDia: 60, gcs: 9 },
    alert: 'Silent Hypoxia & Internal Hemorrhage Suspected',
    sceneNotes: [
      'Severe trauma mechanism detected.',
      'Possible arterial hemorrhage indicators.',
      'High-risk blunt trauma suspected.',
    ],
  },
  {
    id: 'AP-7712',
    ambulance: 'Ambulance #09',
    eta: 19,
    age: 58,
    sex: 'Female',
    triage: 'YELLOW',
    complaint: 'Chest Pain',
    vitals: { hr: 82, spo2: 97, bpSys: 130, bpDia: 85, gcs: 15 },
    sceneNotes: ['Patient conscious and oriented.', 'Stable vitals on scene.'],
  },
  {
    id: 'AP-6601',
    ambulance: 'Ambulance #12',
    eta: 26,
    age: 45,
    sex: 'Male',
    triage: 'GREEN',
    complaint: 'Laceration — left forearm',
    vitals: { hr: 78, spo2: 98, bpSys: 122, bpDia: 80, gcs: 15 },
    sceneNotes: ['Minor laceration, bleeding controlled.'],
  },
  {
    id: 'AP-9034',
    ambulance: 'Ambulance #15',
    eta: 0,
    age: 67,
    sex: 'Female',
    triage: 'BLACK',
    complaint: 'Cardiac arrest — DOA',
    vitals: { hr: 0, spo2: 0, bpSys: 0, bpDia: 0, gcs: 3 },
    sceneNotes: ['Deceased on arrival.'],
  },
];

export const INITIAL_RESOURCES: ResourceItem[] = [
  { id: 'icu', icon: 'BedDouble', label: 'ICU', action: 'Reserve ICU Bed #04', state: 'READY' },
  { id: 'blood', icon: 'Droplets', label: 'Blood', action: 'Request 2 Units O-Negative Blood', state: 'READY' },
  { id: 'radiology', icon: 'ScanLine', label: 'Radiology', action: 'Reserve Emergency CT Slot', state: 'READY' },
  { id: 'respiratory', icon: 'Wind', label: 'Respiratory', action: 'Prepare Ventilator + Intubation Kit', state: 'READY' },
  { id: 'specialist', icon: 'Brain', label: 'Specialist', action: 'Alert On-Call Neurosurgeon', state: 'READY' },
];

export const INITIAL_FACILITIES = [
  { id: 'icu-bed', icon: 'BedDouble', label: 'Assign ICU Bed #04', available: 1, total: 6, assigned: false },
  { id: 'trauma-bay', icon: 'Building2', label: 'Reserve Trauma Bay #01', available: 2, total: 4, assigned: false },
  { id: 'or', icon: 'Stethoscope', label: 'Queue Operating Room #02', available: 1, total: 3, assigned: false },
];

export const RAD_REPORT_STEPS: ReportStep[] = [
  { label: 'Request Sent', done: true },
  { label: 'Scan Started', done: true },
  { label: 'Analysis', done: false },
  { label: 'Report Generated', done: false },
];

export const LAB_REPORT_STEPS: ReportStep[] = [
  { label: 'Sample Received', done: true },
  { label: 'Testing', done: false },
  { label: 'Report Generated', done: false },
];

export const INITIAL_ACTIVITY: ActivityEntry[] = [
  { time: '09:12 AM', text: 'Paramedic updated SpO₂ to 88%.', level: 'warn' },
  { time: '09:13 AM', text: 'AyuPulse detected rapid oxygen saturation decline.', level: 'critical' },
  { time: '09:14 AM', text: 'Doctor opened Patient #AP-8842.', level: 'info' },
  { time: '09:14 AM', text: 'O-Negative blood request prepared.', level: 'info' },
  { time: '09:15 AM', text: 'Emergency CT slot requested.', level: 'info' },
];
