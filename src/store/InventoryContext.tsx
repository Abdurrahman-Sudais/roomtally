import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { seedDuplicateGroups, seedItems, seedObservations, seedProperties, seedRooms } from '../data/seed';
import type {
  ActivityEntry,
  DimensionUnit,
  DuplicateGroup,
  DuplicateResolution,
  InventoryItem,
  Observation,
  Property,
  Room,
} from '../data/types';
import { DEMO_USERS, can as roleCan, userById, type Action, type AuditEntry, type DemoUser } from '../lib/access';

export interface Settings {
  organisation: string;
  defaultUnit: DimensionUnit;
  boardIncludesUnconfirmed: boolean;
}

export interface InventoryState {
  version: number;
  properties: Property[];
  rooms: Room[];
  items: InventoryItem[];
  observations: Observation[];
  duplicateGroups: DuplicateGroup[];
  activity: ActivityEntry[];
  settings: Settings;
  /** Acting demo user. */
  userId: string;
  /** Append-only record of changes made in this browser. */
  audit: AuditEntry[];
}

const STORAGE_KEY = 'roomtally.demo.v1';
const VERSION = 1;

export const initialState = (): InventoryState => ({
  version: VERSION,
  properties: seedProperties,
  rooms: seedRooms,
  items: seedItems,
  observations: seedObservations,
  duplicateGroups: seedDuplicateGroups,
  activity: [
    { id: 'a0', at: '2026-10-16T16:40:00.000Z', text: 'Survey of Meridian House imported — 3 observations flagged for duplicate review.' },
  ],
  settings: { organisation: 'Halden & Rowe LLP — Facilities', defaultUnit: 'cm', boardIncludesUnconfirmed: false },
  userId: DEMO_USERS[0]!.id,
  audit: [],
});

type Msg =
  | { type: 'saveItem'; item: InventoryItem }
  | { type: 'updateItem'; id: string; patch: Partial<InventoryItem>; note?: string }
  | { type: 'deleteItem'; id: string }
  | { type: 'resolveDuplicate'; groupId: string; resolution: Exclude<DuplicateResolution, 'pending'> }
  | { type: 'revertDuplicate'; groupId: string }
  | { type: 'saveRoom'; room: Room }
  | { type: 'settings'; patch: Partial<Settings> }
  | { type: 'reset' }
  | { type: 'user'; userId: string }
  | { type: 'audit'; entry: AuditEntry };

/** Which permission each message needs. View preferences, switching user and resetting this browser are open to everyone. */
export function permissionFor(msg: Msg): Action | null {
  switch (msg.type) {
    case 'saveItem':
    case 'updateItem':
      return 'items';
    case 'deleteItem':
      return 'delete';
    case 'resolveDuplicate':
    case 'revertDuplicate':
      return 'duplicates';
    case 'saveRoom':
      return 'rooms';
    case 'settings':
      return Object.keys(msg.patch).every((k) => k === 'boardIncludesUnconfirmed') ? null : 'settings';
    default:
      return null;
  }
}

function describe(msg: Msg): string {
  switch (msg.type) {
    case 'saveItem':
      return `${msg.item.id}: saved — ${msg.item.description}`;
    case 'updateItem':
      return `${msg.id}: ${msg.note ?? 'updated'}`;
    case 'deleteItem':
      return `${msg.id}: removed from the inventory`;
    case 'resolveDuplicate':
      return `${msg.groupId}: resolved as “${msg.resolution}”`;
    case 'revertDuplicate':
      return `${msg.groupId}: decision reversed`;
    case 'saveRoom':
      return `Room ${msg.room.code} ${msg.room.name} saved`;
    case 'settings':
      return `Settings changed: ${Object.keys(msg.patch).join(', ')}`;
    default:
      return msg.type;
  }
}

const now = () => new Date().toISOString();
const log = (state: InventoryState, text: string): ActivityEntry[] =>
  [{ id: Math.random().toString(36).slice(2), at: now(), text }, ...state.activity].slice(0, 60);

function reducer(state: InventoryState, msg: Msg): InventoryState {
  switch (msg.type) {
    case 'saveItem': {
      const exists = state.items.some((i) => i.id === msg.item.id);
      const item = { ...msg.item, updatedAt: now() };
      return {
        ...state,
        items: exists ? state.items.map((i) => (i.id === item.id ? item : i)) : [item, ...state.items],
        activity: log(state, `${exists ? 'Updated' : 'Added'} ${item.id} — ${item.description}`),
      };
    }
    case 'updateItem': {
      const target = state.items.find((i) => i.id === msg.id);
      if (!target) return state;
      return {
        ...state,
        items: state.items.map((i) => (i.id === msg.id ? { ...i, ...msg.patch, updatedAt: now() } : i)),
        activity: msg.note ? log(state, `${msg.id}: ${msg.note}`) : state.activity,
      };
    }
    case 'deleteItem':
      return {
        ...state,
        items: state.items.filter((i) => i.id !== msg.id),
        activity: log(state, `Removed ${msg.id} from the inventory`),
      };
    case 'resolveDuplicate': {
      const group = state.duplicateGroups.find((g) => g.id === msg.groupId);
      if (!group || group.resolution !== 'pending') return state;
      const itemIds = state.observations.filter((o) => group.observationIds.includes(o.id)).map((o) => o.itemId);
      const affected = state.items.filter((i) => itemIds.includes(i.id));
      if (affected.length === 0) return state;
      let items = state.items;
      let text = '';
      const stamp = now();
      if (msg.resolution === 'same') {
        const [keep, ...rest] = affected;
        const merged: InventoryItem = {
          ...keep,
          proposedQuantity: 1,
          confirmedQuantity: 1,
          status: 'confirmed',
          photoRefs: affected.flatMap((i) => i.photoRefs),
          observationIds: affected.flatMap((i) => i.observationIds),
          conditionNotes: [keep.conditionNotes, `Merged from ${rest.map((r) => r.id).join(', ')} after duplicate review ${group.id}.`]
            .filter(Boolean)
            .join(' '),
          updatedAt: stamp,
        };
        items = state.items.filter((i) => !rest.some((r) => r.id === i.id)).map((i) => (i.id === keep.id ? merged : i));
        text = `${group.id}: confirmed as one item. ${rest.map((r) => r.id).join(', ')} merged into ${keep.id}; quantity reduced from ${affected.length} to 1.`;
      } else if (msg.resolution === 'separate') {
        items = state.items.map((i) =>
          itemIds.includes(i.id) ? { ...i, confirmedQuantity: 1, status: 'confirmed', updatedAt: stamp } : i,
        );
        text = `${group.id}: kept as ${affected.length} separate items; each quantity confirmed as 1.`;
      } else {
        items = state.items.map((i) =>
          itemIds.includes(i.id)
            ? { ...i, status: 'inspection', action: 'inspect', confirmedQuantity: null, updatedAt: stamp }
            : i,
        );
        text = `${group.id}: marked for manual inspection; quantities left unconfirmed.`;
      }
      return {
        ...state,
        items,
        duplicateGroups: state.duplicateGroups.map((g) =>
          g.id === group.id ? { ...g, resolution: msg.resolution, resolvedAt: stamp, snapshot: affected } : g,
        ),
        activity: log(state, text),
      };
    }
    case 'revertDuplicate': {
      const group = state.duplicateGroups.find((g) => g.id === msg.groupId);
      if (!group?.snapshot) return state;
      const snapIds = group.snapshot.map((i) => i.id);
      const rest = state.items.filter((i) => !snapIds.includes(i.id));
      return {
        ...state,
        items: [...group.snapshot, ...rest],
        duplicateGroups: state.duplicateGroups.map((g) =>
          g.id === group.id ? { ...g, resolution: 'pending', resolvedAt: undefined, snapshot: undefined } : g,
        ),
        activity: log(state, `${group.id}: decision reversed; observations returned to review.`),
      };
    }
    case 'saveRoom': {
      const exists = state.rooms.some((r) => r.id === msg.room.id);
      return {
        ...state,
        rooms: exists ? state.rooms.map((r) => (r.id === msg.room.id ? msg.room : r)) : [...state.rooms, msg.room],
        activity: log(state, `${exists ? 'Updated' : 'Added'} room ${msg.room.code} ${msg.room.name}`),
      };
    }
    case 'settings':
      return { ...state, settings: { ...state.settings, ...msg.patch } };
    case 'reset':
      // Reset only clears this browser's demo data; keep the acting user.
      return { ...initialState(), userId: state.userId };
    case 'user':
      return { ...state, userId: msg.userId };
    case 'audit': {
      const last = state.audit[state.audit.length - 1];
      // Typing in a settings field sends one message per keystroke; collapse consecutive identical entries.
      if (last && last.userId === msg.entry.userId && last.action === msg.entry.action && last.detail === msg.entry.detail && msg.entry.action === 'settings') {
        return { ...state, audit: [...state.audit.slice(0, -1), { ...last, at: msg.entry.at }] };
      }
      return { ...state, audit: [...state.audit, msg.entry] };
    }
  }
}

function load(): InventoryState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as InventoryState;
      if (parsed.version === VERSION && Array.isArray(parsed.items))
        return { ...parsed, userId: DEMO_USERS.some((u) => u.id === parsed.userId) ? parsed.userId : DEMO_USERS[0]!.id, audit: Array.isArray(parsed.audit) ? parsed.audit : [] };
    }
  } catch {
    /* storage unavailable — fall back to seed data */
  }
  return initialState();
}

interface Ctx {
  state: InventoryState;
  /** Permission-checked dispatch: refused messages are ignored; permitted changes are written to the audit log. */
  dispatch: (msg: Msg) => boolean;
  user: DemoUser;
  can: (action: Action) => boolean;
  setUser: (userId: string) => void;
  roomById: (id: string) => Room | undefined;
  propertyById: (id: string) => Property | undefined;
  nextItemId: () => string;
}

const InventoryContext = createContext<Ctx | null>(null);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [state, rawDispatch] = useReducer(reducer, undefined, load);
  const user = userById(state.userId);
  const allowed = useCallback((a: Action) => roleCan(user.role, a), [user.role]);
  const dispatch = useCallback(
    (msg: Msg) => {
      const need = permissionFor(msg);
      if (need && !allowed(need)) return false;
      rawDispatch(msg);
      if (need) rawDispatch({ type: 'audit', entry: { id: Math.random().toString(36).slice(2), at: new Date().toISOString(), userId: user.id, action: need, detail: describe(msg) } });
      return true;
    },
    [allowed, user.id],
  );
  const setUser = useCallback((userId: string) => rawDispatch({ type: 'user', userId }), []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore quota or privacy-mode errors */
    }
  }, [state]);

  const roomById = useCallback((id: string) => state.rooms.find((r) => r.id === id), [state.rooms]);
  const propertyById = useCallback((id: string) => state.properties.find((p) => p.id === id), [state.properties]);
  const nextItemId = useCallback(() => {
    const max = state.items.reduce((m, i) => Math.max(m, Number(i.id.replace(/\D/g, '')) || 0), 0);
    return `RT-${String(Math.max(max + 1, 301)).padStart(4, '0')}`;
  }, [state.items]);

  const value = useMemo(
    () => ({ state, dispatch, user, can: allowed, setUser, roomById, propertyById, nextItemId }),
    [state, dispatch, user, allowed, setUser, roomById, propertyById, nextItemId],
  );
  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be used inside InventoryProvider');
  return ctx;
}

/** Effective quantity: confirmed if available, otherwise the proposed survey count. */
export const qty = (i: InventoryItem) => i.confirmedQuantity ?? i.proposedQuantity;
