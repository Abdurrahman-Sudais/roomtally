export type Category =
  | 'Desk'
  | 'Task chair'
  | 'Meeting table'
  | 'Meeting chair'
  | 'Storage'
  | 'Soft seating'
  | 'Screen'
  | 'Lounge table'
  | 'Kitchen'
  | 'Equipment';

export const CATEGORIES: Category[] = [
  'Desk',
  'Task chair',
  'Meeting table',
  'Meeting chair',
  'Storage',
  'Soft seating',
  'Screen',
  'Lounge table',
  'Kitchen',
  'Equipment',
];

export type SurveyStatus = 'proposed' | 'needs-review' | 'confirmed' | 'inspection';
export const STATUSES: SurveyStatus[] = ['proposed', 'needs-review', 'confirmed', 'inspection'];
export const STATUS_LABEL: Record<SurveyStatus, string> = {
  proposed: 'Proposed',
  'needs-review': 'Review required',
  confirmed: 'Confirmed',
  inspection: 'Manual inspection',
};

export type Condition = 'unassessed' | 'good' | 'fair' | 'worn' | 'damaged';
export const CONDITIONS: Condition[] = ['unassessed', 'good', 'fair', 'worn', 'damaged'];
export const CONDITION_LABEL: Record<Condition, string> = {
  unassessed: 'Not yet assessed',
  good: 'Good',
  fair: 'Fair',
  worn: 'Worn',
  damaged: 'Damaged',
};

export type Action = 'unassigned' | 'move' | 'retain' | 'refurbish' | 'donate' | 'inspect' | 'dispose';
export const ACTIONS: Action[] = ['unassigned', 'move', 'retain', 'refurbish', 'donate', 'inspect', 'dispose'];
export const ACTION_LABEL: Record<Action, string> = {
  unassigned: 'Unassigned',
  move: 'Move',
  retain: 'Retain in place',
  refurbish: 'Refurbish',
  donate: 'Donate',
  inspect: 'Inspect',
  dispose: 'Dispose',
};

export type DimensionUnit = 'cm' | 'mm';
export type DimensionSource = 'entered' | 'imported' | 'verified-on-site';
export const DIMENSION_SOURCE_LABEL: Record<DimensionSource, string> = {
  entered: 'Entered by user',
  imported: 'Imported from schedule',
  'verified-on-site': 'Measured on site',
};

export interface Dimensions {
  width: number;
  depth: number;
  height: number;
  unit: DimensionUnit;
  source: DimensionSource;
  verifiedBy?: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  floors: string;
  surveyWindow: string;
  client: string;
}

export interface Room {
  id: string;
  propertyId: string;
  code: string;
  name: string;
  floor: string;
  type: string;
  /** Net area from the supplied floor plan, m². */
  areaM2: number;
  /** Position on the schematic floor plan (grid units). */
  plan: { x: number; y: number; w: number; h: number };
}

export interface InventoryItem {
  id: string;
  category: Category;
  description: string;
  propertyId: string;
  roomId: string;
  /** Count proposed from survey observations. */
  proposedQuantity: number;
  /** Count confirmed by a reviewer; null until confirmed. */
  confirmedQuantity: number | null;
  status: SurveyStatus;
  condition: Condition;
  conditionNotes: string;
  dimensions: Dimensions | null;
  action: Action;
  actionNotes: string;
  photoRefs: string[];
  observationIds: string[];
  updatedAt: string;
}

export interface Observation {
  id: string;
  photoRef: string;
  roomId: string;
  location: string;
  takenAt: string;
  surveyor: string;
  details: { label: string; value: string }[];
  itemId: string;
  /** Visual crop of the sample photograph used for the demo. */
  crop: string;
}

export type DuplicateResolution = 'pending' | 'same' | 'separate' | 'inspection';

export interface DuplicateGroup {
  id: string;
  title: string;
  observationIds: string[];
  suggestedRelationship: string;
  rationale: string[];
  resolution: DuplicateResolution;
  resolvedAt?: string;
  /** Snapshot of the items before resolution so the decision can be reversed. */
  snapshot?: InventoryItem[];
}

export interface ActivityEntry {
  id: string;
  at: string;
  text: string;
}
