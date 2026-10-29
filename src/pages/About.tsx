import { Link } from 'react-router-dom';
import { PageHero } from '../components/SiteLayout';
import { Photo, PHOTOS, useSeo } from '../components/ui';
import { FinalCta } from './Home';

export default function About() {
  useSeo('About', 'Roomtally was founded by Tunde Ogunleye to make furniture surveys, reuse decisions, and office relocations easier to plan.', '/about');
  return (
    <>
      <PageHero
        eyebrow="About"
        title="We think every chair deserves a decision."
        intro="Roomtally exists because too much good office furniture is lost, double-counted, or thrown away during relocations — not because nobody cared, but because nobody had a reliable list."
      />
      <section className="border-b border-line">
        <div className="container-x grid gap-12 py-20 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-6 text-[16px] leading-relaxed text-ink-soft">
            <p>
              Workplace moves are coordinated by many people at once: facilities managers, move coordinators, surveyors, refurbishers, and donation partners. Each keeps their own version of what is in the building. By move day, those versions rarely agree.
            </p>
            <p>
              Roomtally gives them one inventory to work from. Survey photographs and notes become proposed records. People review them, confirm quantities, record condition and verified dimensions, and assign a clear outcome to every item.
            </p>
            <p>
              We are deliberate about what software should and shouldn’t do here. Roomtally organises evidence and highlights what needs a human decision. It does not invent measurements, grade condition automatically, or put a price on your furniture.
            </p>
          </div>
          <Photo src={PHOTOS.interior} alt="Modern workplace interior with mixed furniture" className="aspect-[4/5]" />
        </div>
      </section>
      <section className="border-b border-line bg-stone-50">
        <div className="container-x grid gap-10 py-20 md:grid-cols-[180px_1fr]">
          <div className="eyebrow pt-1">Founder</div>
          <div className="grid gap-8 sm:grid-cols-[120px_1fr]">
            <div className="flex h-[120px] w-[120px] items-center justify-center border border-line bg-paper font-serif text-[44px]" aria-hidden="true">TO</div>
            <div>
              <h2 className="text-[22px] font-semibold tracking-tight">Tunde Ogunleye</h2>
              <p className="text-[14px] text-muted">Founder, Roomtally</p>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft">
                Tunde started Roomtally to bring structure to the part of a workplace transition that is usually handled last and in a hurry: knowing exactly what furniture exists, where it is, and what should happen to it.
              </p>
              <a href="mailto:tunde@roomtally.top" className="mt-5 inline-block text-[14px] underline decoration-line underline-offset-4 hover:decoration-ink">tunde@roomtally.top</a>
            </div>
          </div>
        </div>
      </section>
      <section className="border-b border-line">
        <div className="container-x grid gap-px border-x border-line bg-line py-0 sm:grid-cols-3">
          {[
            ['Evidence first', 'Every record traces back to what someone actually observed.'],
            ['People decide', 'Software proposes and organises. Reviewers confirm.'],
            ['Reuse by default', 'A clear inventory makes reuse and donation the easy path.'],
          ].map(([t, b]) => (
            <div key={t} className="bg-paper p-8"><h3 className="font-semibold">{t}</h3><p className="mt-2 text-[14px] text-muted">{b}</p></div>
          ))}
        </div>
      </section>
      <div className="container-x py-10 text-[14px]"><Link to="/contact" className="underline underline-offset-4">Get in touch →</Link></div>
      <FinalCta />
    </>
  );
}
