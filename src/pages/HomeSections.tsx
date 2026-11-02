import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Check, Clock, Compass, Lock, Mail, Rocket, ShieldCheck, Sparkles, X } from 'lucide-react';
import { SectionHead } from '../components/SiteLayout';
import { LeadForm } from '../components/LeadForm';
import { FOUNDERS, SITE, type Person } from '../config/site';
import { pricingConfig } from '../config/pricing';
import { PIPELINE, SAFEGUARDS } from './Trust';

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;
const Wrap = ({ id, tone = '', children }: { id?: string; tone?: string; children: ReactNode }) => (
  <section id={id} className={`border-b border-line ${tone}`}><div className="container-x py-24">{children}</div></section>
);

export function AiSection() {
  return (
    <Wrap>
      <SectionHead index="G" eyebrow="AI, used carefully" title="Answers from your own inventory, not guesses." intro="Roomtally’s assistant explains what the confirmed records say. Counts and actions come from people; the wording only makes them easier to read." />
      <div className="mt-14 grid gap-10 md:ml-[180px] lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <ul className="divide-y divide-line border-y border-line">
          {(
            [
              [true, 'Summarise a room or an item: quantity, condition, dimensions and proposed action'],
              [true, 'Answer “what still needs review?” and “summarise the relocation plan”'],
              [true, 'List the records it used, so every answer can be checked'],
              [true, 'Flag items with no verified dimensions'],
              [false, 'Value furniture or estimate resale prices'],
              [false, 'Estimate dimensions or whether something will fit from a photograph'],
            ] as const
          ).map(([ok, t], i) => (
            <li key={t} className="reveal flex gap-3 py-4 text-[14.5px]" style={d(i * 60)}>
              {ok ? <Check size={17} className="mt-0.5 shrink-0 text-teal" aria-label="Does" /> : <X size={17} className="mt-0.5 shrink-0 text-rust" aria-label="Never does" />}
              {t}
            </li>
          ))}
        </ul>
        <div className="reveal bg-navy p-6 text-paper" style={d(120)}>
          <div className="flex items-center gap-2 text-[14px] font-medium"><Bot size={16} className="text-[#9db0f5]" /> Ask about this inventory <span className="border border-white/20 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-paper/60">Sample data</span></div>
          <p className="ml-auto mt-5 w-fit max-w-[85%] bg-white/10 px-3 py-2 text-[14px]">What still needs review?</p>
          <div className="mt-3 max-w-[92%] border border-white/15 p-3 text-[14px] text-paper/85">
            <p><span className="font-mono">DG-01</span>: three observations of one sit-stand desk — duplicate review pending.</p>
            <p className="mt-2">Several records have proposed quantities nobody has confirmed yet.</p>
            <p className="mt-3 font-mono text-[11px] text-paper/50">From records DG-01, RT-0101…</p>
          </div>
          <p className="ml-auto mt-4 w-fit bg-white/10 px-3 py-2 text-[14px]">What are the chairs worth?</p>
          <div className="mt-3 max-w-[92%] border border-white/15 p-3 text-[14px] text-paper/70">That needs a person, not a guess. I can show recorded condition and the proposed action for each chair.</div>
          <Link to="/inventory" className="btn mt-6 border-paper bg-paper text-ink hover:bg-stone-100">Try the assistant in the demo <ArrowRight size={15} /></Link>
        </div>
      </div>
    </Wrap>
  );
}

export function SafeguardsSection() {
  return (
    <section className="border-b border-line bg-navy text-paper"><div className="container-x py-24">
      <div className="grid gap-6 md:grid-cols-[180px_1fr]">
        <div className="eyebrow reveal flex items-start gap-2 pt-2 !text-paper/60"><span className="mt-[0.45em] h-px w-5 bg-paper/60" aria-hidden />Safeguards</div>
        <h2 className="display reveal max-w-3xl text-[36px] sm:text-[48px]">Photos suggest. People confirm.</h2>
      </div>
      <div className="mt-14 grid gap-px border border-white/15 bg-white/15 md:ml-[180px] md:grid-cols-2 lg:grid-cols-3">
        {SAFEGUARDS.map(([t, b], i) => (
          <div key={t} className="reveal bg-navy p-6 transition-colors hover:bg-[#25314f]" style={d((i % 3) * 90)}>
            <ShieldCheck size={18} className="text-[#9db0f5]" />
            <h3 className="mt-3 font-semibold">{t}</h3>
            <p className="mt-2 text-[13.5px] text-paper/70">{b}</p>
          </div>
        ))}
      </div>
      <Link to="/security" className="mt-8 inline-flex items-center gap-2 text-[14px] font-medium text-[#9db0f5] hover:underline md:ml-[180px]">Security and safeguards in detail <ArrowRight size={15} /></Link>
    </div></section>
  );
}

export function TechnologySection() {
  return (
    <Wrap id="technology" tone="bg-stone-50">
      <SectionHead index="H" eyebrow="Technology" title="How we use Amazon Web Services." intro="A proposed serverless architecture: capture on site, keep every record tied to its room, let models suggest and people confirm, and use Amazon Bedrock only to explain." />
      <ol className="mt-14 grid gap-px border border-line bg-line md:ml-[180px] md:grid-cols-2 xl:grid-cols-5">
        {PIPELINE.map((p, i) => (
          <li key={p.step} className="reveal spot bg-paper p-5" style={d(i * 90)}>
            <span className="font-mono text-[12px] text-cobalt">{p.step}</span>
            <h3 className="mt-3 text-[16px] font-semibold">{p.title}</h3>
            <p className="mt-1 font-mono text-[10.5px] text-cobalt">{p.services}</p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-muted">{p.body}</p>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-[13px] text-muted md:ml-[180px]">These services are proposed, not deployed. The demo runs in your browser on sample data. <Link to="/technology" className="text-cobalt underline-offset-4 hover:underline">The full architecture</Link></p>
    </Wrap>
  );
}

export function PricingSection() {
  const fmt = (p: number | null) => (p === null ? 'Custom' : `${pricingConfig.currencySymbol}${p}`);
  return (
    <Wrap id="pricing">
      <SectionHead index="I" eyebrow="Pricing" title="Pay per project, or keep a live inventory." />
      <div className="mt-14 grid gap-px border border-line bg-line md:ml-[180px] lg:grid-cols-3">
        {pricingConfig.tiers.map((t, i) => (
          <div key={t.id} className={`reveal relative flex flex-col p-6 ${t.highlighted ? 'bg-ink text-paper' : 'bg-paper'}`} style={d(i * 100)}>
            {t.highlighted && <span className="absolute right-4 top-4 bg-cobalt px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white">Most popular</span>}
            <h3 className="text-[17px] font-semibold">{t.name}</h3>
            <p className={`mt-1 text-[13.5px] ${t.highlighted ? 'text-paper/70' : 'text-muted'}`}>{t.summary}</p>
            <div className="mt-5 flex items-baseline gap-1"><span className="display text-[48px]">{fmt(t.price)}</span><span className={t.highlighted ? 'text-paper/60' : 'text-muted'}>{t.price !== null && t.unit}</span></div>
            <ul className="mt-5 flex-1 space-y-2.5">
              {t.features.map((f) => <li key={f} className={`flex gap-2 text-[13.5px] ${t.highlighted ? 'text-paper/85' : 'text-ink-soft'}`}><Check size={15} className={`mt-0.5 shrink-0 ${t.highlighted ? 'text-[#9db0f5]' : 'text-teal'}`} /> {f}</li>)}
            </ul>
            <Link to={t.cta.to} className={`mt-6 ${t.highlighted ? 'btn border-paper bg-paper text-ink hover:bg-stone-100' : 'btn-secondary'}`}>{t.cta.label}</Link>
          </div>
        ))}
      </div>
      <p className="mt-6 text-[13px] text-muted md:ml-[180px]">{pricingConfig.note} Early-access teams are onboarded directly by the founders. <Link to="/pricing" className="text-cobalt underline-offset-4 hover:underline">Compare plans</Link></p>
    </Wrap>
  );
}

export const ROADMAP = [
  { icon: Sparkles, stage: 'Now', title: 'Live demo & early access', items: ['Interactive workspace for a fictional office building', 'Inventory, duplicate review, rooms, relocation board', 'Roles, audit log and grounded assistant', 'Early-access requests open'], current: true },
  { icon: Compass, stage: 'Next', title: 'Pilot on one property', items: ['Tablet survey capture with offline sync', 'Your own rooms and floor-plan schedule', 'Hand-over exports for the move crew and refurbisher'] },
  { icon: Rocket, stage: 'Then', title: 'General availability', items: ['Multiple properties and live inventories', 'Single sign-on with roles enforced on the server', 'Suggested item types and duplicates from photos', 'Donation and disposal records for ESG reporting'] },
  { icon: Clock, stage: 'Later', title: 'Exploring with pilot teams', items: ['CAFM and asset-register integrations', 'Refurbisher quote requests from condition notes', 'Reuse marketplace hand-off'] },
];

export function RoadmapSection() {
  return (
    <Wrap id="roadmap" tone="bg-stone-50">
      <SectionHead index="J" eyebrow="Roadmap" title="Where Roomtally is going." intro="Built with early-access teams. The order below is our plan and may change based on what pilots teach us." />
      <ol className="mt-14 grid gap-px border border-line bg-line md:ml-[180px] md:grid-cols-2 xl:grid-cols-4">
        {ROADMAP.map((r, i) => (
          <li key={r.stage} className={`reveal p-6 ${r.current ? 'bg-paper outline outline-2 -outline-offset-2 outline-cobalt' : 'bg-paper'}`} style={d(i * 100)}>
            <div className="flex items-center justify-between">
              <span className={`flex h-10 w-10 items-center justify-center ${r.current ? 'bg-cobalt text-white' : 'bg-stone-100 text-muted'}`}><r.icon size={18} /></span>
              <span className={`flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest ${r.current ? 'text-cobalt' : 'text-muted'}`}>{r.current && <span className="live-dot" aria-hidden />}{r.stage}</span>
            </div>
            <h3 className="mt-4 text-[16px] font-semibold">{r.title}</h3>
            <ul className="mt-3 space-y-2">{r.items.map((t) => <li key={t} className="flex gap-2 text-[13.5px] text-muted"><Check size={15} className={`mt-0.5 shrink-0 ${r.current ? 'text-teal' : 'text-stone-300'}`} /> {t}</li>)}</ul>
          </li>
        ))}
      </ol>
    </Wrap>
  );
}

export function PersonCard({ person, delay = 0 }: { person: Person; delay?: number }) {
  return (
    <article className="reveal lift spot border border-line bg-paper p-6 sm:p-8" style={d(delay)}>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="relative grid h-24 w-24 shrink-0 place-items-center" aria-hidden>
          <div className="spin-slow absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#2747b8,#1f5f5b,#9db0f5,#2747b8)]" style={{ animationDelay: `-${delay / 10}s` }} />
          <div className="absolute inset-[3px] grid place-items-center rounded-full bg-paper font-serif text-[30px] text-ink">{person.initials}</div>
        </div>
        <div>
          <p className="eyebrow !text-cobalt">{person.role}</p>
          <h3 className="display mt-1 text-[34px]">{person.name}</h3>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-soft">{person.bio}</p>
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Focus areas">{person.focus.map((f) => <li key={f} className="tag border-line text-ink-soft">{f}</li>)}</ul>
          {person.email && <a href={`mailto:${person.email}`} className="mt-4 inline-flex items-center gap-1.5 text-[14px] text-cobalt underline-offset-4 hover:underline"><Mail size={15} /> {person.email}</a>}
        </div>
      </div>
    </article>
  );
}

export function FoundersGrid() {
  return <div className="grid gap-5 lg:grid-cols-2">{FOUNDERS.map((p, i) => <PersonCard key={p.name} person={p} delay={i * 120} />)}</div>;
}

export function TeamSection() {
  return (
    <Wrap id="team">
      <SectionHead index="K" eyebrow="Team" title="The people building Roomtally." intro={`Founded by ${FOUNDERS.map((f) => f.name).join(' and ')}, and built together with the facilities managers, move coordinators and surveyors who will use it.`} />
      <div className="mt-14 md:ml-[180px]">
        <FoundersGrid />
        <div className="reveal mt-5 grid gap-6 border border-line bg-stone-50 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <h3 className="text-[17px] font-semibold">Building with facilities teams</h3>
            <p className="mt-2 text-[14px] text-muted">Roomtally is shaped by conversations with facilities managers, relocation planners and refurbishers. Early-access teams get a direct line to the founders and a say in what we build next.</p>
            <Link to="/about" className="mt-4 inline-flex items-center gap-2 text-[14px] font-medium text-cobalt hover:underline">Our story <ArrowRight size={15} /></Link>
          </div>
          <div>
            <p className="eyebrow">We’d like to hear from</p>
            <ul className="mt-3 space-y-2 text-[14px]">{['Teams with a move or refit coming up', 'Furniture surveyors and refurbishers', 'Advisors who know workplace relocations'].map((t) => <li key={t} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-teal" /> {t}</li>)}</ul>
          </div>
        </div>
      </div>
    </Wrap>
  );
}

export const FAQS: [string, string][] = [
  ['Does Roomtally count our furniture automatically?', 'No. Survey photographs and notes become proposed records, and a person confirms every quantity. Possible duplicates are reviewed side by side before anything is merged.'],
  ['What problem does it actually solve?', 'Before a move or refit, furniture is counted on clipboards and spreadsheets by several people, and the numbers rarely agree by move day. Roomtally keeps one reviewable inventory per room, with condition, dimensions and a planned action for every item.'],
  ['Does it value our furniture?', 'No. Condition is recorded by the reviewer, and Roomtally never assigns a resale value. Refurbishers and buyers can quote from condition notes and verified dimensions.'],
  ['Where do dimensions come from?', 'They are entered, imported or measured on site, always with explicit units. Nothing is estimated from photographs.'],
  ['What happens to furniture we don’t move?', 'Each item gets an action — move, retain, refurbish, donate, inspect or dispose — and the plan exports for the move crew, refurbishers and donation partners, with a record of what left.'],
  ['Who can change what?', 'Facilities managers, relocation planners, site surveyors and viewers each get only the actions they need, and every change is written to an audit log. Try “Demo as” in the workspace.'],
  ['What does the AI do?', 'It answers questions from your confirmed records and lists the ones it used. It never values furniture, estimates dimensions or decides whether something will fit.'],
  ['Do we need special hardware?', 'No. Surveyors use a phone or tablet. Floor plans can be imported as a room schedule.'],
  ['How much does it cost?', 'Survey projects start at $39 per project; live inventories and enterprise plans are on the pricing page. Prices exclude taxes.'],
  ['Is it available today?', 'Roomtally is in early access. The demo workspace runs in your browser on sample data; a pilot runs on one of your properties. Request early access and one of the founders will reply personally.'],
];

export function FaqSection() {
  return (
    <Wrap id="faq" tone="bg-stone-50">
      <SectionHead index="L" eyebrow="FAQ" title="Questions facilities teams ask." />
      <div className="mt-14 grid gap-10 md:ml-[180px] lg:grid-cols-[1fr_2fr]">
        <div className="reveal"><p className="text-muted">Can’t find your answer?</p><a href={`mailto:${SITE.email}`} className="mt-2 inline-flex items-center gap-2 font-medium text-cobalt hover:underline"><Mail size={15} /> Email the founders</a></div>
        <div className="divide-y divide-line border border-line bg-paper">
          {FAQS.map(([q, a]) => (
            <details key={q} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">{q}<span className="grid h-6 w-6 shrink-0 place-items-center border border-line text-cobalt transition-transform duration-300 group-open:rotate-45" aria-hidden>+</span></summary>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </Wrap>
  );
}

export function EarlyAccessSection() {
  return (
    <Wrap id="early-access">
      <SectionHead index="M" eyebrow="Early access" title="Request early access." intro="Early-access teams get guided setup on one property and a direct say in what we build next." />
      <div className="mt-14 grid gap-8 md:ml-[180px] lg:grid-cols-[1.4fr_1fr]">
        <div className="panel p-6 sm:p-8"><LeadForm compact /></div>
        <div className="space-y-5">
          <ul className="space-y-3 text-[14px]">
            {['Guided setup on one property', 'Direct line to the founders', 'Launch pricing on any plan', 'No commitment — a request is not a subscription'].map((t) => <li key={t} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-teal" /> {t}</li>)}
            <li className="flex gap-2 text-muted"><Lock size={16} className="mt-0.5 shrink-0" /> Please don’t include confidential client data.</li>
          </ul>
          <div className="bg-navy p-5 text-paper">
            <p className="eyebrow !text-paper/60">What happens next</p>
            <ol className="mt-3 space-y-2 text-[14px] text-paper/80"><li>1. A founder replies to arrange a short call.</li><li>2. We look at your building, floors and timeline.</li><li>3. If it’s a fit, we scope a pilot on one property.</li></ol>
          </div>
        </div>
      </div>
    </Wrap>
  );
}
