import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Clock, Copy, MapPin, RotateCcw, Search, SplitSquareHorizontal, User } from 'lucide-react';
import { Photo, PHOTOS, StatusTag, Toast } from '../components/ui';
import type { DuplicateGroup } from '../data/types';
import { useInventory } from '../store/InventoryContext';
import { PageTitle } from './AppLayout';

const RESOLUTION_COPY: Record<Exclude<DuplicateGroup['resolution'], 'pending'>, { title: string; body: string }> = {
  same: { title: 'Confirmed as the same item', body: 'The records were merged into one item with a confirmed quantity of 1. All photograph references were kept on the merged record.' },
  separate: { title: 'Kept as separate items', body: 'Each observation remains its own record, and each quantity was confirmed as 1.' },
  inspection: { title: 'Marked for manual inspection', body: 'The records were set to manual inspection with the action “Inspect”. Quantities stay unconfirmed until someone checks on site.' },
};

export default function DuplicatesPage() {
  const { state, dispatch, roomById } = useInventory();
  const [toast, setToast] = useState<string | null>(null);
  const [pendingChoice, setPendingChoice] = useState<Record<string, 'same' | 'separate' | 'inspection' | ''>>({});

  return (
    <>
      <PageTitle
        title="Duplicate review"
        intro="Observations that may show the same physical item are grouped here. A reviewer decides the relationship before any quantity changes."
      />

      <div className="mb-6 flex gap-3 border border-dashed border-stone-400 bg-paper px-4 py-3 text-[13px] text-ink-soft">
        <Search size={16} className="mt-0.5 shrink-0 text-muted" />
        <p>
          <strong className="font-semibold">Simulated match.</strong> In this demonstration the suggested relationship is pre-written sample data. No image matching or AI analysis has been performed on these photographs.
        </p>
      </div>

      {state.duplicateGroups.map((g) => {
        const obs = state.observations.filter((o) => g.observationIds.includes(o.id));
        const items = obs.map((o) => state.items.find((i) => i.id === o.itemId));
        const choice = pendingChoice[g.id] ?? '';
        return (
          <section key={g.id} className="panel mb-8" aria-labelledby={`${g.id}-title`}>
            <header className="flex flex-col gap-3 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="eyebrow mb-1 flex items-center gap-2"><Copy size={12} /> Review group {g.id}</div>
                <h2 id={`${g.id}-title`} className="text-[17px] font-semibold">{g.title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="border border-dashed border-stone-400 px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">Simulated suggestion</span>
                {g.resolution === 'pending' ? (
                  <span className="tag border-amber/30 bg-amber-50 text-amber">Awaiting decision</span>
                ) : (
                  <span className="tag border-teal/25 bg-teal-50 text-teal">Resolved</span>
                )}
              </div>
            </header>

            {g.resolution === 'pending' && (
              <div role="alert" className="flex gap-3 border-b border-amber/30 bg-amber-50 px-5 py-3.5 text-[14px] text-[#6d4b0c]">
                <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber" />
                <p>These observations may represent the same physical item. Confirm the relationship before changing the inventory quantity.</p>
              </div>
            )}

            <div className="grid gap-px bg-line md:grid-cols-3">
              {obs.map((o, idx) => {
                const room = roomById(o.roomId);
                const it = items[idx];
                return (
                  <article key={o.id} className="flex flex-col bg-paper" aria-label={`Observation ${o.id}`}>
                    <Photo
                      src={PHOTOS.officeDesks}
                      alt={`Sample photograph for ${o.id}`}
                      position={o.crop}
                      zoom={1.9}
                      className="aspect-[4/3]"
                      caption={o.photoRef}
                    />
                    <div className="flex-1 space-y-3 p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[13px] font-medium">{o.id}</span>
                        <span className="text-[11px] text-muted">Observation {idx + 1} of {obs.length}</span>
                      </div>
                      <dl className="space-y-1.5 text-[12.5px]">
                        <div className="flex gap-2"><MapPin size={13} className="mt-0.5 shrink-0 text-muted" /><dt className="sr-only">Survey location</dt><dd>{o.location}</dd></div>
                        <div className="flex gap-2"><Clock size={13} className="mt-0.5 shrink-0 text-muted" /><dt className="sr-only">Photograph timestamp</dt><dd className="tabular-nums">{new Date(o.takenAt).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })} UTC</dd></div>
                        <div className="flex gap-2"><User size={13} className="mt-0.5 shrink-0 text-muted" /><dt className="sr-only">Surveyor</dt><dd>{o.surveyor}</dd></div>
                      </dl>
                      <div>
                        <div className="eyebrow mb-1.5 !text-[10px]">Identifying details</div>
                        <table className="w-full text-[12.5px]">
                          <tbody>
                            {o.details.map((d) => (
                              <tr key={d.label} className="border-t border-line">
                                <th scope="row" className="w-[42%] py-1.5 pr-2 text-left font-normal text-muted">{d.label}</th>
                                <td className={`py-1.5 ${/not visible/i.test(d.value) ? 'text-stone-400' : ''}`}>{d.value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-line px-4 py-2.5 text-[12px]">
                      {it ? (
                        <>
                          <span><span className="font-mono">{it.id}</span> · {room?.code} · qty {it.confirmedQuantity ?? `${it.proposedQuantity} proposed`}</span>
                          <StatusTag status={it.status} />
                        </>
                      ) : (
                        <span className="text-muted">Record merged into another item</span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="grid gap-6 border-t border-line p-5 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <div className="eyebrow mb-2">Suggested relationship (simulated)</div>
                <p className="text-[15px] font-semibold">{g.suggestedRelationship}</p>
                <ul className="mt-3 space-y-1.5 text-[13px] text-ink-soft">
                  {g.rationale.map((r) => <li key={r} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 bg-stone-400" />{r}</li>)}
                </ul>
                <p className="mt-3 text-[12px] text-muted">
                  Current inventory effect: {items.filter(Boolean).length} record{items.filter(Boolean).length === 1 ? '' : 's'} totalling{' '}
                  {items.reduce((s, i) => s + (i ? i.confirmedQuantity ?? i.proposedQuantity : 0), 0)} desk(s).
                </p>
              </div>

              {g.resolution === 'pending' ? (
                <fieldset>
                  <legend className="eyebrow mb-3">Your decision</legend>
                  <div className="space-y-2">
                    {([
                      ['same', CheckCircle2, 'Confirm as the same item', `Merge into ${obs[0]?.itemId}; quantity becomes 1.`],
                      ['separate', SplitSquareHorizontal, 'Keep as separate items', `Confirm ${obs.length} desks, quantity 1 each.`],
                      ['inspection', Search, 'Mark for manual inspection', 'Leave quantities unconfirmed; add to inspection list.'],
                    ] as const).map(([val, Icon, label, hint]) => (
                      <label key={val} className={`flex cursor-pointer gap-3 border px-3 py-2.5 transition-colors ${choice === val ? 'border-cobalt bg-cobalt-50' : 'border-line hover:border-stone-400'}`}>
                        <input type="radio" name={`res-${g.id}`} value={val} checked={choice === val} onChange={() => setPendingChoice((p) => ({ ...p, [g.id]: val }))} className="mt-1 accent-[#2747b8]" />
                        <Icon size={16} className="mt-0.5 shrink-0 text-ink-soft" />
                        <span>
                          <span className="block text-[13.5px] font-medium">{label}</span>
                          <span className="block text-[12px] text-muted">{hint}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                  <button
                    className="btn-primary mt-4 w-full"
                    disabled={!choice}
                    onClick={() => {
                      if (!choice) return;
                      dispatch({ type: 'resolveDuplicate', groupId: g.id, resolution: choice });
                      setToast(`${g.id}: ${RESOLUTION_COPY[choice].title.toLowerCase()} — inventory updated`);
                      setPendingChoice((p) => ({ ...p, [g.id]: '' }));
                    }}
                  >
                    Apply decision to inventory
                  </button>
                </fieldset>
              ) : (
                <div className="border border-teal/25 bg-teal-50 p-4" role="status">
                  <div className="flex items-center gap-2 text-[14px] font-semibold text-teal"><CheckCircle2 size={16} /> {RESOLUTION_COPY[g.resolution].title}</div>
                  <p className="mt-2 text-[13px] text-ink-soft">{RESOLUTION_COPY[g.resolution].body}</p>
                  {g.resolvedAt && <p className="mt-2 text-[11.5px] text-muted">Applied {new Date(g.resolvedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</p>}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link to="/inventory/items?category=Desk" className="btn-secondary btn-sm">View desks in inventory</Link>
                    <button className="btn-ghost btn-sm" onClick={() => { dispatch({ type: 'revertDuplicate', groupId: g.id }); setToast(`${g.id} reopened for review`); }}>
                      <RotateCcw size={13} /> Undo decision
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        );
      })}
      <Toast message={toast} onDone={() => setToast(null)} />
    </>
  );
}
