import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageHero, SectionHead } from '../components/SiteLayout';
import { ActionTag, Photo, PHOTOS, SampleBadge, useSeo } from '../components/ui';
import { seedItems } from '../data/seed';
import { ACTIONS, type Action } from '../data/types';
import { FinalCta } from './Home';

export default function RelocationPlanning() {
  useSeo('Relocation Planning', 'Group confirmed furniture by proposed action — move, retain, refurbish, donate, inspect, or dispose — and share one plan with every team.', '/relocation-planning');
  const cols = ACTIONS.filter((a): a is Exclude<Action, 'unassigned'> => a !== 'unassigned');
  const confirmed = seedItems.filter((i) => i.status === 'confirmed' || i.status === 'inspection');
  return (
    <>
      <PageHero
        eyebrow="Relocation planning"
        title="Plan the move around what you actually have."
        intro="Once quantities are confirmed, Roomtally groups every item by its proposed outcome. Coordinators adjust actions, add notes for crews and suppliers, and export the plan."
      >
        <Link to="/inventory/plan" className="btn-primary">Open the planning board <ArrowRight size={15} /></Link>
      </PageHero>
      <section className="border-b border-line bg-stone-50">
        <div className="container-x py-16">
          <div className="mb-4 flex items-center justify-between"><span className="eyebrow">Planning board preview</span><SampleBadge /></div>
          <div className="grid gap-3 overflow-x-auto sm:grid-cols-3 lg:grid-cols-6">
            {cols.map((a) => {
              const its = confirmed.filter((i) => i.action === a);
              return (
                <div key={a} className="panel min-w-[180px]">
                  <div className="flex items-center justify-between border-b border-line px-3 py-2.5">
                    <ActionTag action={a} />
                    <span className="text-[13px] font-semibold tabular-nums">{its.reduce((s, i) => s + (i.confirmedQuantity ?? 0), 0)}</span>
                  </div>
                  <ul className="space-y-1.5 p-2">
                    {its.slice(0, 3).map((i) => (
                      <li key={i.id} className="border border-line bg-paper p-2 text-[12px]">
                        <div className="font-mono text-[10.5px] text-muted">{i.id}</div>
                        <div className="line-clamp-2">{i.description}</div>
                      </li>
                    ))}
                    {its.length === 0 && <li className="p-2 text-[12px] text-muted">No items</li>}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="border-b border-line">
        <div className="container-x py-24">
          <SectionHead eyebrow="Why it matters" title="Reuse decisions made early cost less later." intro="Deciding what moves, what stays, and what goes before crews are booked reduces wasted transport, avoids last-minute disposal, and gives donation partners time to collect." />
          <div className="mt-14 grid gap-10 md:ml-[180px] lg:grid-cols-2">
            <ul className="divide-y divide-line border-y border-line text-[14.5px]">
              {[
                ['Confirmed items only', 'The board shows confirmed and inspection items by default, so plans are built on reviewed counts.'],
                ['Notes for every action', 'Add handling instructions, supplier references, or donation contacts against each item.'],
                ['Inspection as a first-class step', 'Items that need someone on site are tracked, not forgotten.'],
                ['Exportable', 'Download the plan as CSV for crews, refurbishers, and finance.'],
              ].map(([t, b]) => (
                <li key={t} className="py-5"><h3 className="font-semibold">{t}</h3><p className="mt-1 text-muted">{b}</p></li>
              ))}
            </ul>
            <Photo src={PHOTOS.officeWide} alt="Empty office ready for relocation" className="aspect-[4/3]" position="center 70%" />
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
