import { PageHero, SectionHead } from '../components/SiteLayout';
import { FoundersGrid, RoadmapSection } from './HomeSections';
import { Photo, PHOTOS, useSeo } from '../components/ui';
import { FinalCta } from './Home';

export default function About() {
  useSeo('About & team', 'Roomtally was founded by Tunde Ogunleye and Yusuf Abdulhamid to make furniture surveys, reuse decisions, and office relocations easier to plan.', '/about');
  return (
    <>
      <PageHero
        eyebrow="About"
        title="We think every chair deserves a decision."
        intro="Roomtally exists because too much good office furniture is lost, double-counted, or thrown away during relocations — not because nobody cared, but because nobody had a reliable list."
      />
      <section className="border-b border-line">
        <div className="container-x grid gap-12 py-20 lg:grid-cols-[1.1fr_1fr]">
          <div className="reveal space-y-6 text-[16px] leading-relaxed text-ink-soft">
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
      <section id="team" className="border-b border-line bg-stone-50">
        <div className="container-x py-20">
          <SectionHead eyebrow="Founding team" title="The people behind Roomtally." />
          <div className="mt-12 md:ml-[180px]"><FoundersGrid /></div>
        </div>
      </section>
      <section className="border-b border-line">
        <div className="container-x grid gap-px border-x border-line bg-line py-0 sm:grid-cols-3">
          {[
            ['Evidence first', 'Every record traces back to what someone actually observed.'],
            ['People decide', 'Software proposes and organises. Reviewers confirm.'],
            ['Reuse by default', 'A clear inventory makes reuse and donation the easy path.'],
          ].map(([t, b]) => (
            <div key={t} className="reveal spot bg-paper p-8"><h3 className="font-semibold">{t}</h3><p className="mt-2 text-[14px] text-muted">{b}</p></div>
          ))}
        </div>
      </section>
      <section className="border-b border-line"><div className="container-x py-16">
        <blockquote className="reveal md:ml-[180px]"><p className="eyebrow !text-cobalt">Our mission</p><p className="display mt-3 max-w-3xl text-[36px] sm:text-[44px]">Make reuse the easy path — by knowing exactly what you have.</p></blockquote>
      </div></section>
      <RoadmapSection />
      <FinalCta />
    </>
  );
}
