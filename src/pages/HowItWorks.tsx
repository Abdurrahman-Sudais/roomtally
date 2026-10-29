import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageHero, SectionHead } from '../components/SiteLayout';
import { Photo, PHOTOS, useSeo } from '../components/ui';
import { FinalCta, HowSteps } from './Home';

export default function HowItWorks() {
  useSeo('How It Works', 'Create a property and rooms, add survey photographs and notes, review proposed furniture records, then confirm quantities and plan actions.', '/how-it-works');
  const detail = [
    {
      n: '01', t: 'Create a property and rooms',
      b: 'Add the building and its floors, then create rooms by hand or import them from a floor plan schedule. Room codes match your drawings so records line up with the plan.',
      list: ['Property, address, and floors', 'Room codes, names, types, and net area', 'Schematic plan for quick orientation'],
    },
    {
      n: '02', t: 'Add survey photographs and notes',
      b: 'Surveyors walk each room, photographing furniture groups and writing short notes. Each photograph becomes an observation with a timestamp, surveyor, and location.',
      list: ['Photograph references retained as evidence', 'Free-text surveyor notes', 'Observations linked to rooms'],
    },
    {
      n: '03', t: 'Review proposed furniture records',
      b: 'Observations are organised into proposed records for a reviewer to check. Where two or more observations might show the same item, they appear in the duplicate review queue.',
      list: ['Proposed category, description, and count', 'Possible duplicates flagged for a decision', 'Corrections made in place'],
    },
    {
      n: '04', t: 'Confirm quantities and plan actions',
      b: 'Reviewers confirm counts, add condition notes and verified dimensions, and assign each item an outcome. The planning board and CSV export are ready for the move team.',
      list: ['Confirmed quantities kept separate from proposed', 'Move, retain, refurbish, donate, inspect, dispose', 'CSV reports for every stakeholder'],
    },
  ];
  return (
    <>
      <PageHero eyebrow="How it works" title="From walkthrough to move plan in four steps." intro="Roomtally fits the way surveys already happen. It just makes the result structured, reviewable, and shared.">
        <Link to="/inventory" className="btn-primary">Try it with sample data <ArrowRight size={15} /></Link>
      </PageHero>
      <section className="border-b border-line">
        <div className="container-x py-16"><HowSteps /></div>
      </section>
      {detail.map((d, idx) => (
        <section key={d.n} className={`border-b border-line ${idx % 2 ? 'bg-stone-50' : ''}`}>
          <div className="container-x py-20">
            <SectionHead index={d.n} eyebrow="Step" title={d.t} intro={d.b} />
            <ul className="mt-8 grid gap-px border border-line bg-line md:ml-[180px] sm:grid-cols-3">
              {d.list.map((l) => <li key={l} className="bg-paper p-5 text-[14px]">{l}</li>)}
            </ul>
          </div>
        </section>
      ))}
      <section className="border-b border-line">
        <div className="container-x py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <div className="eyebrow mb-4">A note on automation</div>
              <h2 className="display text-[36px]">Assistance, not guesswork.</h2>
              <p className="mt-5 text-[15px] leading-relaxed text-ink-soft">
                Roomtally proposes records and highlights possible duplicates so people review less from scratch. It does not measure furniture from photographs, grade condition automatically, or estimate resale value. In this demonstration, all proposed records and matches are simulated from sample data.
              </p>
            </div>
            <Photo src={PHOTOS.plans} alt="Floor plan drawings being reviewed" className="aspect-[16/10]" position="center 40%" />
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
