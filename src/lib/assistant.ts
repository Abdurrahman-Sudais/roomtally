/**
 * Simulated, record-grounded assistant for the demo workspace.
 * Answers only from current inventory, rooms and duplicate reviews, and lists the records it used.
 * Refuses to value furniture or estimate dimensions or fit — those need people and measurements.
 * No model or external API is called.
 */
import { ACTION_LABEL, CONDITION_LABEL, STATUS_LABEL, type Action, type DuplicateGroup, type InventoryItem, type Property, type Room } from '../data/types';

export interface AssistantContext {
  items: InventoryItem[];
  rooms: Room[];
  properties: Property[];
  duplicateGroups: DuplicateGroup[];
}

export interface AssistantAnswer {
  kind: 'answer' | 'refusal' | 'help';
  title: string;
  lines: string[];
  sources: string[];
  links: { label: string; to: string }[];
}

export const EXAMPLE_QUESTIONS = ['What still needs review?', 'Summarise the relocation plan', 'What is in room 3.01?', 'Which items have no verified dimensions?', 'What is RT-0101 worth?'] as const;

const REFUSAL_RE = /\b(worth|value|valuation|resale|price|sell for|how much (is|are|would|could)|estimate (the )?(size|dimension|width|height|depth)|will (it|they) fit|guess)\b/i;

const REFUSAL: AssistantAnswer = {
  kind: 'refusal',
  title: 'That needs a person, not a guess',
  lines: [
    'Roomtally records what you have, its condition and the action you choose. It does not value furniture or estimate resale prices, and it never estimates dimensions or fit from photographs.',
    'I can show the recorded condition, verified dimensions (where measured) and the proposed action for any item.',
  ],
  sources: [],
  links: [{ label: 'Open the inventory', to: '/inventory/items' }],
};

const qtyOf = (i: InventoryItem) => i.confirmedQuantity ?? i.proposedQuantity;

function roomSummary(r: Room, c: AssistantContext): AssistantAnswer {
  const its = c.items.filter((i) => i.roomId === r.id);
  const total = its.reduce((n, i) => n + qtyOf(i), 0);
  return {
    kind: 'answer',
    title: `Room ${r.code} · ${r.name}`,
    lines: [
      `${r.type}, ${r.floor}, ${r.areaM2} m². ${its.length} record${its.length === 1 ? '' : 's'}, ${total} piece${total === 1 ? '' : 's'} in total.`,
      ...its.map((i) => `${i.id}: ${i.description} × ${qtyOf(i)}${i.confirmedQuantity === null ? ' (proposed)' : ''} — ${CONDITION_LABEL[i.condition].toLowerCase()}, ${ACTION_LABEL[i.action].toLowerCase()}.`),
    ],
    sources: [r.code, ...its.map((i) => i.id)],
    links: [{ label: 'Open rooms', to: '/inventory/rooms' }],
  };
}

function itemSummary(i: InventoryItem, c: AssistantContext): AssistantAnswer {
  const room = c.rooms.find((r) => r.id === i.roomId);
  const d = i.dimensions;
  return {
    kind: 'answer',
    title: `${i.id} · ${i.description}`,
    lines: [
      `${room ? `Room ${room.code} ${room.name}` : 'Room not recorded'}. Quantity ${qtyOf(i)}${i.confirmedQuantity === null ? ' (proposed, not yet confirmed)' : ' (confirmed)'}; ${STATUS_LABEL[i.status].toLowerCase()}.`,
      `Condition: ${CONDITION_LABEL[i.condition].toLowerCase()}${i.conditionNotes ? ` — ${i.conditionNotes}` : ''}.`,
      d ? `Dimensions: ${d.width} × ${d.depth} × ${d.height} ${d.unit} (recorded).` : 'Dimensions not verified — they are only ever entered or measured, never estimated.',
      `Proposed action: ${ACTION_LABEL[i.action].toLowerCase()}${i.actionNotes ? ` — ${i.actionNotes}` : ''}.`,
    ],
    sources: [i.id, ...(room ? [room.code] : [])],
    links: [{ label: 'Open the inventory', to: `/inventory/items?q=${encodeURIComponent(i.id)}` }],
  };
}

function review(c: AssistantContext): AssistantAnswer {
  const pendingDup = c.duplicateGroups.filter((g) => g.resolution === 'pending');
  const unconfirmed = c.items.filter((i) => i.confirmedQuantity === null);
  const inspect = c.items.filter((i) => i.status === 'inspection');
  return {
    kind: 'answer',
    title: `${pendingDup.length + unconfirmed.length} thing${pendingDup.length + unconfirmed.length === 1 ? '' : 's'} still need review`,
    lines: [
      ...pendingDup.map((g) => `${g.id}: ${g.title} — duplicate review pending.`),
      `${unconfirmed.length} record${unconfirmed.length === 1 ? ' has' : 's have'} a proposed quantity that nobody has confirmed${unconfirmed.length ? `: ${unconfirmed.slice(0, 8).map((i) => i.id).join(', ')}${unconfirmed.length > 8 ? '…' : ''}` : ''}.`,
      ...(inspect.length ? [`${inspect.length} marked for on-site inspection: ${inspect.map((i) => i.id).join(', ')}.`] : []),
    ],
    sources: [...pendingDup.map((g) => g.id), ...unconfirmed.slice(0, 8).map((i) => i.id)],
    links: [{ label: 'Open duplicate review', to: '/inventory/duplicates' }, { label: 'Open the inventory', to: '/inventory/items' }],
  };
}

function plan(c: AssistantContext): AssistantAnswer {
  const by = new Map<Action, number>();
  for (const i of c.items) by.set(i.action, (by.get(i.action) ?? 0) + qtyOf(i));
  const rows = [...by.entries()].sort((a, b) => b[1] - a[1]);
  const total = rows.reduce((n, [, v]) => n + v, 0);
  return {
    kind: 'answer',
    title: `Relocation plan: ${total} pieces across ${c.items.length} records`,
    lines: rows.map(([a, v]) => `${ACTION_LABEL[a]}: ${v} piece${v === 1 ? '' : 's'} (${Math.round((v / Math.max(total, 1)) * 100)}%).`),
    sources: ['inventory'],
    links: [{ label: 'Open the relocation plan', to: '/inventory/plan' }],
  };
}

function noDimensions(c: AssistantContext): AssistantAnswer {
  const rows = c.items.filter((i) => !i.dimensions);
  return {
    kind: 'answer',
    title: rows.length ? `${rows.length} record${rows.length === 1 ? ' has' : 's have'} no verified dimensions` : 'Every record has verified dimensions',
    lines: rows.slice(0, 12).map((i) => `${i.id}: ${i.description}.`).concat(rows.length > 12 ? [`…and ${rows.length - 12} more.`] : []),
    sources: rows.slice(0, 12).map((i) => i.id),
    links: [{ label: 'Open the inventory', to: '/inventory/items' }],
  };
}

const HELP: AssistantAnswer = {
  kind: 'help',
  title: 'What I can answer',
  lines: ['Ask about an item (for example “RT-0101”) or a room (“room 3.01”), what still needs review, the relocation plan, or which items have no verified dimensions.', 'I answer from the records in this workspace and list the ones I used.'],
  sources: [],
  links: [],
};

export function answer(question: string, c: AssistantContext): AssistantAnswer {
  const q = question.trim();
  if (!q) return HELP;
  if (REFUSAL_RE.test(q)) return REFUSAL;
  const id = q.toUpperCase().match(/\bRT-\d{4}\b/)?.[0];
  if (id) {
    const i = c.items.find((x) => x.id === id);
    return i ? itemSummary(i, c) : { kind: 'answer', title: `No record called ${id}`, lines: ['That ID is not in this workspace.'], sources: [], links: [{ label: 'Open the inventory', to: '/inventory/items' }] };
  }
  const code = q.match(/\broom\s+([0-9]+\.[0-9]+)\b/i)?.[1] ?? q.match(/\b([0-9]\.[0-9]{2})\b/)?.[1];
  if (code) {
    const r = c.rooms.find((x) => x.code === code);
    if (r) return roomSummary(r, c);
  }
  if (/\b(dimension|measure|size|unverified)/i.test(q)) return noDimensions(c);
  if (/\b(plan|relocation|move|dispose|donate|refurbish|retain|summar)/i.test(q)) return plan(c);
  if (/\b(review|duplicate|confirm|pending|attention|inspect)/i.test(q)) return review(c);
  return HELP;
}
