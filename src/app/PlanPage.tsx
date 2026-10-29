import { useState } from 'react';
import { Download, GripVertical, StickyNote } from 'lucide-react';
import { actionTone, ActionTag, Modal, SampleBadge, StatusTag, Toast } from '../components/ui';
import { ACTION_LABEL, ACTIONS, type Action, type InventoryItem } from '../data/types';
import { downloadCsv, inventoryToCsv } from '../lib/csv';
import { qty, useInventory } from '../store/InventoryContext';
import { PageTitle } from './AppLayout';

const SUMMARY: { a: Action; label: string }[] = [
  { a: 'move', label: 'Items to move' },
  { a: 'retain', label: 'Items to retain' },
  { a: 'refurbish', label: 'Items to refurbish' },
  { a: 'donate', label: 'Items to donate' },
  { a: 'inspect', label: 'Items requiring inspection' },
];

export default function PlanPage() {
  const { state, dispatch, roomById } = useInventory();
  const [property, setProperty] = useState('meridian');
  const [noteFor, setNoteFor] = useState<InventoryItem | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<Action | null>(null);
  const includeUnconfirmed = state.settings.boardIncludesUnconfirmed;

  const pool = state.items.filter(
    (i) => (!property || i.propertyId === property) && (includeUnconfirmed || i.status === 'confirmed' || i.status === 'inspection'),
  );
  const excluded = state.items.filter((i) => (!property || i.propertyId === property) && !pool.includes(i)).length;

  const assign = (id: string, a: Action) => {
    const it = state.items.find((i) => i.id === id);
    if (!it || it.action === a) return;
    dispatch({ type: 'updateItem', id, patch: { action: a }, note: `action set to ${ACTION_LABEL[a]} on planning board` });
    setToast(`${id} → ${ACTION_LABEL[a]}`);
  };

  const openNote = (i: InventoryItem) => {
    setNoteFor(i);
    setNoteDraft(i.actionNotes);
  };

  return (
    <>
      <PageTitle
        title="Relocation plan"
        intro="Confirmed items grouped by proposed action. Drag a card between columns, or use its action menu."
        actions={
          <button className="btn-secondary" onClick={() => { downloadCsv('roomtally-relocation-plan.csv', inventoryToCsv(pool, state.rooms, state.properties)); setToast('Relocation plan exported'); }}>
            <Download size={15} /> Export plan
          </button>
        }
      />

      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <SampleBadge>Sample inventory data · counts are illustrative</SampleBadge>
        <div className="flex flex-wrap items-center gap-4 text-[13px]">
          <label className="flex items-center gap-2">
            <span className="text-muted">Property</span>
            <select className="field !h-8 !w-auto !text-[13px]" value={property} onChange={(e) => setProperty(e.target.value)}>
              <option value="">All properties</option>
              {state.properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4 accent-[#2747b8]" checked={includeUnconfirmed} onChange={(e) => dispatch({ type: 'settings', patch: { boardIncludesUnconfirmed: e.target.checked } })} />
            Include unconfirmed records
          </label>
        </div>
      </div>

      <div className="mb-6 grid gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-5">
        {SUMMARY.map(({ a, label }) => {
          const its = pool.filter((i) => i.action === a);
          return (
            <div key={a} className="bg-paper p-4">
              <div className="flex items-center gap-2 text-[12px] text-muted"><span className={`h-2 w-2 ${actionTone[a].dot}`} />{label}</div>
              <div className="mt-2 text-[30px] font-semibold tabular-nums tracking-tight">{its.reduce((s, i) => s + qty(i), 0)}</div>
              <div className="text-[11.5px] text-muted">{its.length} record{its.length === 1 ? '' : 's'} · sample data</div>
            </div>
          );
        })}
      </div>
      {!includeUnconfirmed && excluded > 0 && (
        <p className="mb-4 text-[12.5px] text-muted">{excluded} unconfirmed record{excluded === 1 ? ' is' : 's are'} hidden until reviewed.</p>
      )}

      <div className="relative -mx-4 overflow-x-auto px-4 pb-4 sm:-mx-8 sm:px-8">
        <div className="grid min-w-[1260px] grid-cols-7 gap-3">
          {ACTIONS.map((a) => {
            const its = pool.filter((i) => i.action === a);
            return (
              <section
                key={a}
                aria-label={`${ACTION_LABEL[a]} column`}
                className={`flex min-h-[320px] flex-col border bg-paper transition-colors ${dragOver === a ? 'border-cobalt bg-cobalt-50' : 'border-line'}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(a); }}
                onDragLeave={() => setDragOver((d) => (d === a ? null : d))}
                onDrop={(e) => { e.preventDefault(); setDragOver(null); assign(e.dataTransfer.getData('text/plain'), a); }}
              >
                <header className="flex items-center justify-between border-b border-line px-3 py-2.5">
                  <ActionTag action={a} />
                  <span className="text-[12px] tabular-nums text-muted">{its.reduce((s, i) => s + qty(i), 0)}</span>
                </header>
                <ul className="flex-1 space-y-2 p-2">
                  {its.map((i) => {
                    const room = roomById(i.roomId);
                    return (
                      <li
                        key={i.id}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData('text/plain', i.id)}
                        className="cursor-grab border border-line bg-white p-2.5 text-[12.5px] active:cursor-grabbing"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-mono text-[10.5px] text-muted">{i.id}</span>
                          <GripVertical size={13} className="text-stone-300" aria-hidden="true" />
                        </div>
                        <div className="mt-0.5 font-medium leading-snug">{i.description}</div>
                        <div className="mt-1 text-[11px] text-muted">{room?.code} {room?.name}</div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="tabular-nums">Qty <strong>{qty(i)}</strong>{i.confirmedQuantity === null && <span className="text-muted"> (proposed)</span>}</span>
                          {i.status !== 'confirmed' && <StatusTag status={i.status} />}
                        </div>
                        {i.actionNotes && <p className="mt-2 border-t border-line pt-2 text-[11.5px] text-ink-soft">{i.actionNotes}</p>}
                        <div className="mt-2 flex gap-1">
                          <label htmlFor={`pa-${i.id}`} className="sr-only">Action for {i.id}</label>
                          <select id={`pa-${i.id}`} className="field !h-7 !px-1.5 !text-[11.5px]" value={i.action} onChange={(e) => assign(i.id, e.target.value as Action)}>
                            {ACTIONS.map((x) => <option key={x} value={x}>{ACTION_LABEL[x]}</option>)}
                          </select>
                          <button className="btn-secondary !h-7 !px-2" aria-label={`Add note to ${i.id}`} title="Add note" onClick={() => openNote(i)}>
                            <StickyNote size={13} />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                  {its.length === 0 && <li className="px-1 py-6 text-center text-[12px] text-stone-400">Drop items here</li>}
                </ul>
              </section>
            );
          })}
        </div>
      </div>

      <Modal
        open={!!noteFor}
        onClose={() => setNoteFor(null)}
        title={`Action note · ${noteFor?.id ?? ''}`}
        footer={
          <>
            <button className="btn-secondary btn-sm" onClick={() => setNoteFor(null)}>Cancel</button>
            <button
              className="btn-primary btn-sm"
              onClick={() => {
                if (noteFor) {
                  dispatch({ type: 'updateItem', id: noteFor.id, patch: { actionNotes: noteDraft.trim() }, note: 'action note updated' });
                  setToast(`Note saved on ${noteFor.id}`);
                }
                setNoteFor(null);
              }}
            >
              Save note
            </button>
          </>
        }
      >
        <p className="mb-3 text-[13px] text-muted">{noteFor?.description}</p>
        <label htmlFor="plan-note" className="field-label">Note for the team carrying out this action</label>
        <textarea id="plan-note" rows={4} className="field" value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} placeholder="e.g. Destination Level 2, zone B. Wrap tops; two-person lift." />
      </Modal>
      <Toast message={toast} onDone={() => setToast(null)} />
    </>
  );
}
