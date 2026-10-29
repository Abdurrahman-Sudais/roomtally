import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check, Download, Filter, Plus, Search, X } from 'lucide-react';
import { ConditionText, StatusTag, Toast } from '../components/ui';
import {
  ACTION_LABEL, ACTIONS, CATEGORIES, CONDITION_LABEL, CONDITIONS, STATUS_LABEL, STATUSES, type Action, type InventoryItem,
} from '../data/types';
import { downloadCsv, inventoryToCsv } from '../lib/csv';
import { useInventory } from '../store/InventoryContext';
import { PageTitle } from './AppLayout';
import { blankItem, ItemEditor } from './ItemEditor';

const FILTER_KEYS = ['property', 'room', 'category', 'condition', 'status', 'action'] as const;
type FilterKey = (typeof FILTER_KEYS)[number];

export default function InventoryPage() {
  const { state, dispatch, roomById, nextItemId } = useInventory();
  const [params, setParams] = useSearchParams();
  const [editing, setEditing] = useState<{ item: InventoryItem; isNew: boolean } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const q = params.get('q') ?? '';
  const f = Object.fromEntries(FILTER_KEYS.map((k) => [k, params.get(k) ?? ''])) as Record<FilterKey, string>;
  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v);
    else next.delete(k);
    if (k === 'property') next.delete('room');
    setParams(next, { replace: true });
  };
  const activeCount = FILTER_KEYS.filter((k) => f[k]).length;

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return state.items.filter((i) => {
      if (f.property && i.propertyId !== f.property) return false;
      if (f.room && i.roomId !== f.room) return false;
      if (f.category && i.category !== f.category) return false;
      if (f.condition && i.condition !== f.condition) return false;
      if (f.status && i.status !== f.status) return false;
      if (f.action && i.action !== f.action) return false;
      if (needle) {
        const room = roomById(i.roomId);
        const hay = [i.id, i.description, i.category, room?.name, room?.code, i.conditionNotes, i.actionNotes, ...i.photoRefs].join(' ').toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [state.items, q, f.property, f.room, f.category, f.condition, f.status, f.action, roomById]);

  const roomsForFilter = state.rooms.filter((r) => !f.property || r.propertyId === f.property);
  const totalQty = rows.reduce((s, i) => s + (i.confirmedQuantity ?? i.proposedQuantity), 0);

  const exportCsv = () => {
    downloadCsv(`roomtally-inventory-${new Date().toISOString().slice(0, 10)}.csv`, inventoryToCsv(rows, state.rooms, state.properties));
    setToast(`Exported ${rows.length} records to CSV`);
  };

  const addNew = () => {
    const pid = f.property || 'meridian';
    const rid = f.room || state.rooms.find((r) => r.propertyId === pid)?.id || '';
    setEditing({ item: blankItem(nextItemId(), pid, rid), isNew: true });
  };

  const selects: { key: FilterKey; label: string; options: [string, string][] }[] = [
    { key: 'property', label: 'Property', options: state.properties.map((p) => [p.id, p.name]) },
    { key: 'room', label: 'Room', options: roomsForFilter.map((r) => [r.id, `${r.code} ${r.name}`]) },
    { key: 'category', label: 'Furniture type', options: CATEGORIES.map((c) => [c, c]) },
    { key: 'condition', label: 'Condition', options: CONDITIONS.map((c) => [c, CONDITION_LABEL[c]]) },
    { key: 'status', label: 'Review status', options: STATUSES.map((s) => [s, STATUS_LABEL[s]]) },
    { key: 'action', label: 'Proposed action', options: ACTIONS.map((a) => [a, ACTION_LABEL[a]]) },
  ];

  return (
    <>
      <PageTitle
        title="Furniture inventory"
        intro="Search, filter, and correct proposed records. Select a row to open the full record."
        actions={
          <>
            <button className="btn-secondary" onClick={exportCsv}><Download size={15} /> Export CSV</button>
            <button className="btn-primary" onClick={addNew}><Plus size={15} /> Add record</button>
          </>
        }
      />

      <div className="panel mb-4">
        <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <label htmlFor="inv-search" className="sr-only">Search inventory</label>
            <input
              id="inv-search"
              type="search"
              className="field pl-9"
              placeholder="Search by ID, description, room, note, or photo reference"
              value={q}
              onChange={(e) => setParam('q', e.target.value)}
            />
          </div>
          <button className="btn-secondary lg:hidden" aria-expanded={showFilters} aria-controls="inv-filters" onClick={() => setShowFilters((s) => !s)}>
            <Filter size={15} /> Filters{activeCount ? ` (${activeCount})` : ''}
          </button>
        </div>
        <div id="inv-filters" className={`${showFilters ? 'grid' : 'hidden'} gap-3 border-t border-line p-3 sm:grid-cols-3 lg:grid lg:grid-cols-6`}>
          {selects.map((s) => (
            <div key={s.key}>
              <label htmlFor={`f-${s.key}`} className="field-label !mb-1 !text-[11px] !text-muted">{s.label}</label>
              <select id={`f-${s.key}`} className="field !h-9 !text-[13px]" value={f[s.key]} onChange={(e) => setParam(s.key, e.target.value)}>
                <option value="">All</option>
                {s.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-3 py-2 text-[12.5px] text-muted">
          <span aria-live="polite">
            <strong className="text-ink">{rows.length}</strong> records · <strong className="text-ink">{totalQty}</strong> items (confirmed where available) · sample data
          </span>
          {(activeCount > 0 || q) && (
            <button className="btn-ghost btn-sm" onClick={() => setParams({}, { replace: true })}><X size={13} /> Clear filters</button>
          )}
        </div>
      </div>

      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[1040px] text-left text-[13px]">
          <caption className="sr-only">Furniture inventory records</caption>
          <thead className="whitespace-nowrap border-b border-line bg-stone-50 text-[11.5px] text-muted">
            <tr>
              <th scope="col" className="px-4 py-2.5 font-medium">Item ID</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Description</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Room</th>
              <th scope="col" className="px-4 py-2.5 text-right font-medium">Proposed</th>
              <th scope="col" className="px-4 py-2.5 text-right font-medium">Confirmed</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Status</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Condition</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Dimensions</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Proposed action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((i) => {
              const room = roomById(i.roomId);
              return (
                <tr key={i.id} className="group border-b border-line last:border-0 hover:bg-stone-50">
                  <td className="whitespace-nowrap px-4 py-3">
                    <button className="font-mono text-[12px] text-cobalt underline-offset-2 hover:underline" onClick={() => setEditing({ item: i, isNew: false })}>
                      {i.id}
                    </button>
                  </td>
                  <td className="min-w-[240px] max-w-[320px] px-4 py-3">
                    <button className="text-left hover:underline" onClick={() => setEditing({ item: i, isNew: false })}>{i.description}</button>
                    <div className="text-[11.5px] text-muted">{i.category} · {i.photoRefs.length} photo ref{i.photoRefs.length === 1 ? '' : 's'}</div>
                  </td>
                  <td className="min-w-[150px] px-4 py-3"><span className="font-mono text-[11.5px] text-muted">{room?.code}</span> {room?.name}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted">{i.proposedQuantity}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {i.confirmedQuantity !== null ? (
                      <span className="font-semibold">{i.confirmedQuantity}</span>
                    ) : (
                      <button
                        className="btn-sm btn border-line px-2 text-[12px] hover:border-teal hover:text-teal"
                        disabled={i.status === 'needs-review' && i.observationIds.length > 0}
                        title={i.status === 'needs-review' && i.observationIds.length > 0 ? 'Resolve duplicate review first' : `Confirm quantity as ${i.proposedQuantity}`}
                        onClick={() => {
                          dispatch({ type: 'updateItem', id: i.id, patch: { confirmedQuantity: i.proposedQuantity, status: 'confirmed' }, note: `quantity confirmed as ${i.proposedQuantity}` });
                          setToast(`${i.id} quantity confirmed as ${i.proposedQuantity}`);
                        }}
                      >
                        <Check size={12} /> Confirm
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3"><StatusTag status={i.status} /></td>
                  <td className="whitespace-nowrap px-4 py-3"><ConditionText condition={i.condition} /></td>
                  <td className="whitespace-nowrap px-4 py-3 text-[12px] tabular-nums">
                    {i.dimensions ? `${i.dimensions.width} × ${i.dimensions.depth} × ${i.dimensions.height} ${i.dimensions.unit}` : <span className="text-stone-400">Not verified</span>}
                  </td>
                  <td className="px-4 py-3">
                    <label htmlFor={`act-${i.id}`} className="sr-only">Proposed action for {i.id}</label>
                    <select
                      id={`act-${i.id}`}
                      className="field !h-8 !w-[150px] !text-[12.5px]"
                      value={i.action}
                      onChange={(e) => {
                        const a = e.target.value as Action;
                        dispatch({ type: 'updateItem', id: i.id, patch: { action: a }, note: `action set to ${ACTION_LABEL[a]}` });
                        setToast(`${i.id} → ${ACTION_LABEL[a]}`);
                      }}
                    >
                      {ACTIONS.map((a) => <option key={a} value={a}>{ACTION_LABEL[a]}</option>)}
                    </select>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-14 text-center text-muted">No records match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <ItemEditor item={editing.item} isNew={editing.isNew} onClose={() => setEditing(null)} onSaved={setToast} />
      )}
      <Toast message={toast} onDone={() => setToast(null)} />
    </>
  );
}
