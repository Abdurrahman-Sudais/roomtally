import type { InventoryItem, Property, Room } from '../data/types';
import { ACTION_LABEL, CONDITION_LABEL, DIMENSION_SOURCE_LABEL, STATUS_LABEL } from '../data/types';

const escape = (v: unknown) => {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function inventoryToCsv(items: InventoryItem[], rooms: Room[], properties: Property[]): string {
  const header = [
    'Item ID', 'Category', 'Description', 'Property', 'Room code', 'Room', 'Proposed quantity',
    'Confirmed quantity', 'Survey status', 'Condition', 'Condition notes', 'Width', 'Depth', 'Height',
    'Unit', 'Dimension source', 'Proposed action', 'Action notes', 'Photograph references', 'Last updated',
  ];
  const rows = items.map((i) => {
    const room = rooms.find((r) => r.id === i.roomId);
    const property = properties.find((p) => p.id === i.propertyId);
    const d = i.dimensions;
    return [
      i.id, i.category, i.description, property?.name, room?.code, room?.name, i.proposedQuantity,
      i.confirmedQuantity ?? '', STATUS_LABEL[i.status], CONDITION_LABEL[i.condition], i.conditionNotes,
      d?.width ?? '', d?.depth ?? '', d?.height ?? '', d?.unit ?? '', d ? DIMENSION_SOURCE_LABEL[d.source] : '',
      ACTION_LABEL[i.action], i.actionNotes, i.photoRefs.join(' | '), i.updatedAt,
    ].map(escape).join(',');
  });
  return [header.map(escape).join(','), ...rows].join('\r\n');
}

export function downloadCsv(filename: string, csv: string) {
  // BOM so spreadsheet tools read UTF-8 correctly.
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
