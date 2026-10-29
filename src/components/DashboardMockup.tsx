import { AlertTriangle, Boxes, LayoutGrid, Search } from 'lucide-react';
import { seedItems, seedRooms } from '../data/seed';
import { ACTION_LABEL, type Action } from '../data/types';
import { FloorPlan } from './FloorPlan';
import { actionTone, LogoMark } from './ui';

const items = seedItems.filter((i) => i.propertyId === 'meridian');
const rooms = seedRooms.filter((r) => r.propertyId === 'meridian');
const q = (i: (typeof items)[number]) => i.confirmedQuantity ?? i.proposedQuantity;

const counts: Record<string, number> = {};
const flagged: Record<string, number> = {};
items.forEach((i) => {
  counts[i.roomId] = (counts[i.roomId] ?? 0) + q(i);
  if (i.status === 'needs-review') flagged[i.roomId] = (flagged[i.roomId] ?? 0) + 1;
});
const byCat = Object.entries(
  items.reduce<Record<string, number>>((acc, i) => ((acc[i.category] = (acc[i.category] ?? 0) + q(i)), acc), {}),
).sort((a, b) => b[1] - a[1]).slice(0, 6);
const total = items.reduce((s, i) => s + q(i), 0);
const review = items.filter((i) => i.status === 'needs-review');
const actions = (['move', 'retain', 'refurbish', 'donate', 'inspect', 'dispose'] as Action[]).map((a) => ({
  a,
  n: items.filter((i) => i.action === a).reduce((s, i) => s + q(i), 0),
}));
const maxCat = byCat[0]?.[1] ?? 1;

/** Static product preview for marketing pages, computed from the sample workspace. */
export function DashboardMockup() {
  return (
    <div className="@container border border-ink/80 bg-paper shadow-[0_40px_80px_-40px_rgba(31,42,68,.45)]" aria-label="Roomtally dashboard preview using sample data" role="img">
      <div className="flex items-center justify-between border-b border-line bg-white px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <LogoMark className="h-4 w-4" />
          <span className="text-[12px] font-medium">Meridian House</span>
          <span className="hidden text-[11px] text-muted sm:inline">· Levels 3–4 · Survey 14–16 Oct</span>
        </div>
        <div className="hidden h-6 w-44 items-center gap-1.5 border border-line px-2 text-[10.5px] text-stone-400 sm:flex">
          <Search size={11} /> Search inventory
        </div>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)] @[620px]:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="min-w-0 border-b border-line p-4 @[620px]:border-b-0 @[620px]:border-r">
          <div className="mb-2 flex items-center justify-between">
            <span className="eyebrow !text-[9.5px]">Level 3 · Room plan</span>
            <span className="flex items-center gap-1 text-[10px] text-muted"><span className="h-1.5 w-1.5 bg-amber" /> review</span>
          </div>
          <FloorPlan rooms={rooms} counts={counts} flagged={flagged} selected="r302" className="w-full" />
          <table className="mt-3 w-full text-[11px]">
            <tbody>
              {rooms.slice(0, 5).map((r) => (
                <tr key={r.id} className={`border-t border-line ${r.id === 'r302' ? 'bg-cobalt-50' : ''}`}>
                  <td className="py-1.5 pl-1 font-mono text-[10px] text-muted">{r.code}</td>
                  <td className="py-1.5">{r.name}</td>
                  <td className="py-1.5 pr-1 text-right tabular-nums">{counts[r.id] ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col">
          <div className="grid grid-cols-3 border-b border-line">
            {[
              { icon: Boxes, label: 'Items', value: total },
              { icon: LayoutGrid, label: 'Rooms', value: rooms.length },
              { icon: AlertTriangle, label: 'Review', value: review.length, tone: 'text-amber' },
            ].map((s) => (
              <div key={s.label} className="border-r border-line p-3 last:border-r-0">
                <div className="flex items-center gap-1 text-[10px] text-muted"><s.icon size={11} />{s.label}</div>
                <div className={`mt-1 text-[22px] font-semibold tabular-nums tracking-tight ${s.tone ?? ''}`}>{s.value}</div>
              </div>
            ))}
          </div>
          <div className="border-b border-line p-4">
            <div className="eyebrow mb-2.5 !text-[9.5px]">Furniture categories</div>
            <ul className="space-y-1.5">
              {byCat.map(([c, n]) => (
                <li key={c} className="grid grid-cols-[88px_1fr_28px] items-center gap-2 text-[11px]">
                  <span className="truncate">{c}</span>
                  <span className="h-1.5 bg-stone-100"><span className="block h-full bg-navy" style={{ width: `${(n / maxCat) * 100}%` }} /></span>
                  <span className="text-right tabular-nums">{n}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-b border-line p-4">
            <div className="eyebrow mb-2 !text-[9.5px]">Review required</div>
            {review.slice(0, 3).map((i) => (
              <div key={i.id} className="flex items-center justify-between border-t border-line py-1.5 text-[11px] first:border-0">
                <span className="truncate"><span className="mr-2 font-mono text-[10px] text-muted">{i.id}</span>{i.description}</span>
                <span className="ml-2 shrink-0 text-amber">{i.observationIds.length ? 'Possible duplicate' : 'Confirm qty'}</span>
              </div>
            ))}
          </div>
          <div className="p-4">
            <div className="eyebrow mb-2.5 !text-[9.5px]">Proposed actions</div>
            <div className="grid grid-cols-3 gap-px bg-line">
              {actions.map(({ a, n }) => (
                <div key={a} className="bg-paper p-2">
                  <div className="flex items-center gap-1 text-[10px] text-muted"><span className={`h-1.5 w-1.5 ${actionTone[a].dot}`} />{ACTION_LABEL[a].replace(' in place', '')}</div>
                  <div className="text-[15px] font-semibold tabular-nums">{n}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-line bg-stone-50 px-4 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-muted">
        Sample inventory data · Meridian House is fictional
      </div>
    </div>
  );
}
