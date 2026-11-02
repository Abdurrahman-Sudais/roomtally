/** Demo roles and people. In production these are identity-provider groups, checked again on the server. */
export type DemoRole = 'manager' | 'planner' | 'surveyor' | 'viewer';
export type Action = 'items' | 'delete' | 'duplicates' | 'rooms' | 'settings' | 'audit';

export interface DemoUser {
  id: string;
  name: string;
  title: string;
  initials: string;
  role: DemoRole;
}

/** Fictional people for the demo workspace. */
export const DEMO_USERS: DemoUser[] = [
  { id: 'u-grace', name: 'Grace Adeyemi', title: 'Facilities manager', initials: 'GA', role: 'manager' },
  { id: 'u-owen', name: 'Owen Hart', title: 'Relocation planner', initials: 'OH', role: 'planner' },
  { id: 'u-priya', name: 'Priya Nair', title: 'Site surveyor', initials: 'PN', role: 'surveyor' },
  { id: 'u-dan', name: 'Daniel Kim', title: 'Finance partner', initials: 'DK', role: 'viewer' },
];

export const ROLE_LABEL: Record<DemoRole, string> = {
  manager: 'Facilities manager',
  planner: 'Relocation planner',
  surveyor: 'Site surveyor',
  viewer: 'Viewer (read only)',
};

export const ACTION_LABEL: Record<Action, string> = {
  items: 'Add and edit items, confirm quantities, set actions',
  delete: 'Remove items from the inventory',
  duplicates: 'Resolve and reverse duplicate reviews',
  rooms: 'Add and edit rooms',
  settings: 'Change organisation settings',
  audit: 'Read and export the audit log',
};

export const ACTIONS = Object.keys(ACTION_LABEL) as Action[];

const MATRIX: Record<DemoRole, Action[]> = {
  manager: ACTIONS,
  planner: ['items', 'duplicates', 'rooms'],
  surveyor: ['items', 'rooms'],
  viewer: [],
};

export const can = (role: DemoRole, action: Action) => MATRIX[role].includes(action);
export const userById = (id: string) => DEMO_USERS.find((u) => u.id === id) ?? DEMO_USERS[0]!;

export interface AuditEntry {
  id: string;
  at: string;
  userId: string;
  action: Action;
  detail: string;
}
