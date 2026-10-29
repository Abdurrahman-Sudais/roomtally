import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageHero, SectionHead } from '../components/SiteLayout';
import { ActionTag, ConditionText, Photo, PHOTOS, StatusTag, useSeo } from '../components/ui';
import { seedItems, seedRooms } from '../data/seed';
import { FinalCta } from './Home';

export default function InventoryManagement() {
  useSeo('Inventory Management', 'Searchable, filterable furniture inventory records with confirmed quantities, condition notes, verified dimensions, and photograph references.', '/inventory-management');
  const sample = seedItems.slice(0, 6);
  return (
    <>
      <PageHero
        eyebrow="Inventory management"
        title="A furniture inventory that stays accurate after the survey."
        intro="Search, filter, and correct records by property, room, category, condition, review status, and proposed action. Every change is saved against the item with its evidence."
      >
        <Link to="/inventory/items" className="btn-primary">Open the inventory demo <ArrowRight size={15} /></Link>
      </PageHero>
      <section className="border-b border-line bg-stone-50">
        <div className="container-x py-16">
          <div className="panel overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-[13px]">
              <thead className="border-b border-line bg-stone-50 text-[11.5px] text-muted">
                <tr>{['Item ID', 'Description', 'Room', 'Qty', 'Status', 'Condition', 'Action'].map((h) => <th key={h} className="px-4 py-2.5 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody>
                {sample.map((i) => (
                  <tr key={i.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 font-mono text-[12px]">{i.id}</td>
                    <td className="px-4 py-3">{i.description}<div className="text-[11.5px] text-muted">{i.category}</div></td>
                    <td className="px-4 py-3">{seedRooms.find((r) => r.id === i.roomId)?.code}</td>
                    <td className="px-4 py-3 tabular-nums">{i.confirmedQuantity ?? <span className="text-muted">{i.proposedQuantity}?</span>}</td>
                    <td className="px-4 py-3"><StatusTag status={i.status} /></td>
                    <td className="px-4 py-3"><ConditionText condition={i.condition} /></td>
                    <td className="px-4 py-3"><ActionTag action={i.action} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[12px] text-muted">Sample inventory data from the fictional Meridian House workspace.</p>
        </div>
      </section>
      <section className="border-b border-line">
        <div className="container-x py-24">
          <SectionHead eyebrow="What a record holds" title="Ten fields that answer every move-day question." />
          <dl className="mt-14 grid gap-x-10 md:ml-[180px] md:grid-cols-2">
            {[
              ['Item ID', 'A stable reference used on labels, crates, and reports.'],
              ['Category & description', 'Consistent furniture types with a plain-language description.'],
              ['Property & room', 'Where the item is now — reassignable if the survey was wrong.'],
              ['Confirmed quantity', 'Separate from the proposed count until a reviewer signs it off.'],
              ['Survey status', 'Proposed, review required, confirmed, or manual inspection.'],
              ['Condition notes', 'User-confirmed observations with a simple condition grade.'],
              ['Verified dimensions', 'Width, depth, height in cm or mm, with the source recorded.'],
              ['Proposed action', 'Move, retain, refurbish, donate, inspect, or dispose.'],
              ['Photograph references', 'The survey images the record was built from.'],
              ['History', 'When the record last changed, and what changed.'],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[170px_1fr] gap-4 border-t border-line py-4">
                <dt className="text-[14px] font-semibold">{k}</dt>
                <dd className="text-[14px] text-muted">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <section className="border-b border-line">
        <div className="container-x grid gap-4 py-16 md:grid-cols-3">
          <Photo src={PHOTOS.officeDesks} alt="Rows of desks in an office" className="aspect-[4/3]" />
          <Photo src={PHOTOS.interior} alt="Lounge furniture in a workplace breakout space" className="aspect-[4/3]" />
          <Photo src={PHOTOS.workspace} alt="Individual workstation with chair" className="aspect-[4/3]" />
        </div>
      </section>
      <FinalCta />
    </>
  );
}
