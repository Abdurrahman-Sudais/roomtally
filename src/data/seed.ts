import type { DuplicateGroup, InventoryItem, Observation, Property, Room } from './types';

/**
 * Sample data for the Roomtally demonstration workspace.
 * Meridian House and Calder Yard Annex are fictional properties.
 */

export const seedProperties: Property[] = [
  {
    id: 'meridian',
    name: 'Meridian House',
    address: '42 Hanover Wharf, London EC2A 4RT',
    floors: 'Levels 3–4',
    surveyWindow: '14–16 Oct 2026',
    client: 'Halden & Rowe LLP',
  },
  {
    id: 'calder',
    name: 'Calder Yard Annex',
    address: 'Unit 6, Calder Yard, Leeds LS10 1PZ',
    floors: 'Ground floor',
    surveyWindow: '21 Oct 2026',
    client: 'Halden & Rowe LLP',
  },
];

export const seedRooms: Room[] = [
  { id: 'r301', propertyId: 'meridian', code: '3.01', name: 'Open workspace — North', floor: 'Level 3', type: 'Open plan', areaM2: 186, plan: { x: 0, y: 0, w: 11, h: 6 } },
  { id: 'r302', propertyId: 'meridian', code: '3.02', name: 'Open workspace — South', floor: 'Level 3', type: 'Open plan', areaM2: 164, plan: { x: 0, y: 8, w: 11, h: 6 } },
  { id: 'r303', propertyId: 'meridian', code: '3.03', name: 'Boardroom', floor: 'Level 3', type: 'Meeting', areaM2: 48, plan: { x: 13, y: 0, w: 6, h: 4 } },
  { id: 'r304', propertyId: 'meridian', code: '3.04', name: 'Meeting room — Kestrel', floor: 'Level 3', type: 'Meeting', areaM2: 22, plan: { x: 19, y: 0, w: 5, h: 4 } },
  { id: 'r305', propertyId: 'meridian', code: '3.05', name: 'Meeting room — Linnet', floor: 'Level 3', type: 'Meeting', areaM2: 18, plan: { x: 19, y: 4, w: 5, h: 3 } },
  { id: 'r306', propertyId: 'meridian', code: '3.06', name: 'Breakout & kitchen', floor: 'Level 3', type: 'Amenity', areaM2: 64, plan: { x: 13, y: 8, w: 7, h: 6 } },
  { id: 'r307', propertyId: 'meridian', code: '3.07', name: 'Quiet room', floor: 'Level 3', type: 'Focus', areaM2: 12, plan: { x: 20, y: 8, w: 4, h: 3 } },
  { id: 'r308', propertyId: 'meridian', code: '3.08', name: 'Storage & comms', floor: 'Level 3', type: 'Back of house', areaM2: 16, plan: { x: 20, y: 11, w: 4, h: 3 } },
  { id: 'r401', propertyId: 'meridian', code: '4.01', name: 'Reception', floor: 'Level 4', type: 'Front of house', areaM2: 38, plan: { x: 13, y: 4, w: 6, h: 3 } },
  { id: 'c101', propertyId: 'calder', code: 'G.01', name: 'Project studio', floor: 'Ground', type: 'Open plan', areaM2: 92, plan: { x: 0, y: 0, w: 14, h: 8 } },
  { id: 'c102', propertyId: 'calder', code: 'G.02', name: 'Archive store', floor: 'Ground', type: 'Back of house', areaM2: 28, plan: { x: 14, y: 0, w: 6, h: 8 } },
];

const t = '2026-10-16T16:40:00.000Z';

type ItemInput = Omit<InventoryItem, 'propertyId' | 'updatedAt' | 'observationIds' | 'actionNotes'> &
  Partial<Pick<InventoryItem, 'observationIds' | 'actionNotes'>>;

const roomProperty = (roomId: string) => seedRooms.find((r) => r.id === roomId)!.propertyId;

const item = (i: ItemInput): InventoryItem => ({
  observationIds: [],
  actionNotes: '',
  ...i,
  propertyId: roomProperty(i.roomId),
  updatedAt: t,
});

export const seedItems: InventoryItem[] = [
  item({
    id: 'RT-0101', category: 'Desk', description: 'Bench desk, 4-person, white laminate top, silver frame',
    roomId: 'r301', proposedQuantity: 6, confirmedQuantity: 6, status: 'confirmed', condition: 'good',
    conditionNotes: 'Light edge wear on two tops. Cable trays intact.',
    dimensions: { width: 280, depth: 160, height: 74, unit: 'cm', source: 'imported', verifiedBy: 'FF&E schedule rev C' },
    action: 'move', actionNotes: 'Re-plan as 3 benches per row on new Level 2.', photoRefs: ['MH-3.01-014.jpg', 'MH-3.01-015.jpg'],
  }),
  item({
    id: 'RT-0102', category: 'Task chair', description: 'Mesh task chair, black, adjustable arms',
    roomId: 'r301', proposedQuantity: 26, confirmedQuantity: 24, status: 'confirmed', condition: 'fair',
    conditionNotes: 'Two chairs with failed gas lifts reported by surveyor; counted separately under RT-0118.',
    dimensions: null, action: 'move', photoRefs: ['MH-3.01-016.jpg', 'MH-3.01-019.jpg'],
  }),
  item({
    id: 'RT-0103', category: 'Storage', description: 'Steel pedestal, 3-drawer, lockable, white',
    roomId: 'r301', proposedQuantity: 22, confirmedQuantity: null, status: 'needs-review', condition: 'unassessed',
    conditionNotes: '', dimensions: null, action: 'unassigned', photoRefs: ['MH-3.01-021.jpg'],
  }),
  item({
    id: 'RT-0104', category: 'Screen', description: 'Desk-mounted acoustic screen, grey felt',
    roomId: 'r301', proposedQuantity: 12, confirmedQuantity: 12, status: 'confirmed', condition: 'worn',
    conditionNotes: 'Fabric pilling and discolouration on most panels.',
    dimensions: { width: 1400, depth: 25, height: 450, unit: 'mm', source: 'verified-on-site', verifiedBy: 'A. Mensah' },
    action: 'refurbish', actionNotes: 'Quote requested for re-covering.', photoRefs: ['MH-3.01-022.jpg'],
  }),
  item({
    id: 'RT-0105', category: 'Desk', description: 'Bench desk, 4-person, white laminate top, silver frame',
    roomId: 'r302', proposedQuantity: 5, confirmedQuantity: null, status: 'proposed', condition: 'unassessed',
    conditionNotes: '', dimensions: null, action: 'unassigned', photoRefs: ['MH-3.02-003.jpg'],
  }),
  item({
    id: 'RT-0106', category: 'Task chair', description: 'Mesh task chair, black, adjustable arms',
    roomId: 'r302', proposedQuantity: 19, confirmedQuantity: null, status: 'needs-review', condition: 'unassessed',
    conditionNotes: '', dimensions: null, action: 'unassigned', photoRefs: ['MH-3.02-004.jpg', 'MH-3.02-007.jpg'],
  }),
  item({
    id: 'RT-0107', category: 'Desk', description: 'Electric sit-stand desk, oak veneer top, black frame',
    roomId: 'r302', proposedQuantity: 1, confirmedQuantity: null, status: 'needs-review', condition: 'good',
    conditionNotes: 'Surveyor note: controller label visible on underside.', dimensions: null, action: 'unassigned',
    photoRefs: ['MH-3.02-011.jpg'], observationIds: ['OBS-2231'],
  }),
  item({
    id: 'RT-0108', category: 'Desk', description: 'Electric sit-stand desk, oak veneer top, black frame',
    roomId: 'r302', proposedQuantity: 1, confirmedQuantity: null, status: 'needs-review', condition: 'good',
    conditionNotes: '', dimensions: null, action: 'unassigned', photoRefs: ['MH-3.02-012.jpg'], observationIds: ['OBS-2232'],
  }),
  item({
    id: 'RT-0109', category: 'Desk', description: 'Electric sit-stand desk, oak veneer top, black frame',
    roomId: 'r307', proposedQuantity: 1, confirmedQuantity: null, status: 'needs-review', condition: 'unassessed',
    conditionNotes: '', dimensions: null, action: 'unassigned', photoRefs: ['MH-3.07-002.jpg'], observationIds: ['OBS-2247'],
  }),
  item({
    id: 'RT-0110', category: 'Meeting table', description: 'Boardroom table, walnut veneer, 2-piece with power modules',
    roomId: 'r303', proposedQuantity: 1, confirmedQuantity: 1, status: 'confirmed', condition: 'good',
    conditionNotes: 'Minor scratch near centre seam. Power modules tested by client IT.',
    dimensions: { width: 480, depth: 140, height: 74, unit: 'cm', source: 'verified-on-site', verifiedBy: 'A. Mensah' },
    action: 'move', actionNotes: 'Requires two-person lift and disassembly. Book specialist crew.', photoRefs: ['MH-3.03-001.jpg', 'MH-3.03-002.jpg'],
  }),
  item({
    id: 'RT-0111', category: 'Meeting chair', description: 'Upholstered meeting chair, charcoal wool, chrome base',
    roomId: 'r303', proposedQuantity: 14, confirmedQuantity: 14, status: 'confirmed', condition: 'good',
    conditionNotes: '', dimensions: null, action: 'move', photoRefs: ['MH-3.03-003.jpg'],
  }),
  item({
    id: 'RT-0112', category: 'Meeting table', description: 'Rectangular meeting table, white laminate, 6-seat',
    roomId: 'r304', proposedQuantity: 1, confirmedQuantity: 1, status: 'confirmed', condition: 'fair',
    conditionNotes: 'Chipped laminate on one corner.', dimensions: null, action: 'donate',
    actionNotes: 'Offered to Southwark community hub — awaiting reply.', photoRefs: ['MH-3.04-001.jpg'],
  }),
  item({
    id: 'RT-0113', category: 'Meeting chair', description: 'Stackable meeting chair, polypropylene, grey',
    roomId: 'r304', proposedQuantity: 6, confirmedQuantity: 6, status: 'confirmed', condition: 'fair',
    conditionNotes: '', dimensions: null, action: 'donate', photoRefs: ['MH-3.04-002.jpg'],
  }),
  item({
    id: 'RT-0114', category: 'Meeting table', description: 'Round meeting table, Ø 1000, white',
    roomId: 'r305', proposedQuantity: 1, confirmedQuantity: null, status: 'proposed', condition: 'unassessed',
    conditionNotes: '', dimensions: null, action: 'unassigned', photoRefs: ['MH-3.05-001.jpg'],
  }),
  item({
    id: 'RT-0115', category: 'Soft seating', description: 'Two-seat sofa, teal fabric',
    roomId: 'r306', proposedQuantity: 3, confirmedQuantity: 3, status: 'confirmed', condition: 'worn',
    conditionNotes: 'Seat cushions compressed; staining on arm of one unit.', dimensions: null, action: 'refurbish',
    photoRefs: ['MH-3.06-004.jpg', 'MH-3.06-005.jpg'],
  }),
  item({
    id: 'RT-0116', category: 'Lounge table', description: 'Poseur table, high, birch ply',
    roomId: 'r306', proposedQuantity: 4, confirmedQuantity: 4, status: 'confirmed', condition: 'good',
    conditionNotes: '', dimensions: { width: 120, depth: 70, height: 105, unit: 'cm', source: 'entered' },
    action: 'move', photoRefs: ['MH-3.06-006.jpg'],
  }),
  item({
    id: 'RT-0117', category: 'Kitchen', description: 'Freestanding fridge, under-counter',
    roomId: 'r306', proposedQuantity: 2, confirmedQuantity: 2, status: 'confirmed', condition: 'fair',
    conditionNotes: 'Landlord asset per lease schedule — confirm before removal.', dimensions: null, action: 'retain',
    actionNotes: 'Stays with building.', photoRefs: ['MH-3.06-009.jpg'],
  }),
  item({
    id: 'RT-0118', category: 'Task chair', description: 'Mesh task chair, black — failed gas lift',
    roomId: 'r308', proposedQuantity: 2, confirmedQuantity: 2, status: 'confirmed', condition: 'damaged',
    conditionNotes: 'Chair drops under load. Not safe for use.', dimensions: null, action: 'dispose',
    actionNotes: 'WEEE-compliant recycler; gas cylinders separated.', photoRefs: ['MH-3.08-002.jpg'],
  }),
  item({
    id: 'RT-0119', category: 'Storage', description: 'Tambour cupboard, full height, white',
    roomId: 'r308', proposedQuantity: 4, confirmedQuantity: 4, status: 'confirmed', condition: 'fair',
    conditionNotes: 'One tambour door sticking.', dimensions: { width: 1000, depth: 470, height: 1980, unit: 'mm', source: 'imported', verifiedBy: 'FF&E schedule rev C' },
    action: 'inspect', actionNotes: 'Check if fixed to wall before quoting removal.', photoRefs: ['MH-3.08-003.jpg'],
  }),
  item({
    id: 'RT-0120', category: 'Soft seating', description: 'Reception lounge chair, tan leather',
    roomId: 'r401', proposedQuantity: 4, confirmedQuantity: 4, status: 'confirmed', condition: 'good',
    conditionNotes: '', dimensions: null, action: 'move', photoRefs: ['MH-4.01-001.jpg'],
  }),
  item({
    id: 'RT-0121', category: 'Desk', description: 'Reception counter, curved, Corian top',
    roomId: 'r401', proposedQuantity: 1, confirmedQuantity: 1, status: 'inspection', condition: 'unassessed',
    conditionNotes: 'Appears built-in. Surveyor unable to confirm fixings.', dimensions: null, action: 'inspect',
    photoRefs: ['MH-4.01-002.jpg'],
  }),
  item({
    id: 'RT-0122', category: 'Equipment', description: 'Wall-mounted display, 65", with bracket',
    roomId: 'r303', proposedQuantity: 1, confirmedQuantity: null, status: 'proposed', condition: 'unassessed',
    conditionNotes: '', dimensions: null, action: 'unassigned', photoRefs: ['MH-3.03-004.jpg'],
  }),
  item({
    id: 'RT-0123', category: 'Soft seating', description: 'Focus pod armchair, high back, grey',
    roomId: 'r307', proposedQuantity: 2, confirmedQuantity: 2, status: 'confirmed', condition: 'good',
    conditionNotes: '', dimensions: null, action: 'move', photoRefs: ['MH-3.07-001.jpg'],
  }),
  item({
    id: 'RT-0201', category: 'Desk', description: 'Drafting table, tilting top, beech',
    roomId: 'c101', proposedQuantity: 4, confirmedQuantity: 4, status: 'confirmed', condition: 'worn',
    conditionNotes: 'Tilt mechanisms stiff on two units.', dimensions: null, action: 'refurbish', photoRefs: ['CY-G.01-003.jpg'],
  }),
  item({
    id: 'RT-0202', category: 'Storage', description: 'Plan chest, 5-drawer, steel, A0',
    roomId: 'c102', proposedQuantity: 3, confirmedQuantity: null, status: 'needs-review', condition: 'unassessed',
    conditionNotes: '', dimensions: null, action: 'unassigned', photoRefs: ['CY-G.02-001.jpg'],
  }),
  item({
    id: 'RT-0203', category: 'Storage', description: 'Steel shelving bay, 5-tier, grey',
    roomId: 'c102', proposedQuantity: 8, confirmedQuantity: 8, status: 'confirmed', condition: 'fair',
    conditionNotes: '', dimensions: null, action: 'donate', photoRefs: ['CY-G.02-002.jpg'],
  }),
];

export const seedObservations: Observation[] = [
  {
    id: 'OBS-2231',
    photoRef: 'MH-3.02-011.jpg',
    roomId: 'r302',
    location: 'Level 3 · Room 3.02 · Bay C, window side',
    takenAt: '2026-10-14T10:12:00.000Z',
    surveyor: 'A. Mensah',
    details: [
      { label: 'Top finish', value: 'Oak veneer' },
      { label: 'Frame', value: 'Black, twin column' },
      { label: 'Controller', value: 'Label partially visible: "…4471"' },
      { label: 'Asset tag', value: 'Not visible in photograph' },
      { label: 'Surveyor note', value: 'Monitor arm attached, left side' },
    ],
    itemId: 'RT-0107',
    crop: '42% 62%',
  },
  {
    id: 'OBS-2232',
    photoRef: 'MH-3.02-012.jpg',
    roomId: 'r302',
    location: 'Level 3 · Room 3.02 · Bay C, viewed from corridor',
    takenAt: '2026-10-14T10:14:00.000Z',
    surveyor: 'A. Mensah',
    details: [
      { label: 'Top finish', value: 'Oak veneer' },
      { label: 'Frame', value: 'Black, twin column' },
      { label: 'Controller', value: 'Not visible' },
      { label: 'Asset tag', value: 'Not visible in photograph' },
      { label: 'Surveyor note', value: 'Monitor arm attached, left side' },
    ],
    itemId: 'RT-0108',
    crop: '18% 70%',
  },
  {
    id: 'OBS-2247',
    photoRef: 'MH-3.07-002.jpg',
    roomId: 'r307',
    location: 'Level 3 · Room 3.07 · Quiet room',
    takenAt: '2026-10-15T14:52:00.000Z',
    surveyor: 'J. Okafor',
    details: [
      { label: 'Top finish', value: 'Oak veneer' },
      { label: 'Frame', value: 'Black, twin column' },
      { label: 'Controller', value: 'Label visible: "SD-4471"' },
      { label: 'Asset tag', value: 'Not visible in photograph' },
      { label: 'Surveyor note', value: 'Desk appears recently moved — floor marks at 3.02 Bay C' },
    ],
    itemId: 'RT-0109',
    crop: '80% 66%',
  },
];

export const seedDuplicateGroups: DuplicateGroup[] = [
  {
    id: 'DG-014',
    title: 'Electric sit-stand desk, oak veneer top',
    observationIds: ['OBS-2231', 'OBS-2232', 'OBS-2247'],
    suggestedRelationship: 'Possibly one physical desk photographed three times',
    rationale: [
      'All three observations describe the same finish, frame type, and monitor arm position.',
      'OBS-2231 and OBS-2232 were taken two minutes apart in the same bay from different angles.',
      'Controller label fragment "…4471" in OBS-2231 is consistent with "SD-4471" in OBS-2247.',
      'OBS-2247 was taken a day later in a different room; the surveyor noted the desk may have been moved.',
      'No asset tag is visible in any photograph, so the relationship cannot be confirmed from records.',
    ],
    resolution: 'pending',
  },
];
