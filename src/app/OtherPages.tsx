import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Building2, Download, Plus, RotateCcw } from 'lucide-react';
import { FloorPlan } from '../components/FloorPlan';
import { actionTone, ActionTag, Field, Modal, SampleBadge, StatusTag, Toast } from '../components/ui';
import { ACTION_LABEL, ACTIONS, CATEGORIES, CONDITION_LABEL, CONDITIONS, type InventoryItem, type Room } from '../data/types';
import { downloadCsv, inventoryToCsv } from '../lib/csv';
import { qty, useInventory } from '../store/InventoryContext';
import { PageTitle } from './AppLayout';
import { blankItem, ItemEditor } from './ItemEditor';

/* ---------------- Overview ---------------- */

export function OverviewPage() {
  const { state, roomById } = useInventory();
  const navigate = useNavigate();
  const items = state.items.filter((i) => i.propertyId === 'meridian');
  const rooms = state.rooms.filter((r) => r.propertyId === 'meridian');
  const counts: Record<string, number> = {};
  const flagged: Record<string, number> = {};
  items.forEach((i) => {
    counts[i.roomId] = (counts[i.roomId] ?? 0) + qty(i);
    if (i.status === 'needs-review' || i.status === 'proposed') flagged[i.roomId] = (flagged[i.roomId] ?? 0) + 1;
  });
  const total = items.reduce((s, i) => s + qty(i), 0);
  const confirmed = items.filter((i) => i.confirmedQuantity !== null).reduce((s, i) => s + (i.confirmedQuantity ?? 0), 0);
  const review = items.filter((i) => i.status === 'needs-review' || i.status === 'proposed');
  const pendingDup = state.duplicateGroups.filter((g) => g.resolution === 'pending');

  return (
    <>
      <PageTitle
        title="Meridian House"
        intro="42 Hanover Wharf, London · Levels 3–4 · Survey 14–16 Oct 2026 · Client: Halden & Rowe LLP"
        actions={<Link to="/inventory/items" className="btn-primary">Open inventory <ArrowRight size={15} /></Link>}
      />
      <div className="mb-3"><SampleBadge>Sample inventory data · fictional property</SampleBadge></div>
      <div className="mb-6 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Items surveyed', total, 'confirmed or proposed'],
          ['Quantity confirmed', `${confirmed}`, `${Math.round((confirmed / Math.max(total, 1)) * 100)}% of surveyed items`],
          ['Records to review', review.length, 'proposed or review required'],
          ['Duplicate groups', pendingDup.length, pendingDup.length ? 'awaiting a decision' : 'all resolved'],
        ].map(([k, v, s]) => (
          <div key={k as string} className="bg-paper p-5">
            <div className="text-[12px] text-muted">{k}</div>
            <div className="mt-1 text-[32px] font-semibold tabular-nums tracking-tight">{v}</div>
            <div className="text-[11.5px] text-muted">{s}</div>
          </div>
        ))}
      </div>

      {pendingDup.length > 0 && (
        <div className="mb-6 flex flex-col gap-3 border border-amber/30 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex gap-2 text-[13.5px] text-[#6d4b0c]">
            <AlertTriangle size={17} className="mt-0.5 shrink-0 text-amber" />
            {pendingDup.length} group of observations may represent the same physical item. Quantities stay unconfirmed until reviewed.
          </p>
          <Link to="/inventory/duplicates" className="btn-secondary btn-sm bg-paper">Review duplicates</Link>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <section className="panel p-5" aria-labelledby="ov-plan">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="ov-plan" className="text-[14px] font-semibold">Level 3–4 room plan</h2>
            <span className="flex items-center gap-1.5 text-[11.5px] text-muted"><span className="h-2 w-2 bg-amber" />Records to review · schematic, not to scale</span>
          </div>
          <FloorPlan rooms={rooms} counts={counts} flagged={flagged} onSelect={(id) => navigate(`/inventory/items?room=${id}`)} className="w-full" />
          <p className="mt-2 text-[11.5px] text-muted">Select a room to filter the inventory.</p>
        </section>
        <section className="panel" aria-labelledby="ov-actions">
          <h2 id="ov-actions" className="border-b border-line px-5 py-3.5 text-[14px] font-semibold">Proposed actions</h2>
          <ul>
            {ACTIONS.map((a) => {
              const n = items.filter((i) => i.action === a).reduce((s, i) => s + qty(i), 0);
              return (
                <li key={a} className="flex items-center gap-3 border-b border-line px-5 py-2.5 last:border-0">
                  <span className={`h-2 w-2 ${actionTone[a].dot}`} />
                  <Link to={`/inventory/items?property=meridian&action=${a}`} className="flex-1 text-[13.5px] hover:underline">{ACTION_LABEL[a]}</Link>
                  <span className="h-1.5 w-24 bg-stone-100"><span className={`block h-full ${actionTone[a].dot}`} style={{ width: `${(n / Math.max(total, 1)) * 100}%` }} /></span>
                  <span className="w-8 text-right text-[13px] tabular-nums">{n}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <section className="panel" aria-labelledby="ov-review">
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <h2 id="ov-review" className="text-[14px] font-semibold">Review queue</h2>
            <Link to="/inventory/items?status=needs-review" className="text-[12.5px] text-cobalt hover:underline">View all</Link>
          </div>
          <table className="w-full text-[13px]">
            <tbody>
              {review.slice(0, 7).map((i) => (
                <tr key={i.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-2.5 font-mono text-[11.5px] text-muted">{i.id}</td>
                  <td className="py-2.5">{i.description}<div className="text-[11.5px] text-muted">{roomById(i.roomId)?.name}</div></td>
                  <td className="px-5 py-2.5 text-right"><StatusTag status={i.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="panel" aria-labelledby="ov-activity">
          <h2 id="ov-activity" className="border-b border-line px-5 py-3.5 text-[14px] font-semibold">Recent activity</h2>
          <ol className="max-h-[340px] overflow-y-auto">
            {state.activity.slice(0, 12).map((a) => (
              <li key={a.id} className="border-b border-line px-5 py-2.5 text-[12.5px] last:border-0">
                <div className="text-ink-soft">{a.text}</div>
                <time className="text-[11px] text-muted" dateTime={a.at}>{new Date(a.at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</time>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  );
}

/* ---------------- Properties ---------------- */

export function PropertiesPage() {
  const { state } = useInventory();
  return (
    <>
      <PageTitle title="Properties" intro="Buildings in this workspace. Both are fictional sample properties." />
      <div className="grid gap-4 lg:grid-cols-2">
        {state.properties.map((p) => {
          const rooms = state.rooms.filter((r) => r.propertyId === p.id);
          const items = state.items.filter((i) => i.propertyId === p.id);
          const toReview = items.filter((i) => i.status !== 'confirmed').length;
          return (
            <article key={p.id} className="panel">
              <div className="flex items-start gap-4 border-b border-line p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-line bg-stone-50"><Building2 size={18} strokeWidth={1.5} /></div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-[16px] font-semibold">{p.name}</h2>
                  <p className="text-[13px] text-muted">{p.address}</p>
                </div>
              </div>
              <dl className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
                {[['Floors', p.floors], ['Survey', p.surveyWindow], ['Rooms', rooms.length], ['Items', items.reduce((s, i) => s + qty(i), 0)]].map(([k, v]) => (
                  <div key={k as string} className="bg-paper px-5 py-3"><dt className="text-[11.5px] text-muted">{k}</dt><dd className="text-[14px] font-medium tabular-nums">{v}</dd></div>
                ))}
              </dl>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-5 py-3 text-[12.5px]">
                <span className="text-muted">Client: {p.client} · {toReview} records not yet confirmed</span>
                <div className="flex gap-2">
                  <Link to={`/inventory/rooms?property=${p.id}`} className="btn-secondary btn-sm">Rooms</Link>
                  <Link to={`/inventory/items?property=${p.id}`} className="btn-primary btn-sm">Inventory</Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

/* ---------------- Rooms ---------------- */

export function RoomsPage() {
  const { state, dispatch, nextItemId } = useInventory();
  const [property, setProperty] = useState(() => new URLSearchParams(location.search).get('property') ?? 'meridian');
  const [selected, setSelected] = useState<string | null>(null);
  const [roomDraft, setRoomDraft] = useState<Room | null>(null);
  const [roomErr, setRoomErr] = useState('');
  const [newItem, setNewItem] = useState<InventoryItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const rooms = state.rooms.filter((r) => r.propertyId === property);
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    state.items.forEach((i) => (c[i.roomId] = (c[i.roomId] ?? 0) + qty(i)));
    return c;
  }, [state.items]);
  const flagged = useMemo(() => {
    const c: Record<string, number> = {};
    state.items.forEach((i) => i.status !== 'confirmed' && (c[i.roomId] = (c[i.roomId] ?? 0) + 1));
    return c;
  }, [state.items]);
  const sel = rooms.find((r) => r.id === selected) ?? null;
  const selItems = state.items.filter((i) => i.roomId === sel?.id);

  const newRoom = () => {
    setRoomErr('');
    setRoomDraft({ id: `room-${Date.now().toString(36)}`, propertyId: property, code: '', name: '', floor: rooms[0]?.floor ?? '', type: 'Open plan', areaM2: 0, plan: { x: 0, y: Math.max(0, ...rooms.map((r) => r.plan.y + r.plan.h)) + 1, w: 6, h: 3 } });
  };

  return (
    <>
      <PageTitle
        title="Rooms"
        intro="Rooms structure every record. Counts include proposed quantities until confirmed."
        actions={
          <>
            <label htmlFor="rooms-prop" className="sr-only">Property</label>
            <select id="rooms-prop" className="field !w-auto" value={property} onChange={(e) => { setProperty(e.target.value); setSelected(null); }}>
              {state.properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <button className="btn-primary" onClick={newRoom}><Plus size={15} /> Add room</button>
          </>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="panel p-5">
          <FloorPlan rooms={rooms} counts={counts} flagged={flagged} selected={selected} onSelect={setSelected} className="w-full" />
          <p className="mt-2 text-[11.5px] text-muted">Schematic plan · select a room for detail.</p>
        </div>
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[480px] text-[13px]">
            <thead className="border-b border-line bg-stone-50 text-left text-[11.5px] text-muted">
              <tr><th className="px-4 py-2.5 font-medium">Code</th><th className="px-4 py-2.5 font-medium">Room</th><th className="px-4 py-2.5 font-medium">Type</th><th className="px-4 py-2.5 text-right font-medium">Area</th><th className="px-4 py-2.5 text-right font-medium">Items</th></tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r.id} className={`cursor-pointer border-b border-line last:border-0 ${selected === r.id ? 'bg-cobalt-50' : 'hover:bg-stone-50'}`} onClick={() => setSelected(r.id)}>
                  <td className="px-4 py-2.5 font-mono text-[12px]">{r.code}</td>
                  <td className="px-4 py-2.5"><button className="text-left hover:underline" onClick={() => setSelected(r.id)}>{r.name}</button><div className="text-[11.5px] text-muted">{r.floor}</div></td>
                  <td className="px-4 py-2.5 text-muted">{r.type}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{r.areaM2} m²</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{counts[r.id] ?? 0}{(flagged[r.id] ?? 0) > 0 && <span className="ml-1.5 inline-block h-1.5 w-1.5 bg-amber align-middle" title="Records to review" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {sel && (
        <section className="panel mt-6" aria-labelledby="room-detail">
          <div className="flex flex-col gap-3 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="eyebrow">{sel.code} · {sel.floor} · {sel.areaM2} m² (from floor plan)</div>
              <h2 id="room-detail" className="text-[17px] font-semibold">{sel.name}</h2>
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary btn-sm" onClick={() => { setRoomErr(''); setRoomDraft(sel); }}>Edit room</button>
              <button className="btn-secondary btn-sm" onClick={() => setNewItem(blankItem(nextItemId(), property, sel.id))}><Plus size={13} /> Add item here</button>
              <Link to={`/inventory/items?room=${sel.id}`} className="btn-primary btn-sm">Open in inventory</Link>
            </div>
          </div>
          <ul className="divide-y divide-line">
            {selItems.map((i) => (
              <li key={i.id} className="grid items-center gap-2 px-5 py-2.5 text-[13px] sm:grid-cols-[90px_1fr_60px_140px_130px]">
                <span className="font-mono text-[11.5px] text-muted">{i.id}</span>
                <span>{i.description}</span>
                <span className="tabular-nums">× {qty(i)}</span>
                <StatusTag status={i.status} />
                <ActionTag action={i.action} />
              </li>
            ))}
            {selItems.length === 0 && <li className="px-5 py-6 text-[13px] text-muted">No items recorded in this room yet.</li>}
          </ul>
        </section>
      )}

      <Modal
        open={!!roomDraft}
        onClose={() => setRoomDraft(null)}
        title={state.rooms.some((r) => r.id === roomDraft?.id) ? 'Edit room' : 'Add room'}
        footer={
          <>
            <button className="btn-secondary btn-sm" onClick={() => setRoomDraft(null)}>Cancel</button>
            <button className="btn-primary btn-sm" onClick={() => {
              if (!roomDraft) return;
              if (!roomDraft.code.trim() || !roomDraft.name.trim()) { setRoomErr('Room code and name are required.'); return; }
              dispatch({ type: 'saveRoom', room: { ...roomDraft, code: roomDraft.code.trim(), name: roomDraft.name.trim() } });
              setToast(`Room ${roomDraft.code} saved`);
              setSelected(roomDraft.id);
              setRoomDraft(null);
            }}>Save room</button>
          </>
        }
      >
        {roomDraft && (
          <div className="grid gap-4 sm:grid-cols-2">
            {roomErr && <p role="alert" className="text-[12.5px] text-rust sm:col-span-2">{roomErr}</p>}
            <Field label="Room code *" htmlFor="rm-code"><input id="rm-code" className="field" value={roomDraft.code} onChange={(e) => setRoomDraft({ ...roomDraft, code: e.target.value })} placeholder="3.09" /></Field>
            <Field label="Room name *" htmlFor="rm-name"><input id="rm-name" className="field" value={roomDraft.name} onChange={(e) => setRoomDraft({ ...roomDraft, name: e.target.value })} /></Field>
            <Field label="Floor" htmlFor="rm-floor"><input id="rm-floor" className="field" value={roomDraft.floor} onChange={(e) => setRoomDraft({ ...roomDraft, floor: e.target.value })} /></Field>
            <Field label="Room type" htmlFor="rm-type">
              <select id="rm-type" className="field" value={roomDraft.type} onChange={(e) => setRoomDraft({ ...roomDraft, type: e.target.value })}>
                {['Open plan', 'Meeting', 'Focus', 'Amenity', 'Front of house', 'Back of house'].map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Net area (m²)" htmlFor="rm-area" hint="From the floor plan or schedule.">
              <input id="rm-area" type="number" min={0} className="field" value={roomDraft.areaM2 || ''} onChange={(e) => setRoomDraft({ ...roomDraft, areaM2: Number(e.target.value) || 0 })} />
            </Field>
          </div>
        )}
      </Modal>

      {newItem && <ItemEditor item={newItem} isNew onClose={() => setNewItem(null)} onSaved={setToast} />}
      <Toast message={toast} onDone={() => setToast(null)} />
    </>
  );
}

/* ---------------- Reports ---------------- */

export function ReportsPage() {
  const { state } = useInventory();
  const [toast, setToast] = useState<string | null>(null);
  const items = state.items;
  const byCategory = CATEGORIES.map((c) => {
    const its = items.filter((i) => i.category === c);
    return { c, records: its.length, qty: its.reduce((s, i) => s + qty(i), 0), confirmed: its.reduce((s, i) => s + (i.confirmedQuantity ?? 0), 0) };
  }).filter((r) => r.records);

  const exports = [
    { t: 'Full inventory', d: 'Every record with quantities, condition, dimensions, action, and photo references.', rows: items, f: 'roomtally-full-inventory.csv' },
    { t: 'Confirmed items only', d: 'Records with a confirmed quantity — ready for the move team.', rows: items.filter((i) => i.confirmedQuantity !== null), f: 'roomtally-confirmed.csv' },
    { t: 'Review required', d: 'Proposed, review-required, and inspection records still awaiting a decision.', rows: items.filter((i) => i.status !== 'confirmed'), f: 'roomtally-review-required.csv' },
    { t: 'Refurbishment schedule', d: 'Items proposed for refurbishment, with condition notes and verified dimensions.', rows: items.filter((i) => i.action === 'refurbish'), f: 'roomtally-refurbishment.csv' },
    { t: 'Donation list', d: 'Items proposed for donation, for sharing with partner organisations.', rows: items.filter((i) => i.action === 'donate'), f: 'roomtally-donation.csv' },
  ];

  return (
    <>
      <PageTitle title="Reports" intro="Download CSV reports from the current demo inventory. Reports reflect your edits." />
      <div className="mb-3"><SampleBadge /></div>
      <div className="grid gap-px border border-line bg-line md:grid-cols-2 xl:grid-cols-3">
        {exports.map((e) => (
          <div key={e.t} className="flex flex-col bg-paper p-5">
            <h2 className="text-[15px] font-semibold">{e.t}</h2>
            <p className="mt-1 flex-1 text-[13px] text-muted">{e.d}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[12px] tabular-nums text-muted">{e.rows.length} records</span>
              <button className="btn-secondary btn-sm" disabled={!e.rows.length} onClick={() => { downloadCsv(e.f, inventoryToCsv(e.rows, state.rooms, state.properties)); setToast(`Downloaded ${e.f}`); }}>
                <Download size={13} /> CSV
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="panel overflow-x-auto">
          <h2 className="border-b border-line px-5 py-3.5 text-[14px] font-semibold">By furniture type</h2>
          <table className="w-full text-[13px]">
            <thead className="border-b border-line text-left text-[11.5px] text-muted"><tr><th className="px-5 py-2 font-medium">Category</th><th className="px-5 py-2 text-right font-medium">Records</th><th className="px-5 py-2 text-right font-medium">Items</th><th className="px-5 py-2 text-right font-medium">Confirmed</th></tr></thead>
            <tbody>
              {byCategory.map((r) => (
                <tr key={r.c} className="border-b border-line last:border-0"><td className="px-5 py-2">{r.c}</td><td className="px-5 py-2 text-right tabular-nums">{r.records}</td><td className="px-5 py-2 text-right tabular-nums">{r.qty}</td><td className="px-5 py-2 text-right tabular-nums">{r.confirmed}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="panel overflow-x-auto">
          <h2 className="border-b border-line px-5 py-3.5 text-[14px] font-semibold">Condition by action</h2>
          <table className="w-full min-w-[520px] text-[12.5px]">
            <thead className="border-b border-line text-left text-[11px] text-muted">
              <tr><th className="px-4 py-2 font-medium">Action</th>{CONDITIONS.map((c) => <th key={c} className="px-2 py-2 text-right font-medium">{CONDITION_LABEL[c].replace('Not yet assessed', 'Unassessed')}</th>)}</tr>
            </thead>
            <tbody>
              {ACTIONS.map((a) => (
                <tr key={a} className="border-b border-line last:border-0">
                  <td className="px-4 py-2">{ACTION_LABEL[a]}</td>
                  {CONDITIONS.map((c) => {
                    const n = items.filter((i) => i.action === a && i.condition === c).reduce((s, i) => s + qty(i), 0);
                    return <td key={c} className={`px-2 py-2 text-right tabular-nums ${n ? '' : 'text-stone-300'}`}>{n}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
      <p className="mt-4 text-[12px] text-muted">Roomtally does not estimate resale or refurbishment value. Condition grades are recorded by reviewers.</p>
      <Toast message={toast} onDone={() => setToast(null)} />
    </>
  );
}

/* ---------------- Settings ---------------- */

export function SettingsPage() {
  const { state, dispatch } = useInventory();
  const [confirmReset, setConfirmReset] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const s = state.settings;
  return (
    <>
      <PageTitle title="Settings" intro="Workspace preferences for this demonstration. Stored in your browser." />
      <div className="max-w-2xl space-y-6">
        <section className="panel space-y-4 p-5">
          <h2 className="text-[14px] font-semibold">Workspace</h2>
          <Field label="Organisation name" htmlFor="st-org">
            <input id="st-org" className="field" value={s.organisation} onChange={(e) => dispatch({ type: 'settings', patch: { organisation: e.target.value } })} />
          </Field>
          <Field label="Default dimension unit" htmlFor="st-unit" hint="Used when recording new dimensions. Existing records keep their stated unit.">
            <select id="st-unit" className="field" value={s.defaultUnit} onChange={(e) => dispatch({ type: 'settings', patch: { defaultUnit: e.target.value as 'cm' | 'mm' } })} aria-describedby="st-unit-hint">
              <option value="cm">Centimetres (cm)</option>
              <option value="mm">Millimetres (mm)</option>
            </select>
          </Field>
          <label className="flex items-center gap-2 text-[13.5px]">
            <input type="checkbox" className="h-4 w-4 accent-[#2747b8]" checked={s.boardIncludesUnconfirmed} onChange={(e) => dispatch({ type: 'settings', patch: { boardIncludesUnconfirmed: e.target.checked } })} />
            Show unconfirmed records on the relocation planning board
          </label>
        </section>
        <section className="panel p-5">
          <h2 className="text-[14px] font-semibold">Integrations</h2>
          <p className="mt-1 text-[13px] text-muted">Shown for illustration. None are connected in this demonstration.</p>
          <ul className="mt-4 divide-y divide-line border-y border-line text-[13.5px]">
            {['Photograph analysis (simulated in demo)', 'Floor plan / FF&E schedule import', 'CAFM asset register export', 'Single sign-on'].map((n) => (
              <li key={n} className="flex items-center justify-between py-2.5"><span>{n}</span><span className="tag border-line text-muted">Not connected</span></li>
            ))}
          </ul>
        </section>
        <section className="panel p-5">
          <h2 className="text-[14px] font-semibold">Demo data</h2>
          <p className="mt-1 text-[13px] text-muted">Restore Meridian House and Calder Yard Annex to their original sample state. This clears all edits in this browser.</p>
          {confirmReset ? (
            <div className="mt-4 flex items-center gap-2">
              <button className="btn-sm btn border-rust bg-rust text-white" onClick={() => { dispatch({ type: 'reset' }); setConfirmReset(false); setToast('Demo data restored'); }}>Yes, reset demo data</button>
              <button className="btn-ghost btn-sm" onClick={() => setConfirmReset(false)}>Cancel</button>
            </div>
          ) : (
            <button className="btn-secondary mt-4" onClick={() => setConfirmReset(true)}><RotateCcw size={14} /> Reset demo data</button>
          )}
        </section>
        <p className="text-[12px] text-muted">Data categories in use: {CATEGORIES.length} furniture types · {ACTIONS.length} actions.</p>
      </div>
      <Toast message={toast} onDone={() => setToast(null)} />
    </>
  );
}
