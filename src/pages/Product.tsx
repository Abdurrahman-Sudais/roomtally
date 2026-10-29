import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Camera, Copy, FileSpreadsheet, KanbanSquare, Ruler } from 'lucide-react';
import { DashboardMockup } from '../components/DashboardMockup';
import { PageHero, SectionHead } from '../components/SiteLayout';
import { Photo, PHOTOS, useSeo } from '../components/ui';
import { FinalCta } from './Home';

export default function Product() {
  useSeo('Product', 'Roomtally brings properties, rooms, survey observations, furniture records, duplicate review, and relocation planning into one reviewable workspace.', '/product');
  const modules = [
    { icon: Building2, t: 'Properties and rooms', b: 'A clear structure for every building, floor, and room — the anchor for every furniture record.' },
    { icon: Camera, t: 'Survey observations', b: 'Photographs and notes with timestamps, surveyor, and location, retained as evidence.' },
    { icon: FileSpreadsheet, t: 'Furniture inventory', b: 'Editable records with category, quantity, condition, dimensions, and proposed action.' },
    { icon: Copy, t: 'Duplicate review', b: 'Side-by-side comparison of observations that may represent the same physical item.' },
    { icon: Ruler, t: 'Dimensions and condition', b: 'Verified measurements with explicit units and source; condition from site observation only.' },
    { icon: KanbanSquare, t: 'Relocation plan', b: 'A planning board that groups confirmed items by outcome, with notes for each team.' },
  ];
  return (
    <>
      <PageHero
        eyebrow="Product"
        title="One workspace from site survey to move day."
        intro="Roomtally replaces the survey spreadsheet, the photo folder, and the email thread with a single inventory your whole project team can review and act on."
      >
        <Link to="/inventory" className="btn-primary">Open the demo workspace <ArrowRight size={15} /></Link>
        <Link to="/pricing" className="btn-secondary">View pricing</Link>
      </PageHero>
      <section className="border-b border-line bg-stone-50">
        <div className="container-x py-16"><DashboardMockup /></div>
      </section>
      <section className="border-b border-line">
        <div className="container-x py-24">
          <SectionHead eyebrow="Modules" title="Everything the inventory needs, nothing it doesn’t." />
          <div className="mt-14 grid gap-px border border-line bg-line md:ml-[180px] sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((m) => (
              <div key={m.t} className="bg-paper p-7">
                <m.icon size={18} strokeWidth={1.5} className="text-cobalt" />
                <h3 className="mt-5 text-[16px] font-semibold">{m.t}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{m.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="border-b border-line">
        <div className="container-x grid gap-12 py-24 lg:grid-cols-2 lg:items-center">
          <Photo src={PHOTOS.plans} alt="Architectural floor plans on a desk" className="aspect-[4/3]" />
          <div>
            <div className="eyebrow mb-4">Principles</div>
            <h2 className="display text-[40px]">Proposed by the system. Decided by people.</h2>
            <ul className="mt-8 space-y-5 text-[15px] leading-relaxed text-ink-soft">
              <li><strong className="font-semibold text-ink">Every record is traceable.</strong> Each item links back to the photographs and notes it came from.</li>
              <li><strong className="font-semibold text-ink">No invented measurements.</strong> Dimensions are entered, imported from an FF&E schedule, or measured on site — never estimated from a photo.</li>
              <li><strong className="font-semibold text-ink">No automatic valuations.</strong> Roomtally does not price furniture from photographs. Resale and refurbishment decisions stay with your specialists.</li>
              <li><strong className="font-semibold text-ink">Exports you can use.</strong> CSV inventory reports open cleanly in Excel, Sheets, or your CAFM import tool.</li>
            </ul>
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
