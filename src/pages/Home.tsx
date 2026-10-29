import { Link } from 'react-router-dom';
import { ArrowRight, Camera, ClipboardCheck, Copy, FileText, Ruler, Tags } from 'lucide-react';
import { DashboardMockup } from '../components/DashboardMockup';
import { SectionHead } from '../components/SiteLayout';
import { ActionTag, Photo, PHOTOS, PhotoRef, StatusTag, useSeo } from '../components/ui';
import type { Action } from '../data/types';

export function HowSteps() {
  const steps = [
    { n: '01', title: 'Create a property and rooms', body: 'Set up the building, floors, and rooms — by hand or from a floor plan schedule — so every record has a place.' },
    { n: '02', title: 'Add survey photographs and notes', body: 'Surveyors attach room photographs and short notes as they walk the space. Each becomes a referenced observation.' },
    { n: '03', title: 'Review proposed furniture records', body: 'Observations are organised into proposed records. Your team checks each one, resolves possible duplicates, and corrects details.' },
    { n: '04', title: 'Confirm quantities and plan actions', body: 'Confirmed items are assigned to move, retain, refurbish, donate, inspect, or dispose — and exported for the move team.' },
  ];
  return (
    <ol className="grid border-t border-line md:grid-cols-4">
      {steps.map((s) => (
        <li key={s.n} className="border-b border-line py-8 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
          <div className="font-mono text-[12px] text-cobalt">{s.n}</div>
          <h3 className="mt-6 text-[17px] font-semibold tracking-tight">{s.title}</h3>
          <p className="mt-3 text-[14px] leading-relaxed text-muted">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

export function FinalCta() {
  return (
    <section className="bg-navy text-paper">
      <div className="container-x grid items-end gap-10 py-20 md:grid-cols-[1.4fr_1fr]">
        <h2 className="display text-[40px] sm:text-[56px]">Make your next workplace transition easier to plan.</h2>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <Link to="/inventory" className="btn border-paper bg-paper text-ink hover:bg-stone-100">Explore the Inventory <ArrowRight size={16} /></Link>
          <Link to="/contact" className="btn border-paper/30 text-paper hover:border-paper">Talk to Tunde</Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  useSeo(
    'Roomtally — Furniture inventory and reuse planning for office relocations',
    'Turn office surveys and room photographs into an editable furniture inventory your team can review, organise, and act on before a relocation or refurbishment.',
    '/',
  );

  const outcomes: { a: Action; body: string }[] = [
    { a: 'move', body: 'Travels to the new site. Grouped by destination floor for the move crew.' },
    { a: 'retain', body: 'Stays with the building — landlord assets, fixed joinery, or items kept in place.' },
    { a: 'refurbish', body: 'Re-covered, repaired, or refinished before reuse. Batched for supplier quotes.' },
    { a: 'donate', body: 'Offered to charities, schools, or community organisations, with a record of what left.' },
    { a: 'inspect', body: 'Needs someone on site before a decision — fixings, safety, ownership, or condition.' },
    { a: 'dispose', body: 'Unsafe or beyond economic repair. Routed to a compliant recycler, not a skip.' },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="grid-paper absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="container-x relative grid gap-14 pb-20 pt-16 xl:grid-cols-[1fr_1.12fr] xl:items-center lg:pt-24">
          <div>
            <div className="eyebrow mb-6">Know what you have before you move.</div>
            <h1 className="display text-[48px] sm:text-[68px] lg:text-[76px]">
              Every item accounted for. <em className="text-cobalt">Every move</em> better planned.
            </h1>
            <p className="mt-7 max-w-lg text-[17px] leading-relaxed text-ink-soft">
              Turn office surveys and room photographs into an editable furniture inventory your team can review, organise, and act on.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/inventory" className="btn-primary h-11 px-5">Explore the Inventory <ArrowRight size={16} /></Link>
              <Link to="/how-it-works" className="btn-secondary h-11 px-5">See How It Works</Link>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-5 text-[12px]">
              {[['Rooms', 'mapped to plan'], ['Records', 'reviewed by people'], ['Actions', 'ready for the move']].map(([k, v]) => (
                <div key={k}><dt className="font-semibold text-ink">{k}</dt><dd className="text-muted">{v}</dd></div>
              ))}
            </dl>
          </div>
          <DashboardMockup />
        </div>
      </section>

      {/* A. Problem */}
      <section className="border-b border-line">
        <div className="container-x py-24">
          <SectionHead
            index="A"
            eyebrow="The problem"
            title="Furniture surveys still run on clipboards, spreadsheets, and memory."
            intro="Before a relocation or refurbishment, someone has to walk every floor, count every chair, and work out what can be reused. It takes days, involves several people, and the result is rarely trusted by the time the move is booked."
          />
          <div className="mt-14 grid gap-10 md:grid-cols-[180px_1fr]">
            <div />
            <div className="grid gap-px border border-line bg-line sm:grid-cols-3">
              {[
                ['2–4 days', 'Typical on-site time to survey a 300-desk floor plate by hand.'],
                ['4+ people', 'Facilities, the move coordinator, the surveyor, and the refurbisher all keep their own counts.'],
                ['Last-minute', 'Discrepancies are discovered on move day, when changes are most expensive.'],
              ].map(([k, v]) => (
                <div key={k} className="bg-paper p-6">
                  <div className="display text-[34px]">{k}</div>
                  <p className="mt-3 text-[14px] leading-relaxed text-muted">{v}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-4 text-right text-[11.5px] text-muted md:ml-[180px]">Figures are indicative examples drawn from typical relocation projects, not measured Roomtally outcomes.</p>
          <div className="mt-14 grid gap-4 md:ml-[180px] md:grid-cols-[1.5fr_1fr]">
            <Photo src={PHOTOS.officeWide} alt="Open-plan office floor before a relocation" className="aspect-[16/10]" caption="Open workspace — before survey" />
            <Photo src={PHOTOS.chairs} alt="Office chairs grouped in a meeting space" className="aspect-[16/10] md:aspect-auto" position="center 60%" />
          </div>
        </div>
      </section>

      {/* B. Photographs to inventory */}
      <section className="border-b border-line bg-stone-50">
        <div className="container-x py-24">
          <SectionHead
            index="B"
            eyebrow="From photographs"
            title="From photographs to a structured inventory."
            intro="Surveyors capture what they see. Roomtally organises each photograph and note into a proposed record — category, description, room, and count — so nobody re-types a clipboard."
          />
          <div className="mt-14 grid items-stretch gap-4 md:ml-[180px] lg:grid-cols-[1fr_auto_1.3fr]">
            <div className="panel p-5">
              <div className="eyebrow mb-4 flex items-center gap-2"><Camera size={13} /> Observation</div>
              <div className="flex gap-4">
                <PhotoRef name="MH-3.01-014.jpg" />
                <dl className="space-y-1.5 text-[13px]">
                  <div><dt className="inline text-muted">Room </dt><dd className="inline">3.01 Open workspace — North</dd></div>
                  <div><dt className="inline text-muted">Taken </dt><dd className="inline">14 Oct, 09:41 · A. Mensah</dd></div>
                  <div><dt className="inline text-muted">Note </dt><dd className="inline">“Six white benches, 4-person, cable trays on all.”</dd></div>
                </dl>
              </div>
            </div>
            <div className="flex items-center justify-center text-stone-400" aria-hidden="true"><ArrowRight className="rotate-90 lg:rotate-0" /></div>
            <div className="panel">
              <div className="flex items-center justify-between border-b border-line px-5 py-3">
                <div className="eyebrow flex items-center gap-2"><FileText size={13} /> Proposed record</div>
                <StatusTag status="proposed" />
              </div>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 px-5 py-4 text-[13px]">
                {[
                  ['Item ID', 'RT-0101'], ['Category', 'Desk'], ['Description', 'Bench desk, 4-person, white laminate'],
                  ['Room', '3.01'], ['Proposed quantity', '6'], ['Dimensions', 'Not yet verified'],
                ].map(([k, v]) => (
                  <div key={k}><dt className="text-[11.5px] text-muted">{k}</dt><dd className={k === 'Item ID' ? 'font-mono' : ''}>{v}</dd></div>
                ))}
              </dl>
              <p className="border-t border-line px-5 py-3 text-[12px] text-muted">
                Proposed records are suggestions for a person to review. Dimensions and condition are never inferred from a photograph.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* C. Review */}
      <section className="border-b border-line">
        <div className="container-x py-24">
          <SectionHead
            index="C"
            eyebrow="Review"
            title="Review before you decide."
            intro="Nothing reaches the relocation plan until a person has checked it. Roomtally gives reviewers a clear queue and the evidence behind each record."
          />
          <div className="mt-14 grid gap-px border border-line bg-line md:ml-[180px] sm:grid-cols-2 lg:grid-cols-5">
            {[
              { icon: Copy, t: 'Duplicate resolution', b: 'Compare observations that may show the same item and decide whether they are one or many.' },
              { icon: ClipboardCheck, t: 'Quantity confirmation', b: 'Proposed counts stay proposed until a reviewer confirms them.' },
              { icon: Tags, t: 'Condition notes', b: 'Record what was observed on site, in the surveyor’s words, with a condition grade.' },
              { icon: Ruler, t: 'Dimensions', b: 'Entered, imported, or measured — always with explicit units and a stated source.' },
              { icon: ArrowRight, t: 'Action assignment', b: 'Assign each confirmed item an outcome and a note for the people who will carry it out.' },
            ].map((f) => (
              <div key={f.t} className="bg-paper p-6">
                <f.icon size={18} className="text-cobalt" strokeWidth={1.5} />
                <h3 className="mt-5 text-[15px] font-semibold">{f.t}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{f.b}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex md:ml-[180px]">
            <Link to="/inventory/duplicates" className="btn-secondary">Try the duplicate review demo <ArrowRight size={15} /></Link>
          </div>
        </div>
      </section>

      {/* D. Reuse & relocation */}
      <section className="border-b border-line bg-stone-50">
        <div className="container-x py-24">
          <SectionHead
            index="D"
            eyebrow="Reuse planning"
            title="Six outcomes. One plan everyone can see."
            intro="Every confirmed item gets a proposed action. The move crew, refurbisher, and donation partner all work from the same list."
          />
          <div className="mt-14 grid gap-px border border-line bg-line md:ml-[180px] sm:grid-cols-2 lg:grid-cols-3">
            {outcomes.map((o) => (
              <div key={o.a} className="bg-paper p-6">
                <ActionTag action={o.a} />
                <p className="mt-4 text-[14px] leading-relaxed text-ink-soft">{o.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* E. How it works */}
      <section className="border-b border-line">
        <div className="container-x py-24">
          <SectionHead index="E" eyebrow="How it works" title="Four steps from walkthrough to move plan." />
          <div className="mt-14 md:ml-[180px]"><HowSteps /></div>
        </div>
      </section>

      {/* F. Audience */}
      <section className="border-b border-line">
        <div className="container-x py-24">
          <SectionHead index="F" eyebrow="Who it’s for" title="Built for facilities and relocation teams." />
          <div className="mt-14 grid gap-10 md:ml-[180px] lg:grid-cols-[1fr_1.1fr]">
            <ul className="divide-y divide-line border-y border-line">
              {[
                ['Facilities managers', 'Keep a living inventory of every floor, not a spreadsheet from the last move.'],
                ['Move coordinators', 'Plan crews, crates, and sequencing from confirmed counts rather than estimates.'],
                ['Furniture surveyors', 'Capture photographs and notes on site, then hand over a reviewable record.'],
                ['Refurbishment companies', 'Quote from condition notes and verified dimensions, grouped by item type.'],
              ].map(([t, b]) => (
                <li key={t} className="grid gap-2 py-5 sm:grid-cols-[200px_1fr]">
                  <h3 className="text-[15px] font-semibold">{t}</h3>
                  <p className="text-[14px] leading-relaxed text-muted">{b}</p>
                </li>
              ))}
            </ul>
            <Photo src={PHOTOS.team} alt="Facilities team reviewing plans at a table" className="aspect-[4/3]" />
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
