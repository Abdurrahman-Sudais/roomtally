import { Link } from 'react-router-dom';
import type { CSSProperties, ReactNode } from 'react';
import { AlertTriangle, ArrowRight, Camera, Check, CheckCircle2, ClipboardCheck, Copy, ExternalLink, FileText, Minus, Ruler, Tags, X } from 'lucide-react';
import { useCountUp, useCycle } from '../lib/motion';
import { AiSection, EarlyAccessSection, FaqSection, PricingSection, RoadmapSection, SafeguardsSection, TeamSection, TechnologySection } from './HomeSections';
import { DashboardMockup } from '../components/DashboardMockup';
import { SectionHead } from '../components/SiteLayout';
import { ActionTag, Photo, PHOTOS, PhotoRef, StatusTag, useSeo } from '../components/ui';
import type { Action } from '../data/types';

const dl = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

/** Published figures used in the problem section. Each one links to its source. */
export const PROBLEM_STATS = [
  { value: 8.5, decimals: 1, prefix: '', suffix: 'M t', label: 'of office furniture end up in US landfills each year, by EPA estimates.', source: 'EPA estimate, via CleanTechnica (2017)', url: 'https://cleantechnica.com/2017/11/07/a-hidden-waste-issue-8-5-million-tons-of-office-furniture-goes-to-landfills-annually' },
  { value: 50, decimals: 0, prefix: '', suffix: '%', label: 'of UK organisations are still sending unwanted office furniture to landfill.', source: 'Business Moves survey, via Workplace Insight', url: 'https://workplaceinsight.net/half-of-firms-are-still-sending-unwanted-office-furniture-to-landfill/' },
  { value: 40, decimals: 0, prefix: '>', suffix: '%', label: 'of stored furniture could realistically be reused within their own organisations, facilities managers estimate.', source: 'Business Moves, Furniture Futures white paper', url: 'https://businessmoves.com/our-stories/furniture-futures-sustainable-strategies-for-better-workplaces' },
];

const OUTCOME_WORDS = ['move day.', 'the refit starts.', 'the skip arrives.', 'the lease ends.'] as const;
const BUILT_FOR = ['Office relocations', 'Refurbishments', 'Floor consolidations', 'Lease exits', 'Hybrid-work redesigns', 'Sit-stand desks', 'Task chairs', 'Meeting tables', 'Storage & pedestals', 'Reuse & donation', 'Refurbishers', 'Move coordinators', 'Facilities teams'];

function FloatCard({ className, icon, title, body, style }: { className: string; icon: ReactNode; title: string; body: string; style?: CSSProperties }) {
  return (
    <div className={`absolute z-10 max-w-[17rem] items-start gap-3 border border-line bg-paper/95 p-3 shadow-[0_20px_40px_-22px_rgba(29,29,27,0.5)] backdrop-blur ${className}`} style={style} aria-hidden>
      <span className="mt-0.5">{icon}</span>
      <span><span className="block text-[12px] font-semibold">{title}</span><span className="mt-0.5 block text-[12px] text-muted">{body}</span></span>
    </div>
  );
}

function Stat({ value, decimals, prefix, suffix, label, source, url, delay }: (typeof PROBLEM_STATS)[number] & { delay: number }) {
  const [ref, n] = useCountUp<HTMLDivElement>(value);
  return (
    <figure className="reveal spot bg-paper p-6" style={dl(delay)}>
      <div ref={ref} className="display text-[48px] tabular-nums">{prefix}{n.toFixed(decimals)}<span className="text-cobalt">{suffix}</span></div>
      <figcaption>
        <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">{label}</p>
        <a href={url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-start gap-1 text-[11.5px] text-muted hover:text-cobalt">Source: {source} <ExternalLink size={11} className="mt-0.5 shrink-0" /></a>
      </figcaption>
    </figure>
  );
}

function Marquee() {
  const row = [...BUILT_FOR, ...BUILT_FOR];
  return (
    <section aria-label="Built for" className="marquee overflow-hidden border-b border-line bg-stone-50 py-6">
      <p className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Built for teams planning</p>
      <div className="[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <ul className="marquee-track flex w-max gap-10">
          {row.map((t, i) => <li key={i} aria-hidden={i >= BUILT_FOR.length} className="flex items-center gap-10 whitespace-nowrap font-serif text-[24px] text-stone-400">{t}<span className="h-1.5 w-1.5 bg-cobalt/50" /></li>)}
        </ul>
      </div>
    </section>
  );
}

function SolutionSection() {
  const today = ['Counts live on clipboards and in several spreadsheets that never agree.', 'The same desk is counted twice from two photographs.', 'Dimensions are guessed from photos — and the item doesn’t fit the lift.', 'Reuse decisions are made on move day, when changes cost the most.', 'Nobody can say afterwards what was donated, refurbished or skipped.'];
  const withRt = ['One reviewable inventory per room, built from survey photos and notes.', 'Possible duplicates are reviewed side by side before quantities are confirmed.', 'Dimensions are measured or imported with units — never estimated.', 'Every item gets a planned action weeks before the move.', 'Every decision is recorded, exported and auditable.'];
  return (
    <section id="solution" className="border-b border-line bg-navy text-paper"><div className="container-x py-24">
      <div className="grid gap-6 md:grid-cols-[180px_1fr]">
        <div className="eyebrow reveal flex items-start gap-2 pt-2 !text-paper/60"><span className="mt-[0.45em] h-px w-5 bg-paper/60" aria-hidden />What we solve</div>
        <h2 className="display reveal max-w-3xl text-[36px] sm:text-[48px]">From clipboards and guesswork to one inventory everyone trusts.</h2>
      </div>
      <div className="mt-14 grid gap-px border border-white/15 bg-white/15 md:ml-[180px] lg:grid-cols-2">
        <div className="reveal bg-navy p-6 sm:p-8">
          <p className="eyebrow flex items-center gap-2 !text-paper/60"><X size={14} className="text-[#e89a87]" /> Today</p>
          <ul className="mt-5 space-y-4">{today.map((t) => <li key={t} className="flex gap-3 text-paper/70"><Minus size={16} className="mt-1 shrink-0 text-paper/40" /> {t}</li>)}</ul>
        </div>
        <div className="reveal bg-[#25314f] p-6 sm:p-8" style={dl(120)}>
          <p className="eyebrow flex items-center gap-2 !text-[#9db0f5]"><Check size={14} /> With Roomtally</p>
          <ul className="mt-5 space-y-4">{withRt.map((t) => <li key={t} className="flex gap-3"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#9db0f5]" /> {t}</li>)}</ul>
        </div>
      </div>
    </div></section>
  );
}

type Cell = { v: 'yes' | 'no' | 'part'; t: string };
const COMPARE: { row: string; cols: [Cell, Cell, Cell, Cell] }[] = [
  { row: 'One count per room that everyone works from', cols: [{ v: 'no', t: 'Several versions' }, { v: 'part', t: 'If someone maintains it' }, { v: 'part', t: 'Surveyor’s copy' }, { v: 'yes', t: 'Shared, reviewed inventory' }] },
  { row: 'Catches the same item counted twice', cols: [{ v: 'no', t: 'Rarely' }, { v: 'no', t: 'Manual cross-check' }, { v: 'part', t: 'Depends on the surveyor' }, { v: 'yes', t: 'Side-by-side duplicate review' }] },
  { row: 'Dimensions you can trust', cols: [{ v: 'part', t: 'Sometimes noted' }, { v: 'part', t: 'Free text' }, { v: 'yes', t: 'Measured on site' }, { v: 'yes', t: 'Measured or imported, with units' }] },
  { row: 'A planned action for every item', cols: [{ v: 'no', t: 'Decided on move day' }, { v: 'part', t: 'A column, if added' }, { v: 'part', t: 'Separate report' }, { v: 'yes', t: 'Move, retain, refurbish, donate…' }] },
  { row: 'A record of what was reused or disposed of', cols: [{ v: 'no', t: 'Lost' }, { v: 'part', t: 'If kept up to date' }, { v: 'no', t: 'Out of scope' }, { v: 'yes', t: 'Exported and audited' }] },
  { row: 'Live after the move', cols: [{ v: 'no', t: 'Filed away' }, { v: 'part', t: 'Goes stale' }, { v: 'no', t: 'One-off' }, { v: 'yes', t: 'Living inventory per floor' }] },
];

function CompareSection() {
  const heads = ['Clipboards & paper', 'Spreadsheets', 'One-off survey reports', 'Roomtally'];
  const Icon = ({ v }: { v: Cell['v'] }) => (v === 'yes' ? <Check size={15} className="shrink-0 text-teal" aria-label="Yes" /> : v === 'no' ? <X size={15} className="shrink-0 text-rust" aria-label="No" /> : <Minus size={15} className="shrink-0 text-amber" aria-label="Partly" />);
  return (
    <section id="compare" className="border-b border-line"><div className="container-x py-24">
      <SectionHead eyebrow="Why Roomtally" title="How it compares with the way furniture is counted today." intro="Roomtally works alongside your surveyors, move coordinators and refurbishers — it gives them one inventory to work from." />
      <div className="reveal mt-14 overflow-x-auto border border-line md:ml-[180px]">
        <table className="w-full min-w-[760px] text-left text-[13.5px]">
          <thead><tr className="border-b border-line bg-stone-50"><th className="p-4 font-normal"><span className="sr-only">Capability</span></th>{heads.map((h, i) => <th key={h} className={`p-4 font-semibold ${i === 3 ? 'bg-ink text-paper' : 'text-ink-soft'}`}>{h}</th>)}</tr></thead>
          <tbody>
            {COMPARE.map((r) => (
              <tr key={r.row} className="border-b border-line last:border-0">
                <th scope="row" className="p-4 font-medium">{r.row}</th>
                {r.cols.map((c, i) => <td key={i} className={`p-4 align-top ${i === 3 ? 'bg-cobalt-50' : ''}`}><span className={`flex gap-2 ${i === 3 ? 'font-medium' : 'text-muted'}`}><Icon v={c.v} /> {c.t}</span></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div></section>
  );
}

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
        <h2 className="display reveal text-[40px] sm:text-[56px]">Make your next workplace transition easier to plan.</h2>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <Link to="/contact" className="btn border-paper bg-paper text-ink hover:bg-stone-100">Request early access <ArrowRight size={16} /></Link>
          <Link to="/inventory" className="btn border-paper/30 text-paper hover:border-paper">Explore the live demo</Link>
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

  const word = useCycle(OUTCOME_WORDS, 2400);
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="grid-paper absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="hero-glow pointer-events-none absolute -right-40 top-20 h-[30rem] w-[30rem] rounded-full bg-cobalt/10 blur-3xl" aria-hidden="true" />
        <div className="container-x relative grid gap-14 pb-24 pt-16 xl:grid-cols-[1fr_1.12fr] xl:items-start lg:pt-20">
          <div>
            <Link to="/contact" className="reveal group mb-6 inline-flex items-center gap-2 border border-line bg-paper/80 px-3 py-1.5 text-[12px] text-ink-soft backdrop-blur hover:border-cobalt">
              <span className="live-dot" aria-hidden /> Early access open · pilots on one property <ArrowRight size={13} className="text-cobalt transition-transform group-hover:translate-x-0.5" />
            </Link>
            <h1 className="display reveal text-[48px] sm:text-[68px] lg:text-[76px]" style={dl(80)}>
              Every item accounted for — before <span className="sr-only">move day, the refit, the skip arrives or the lease ends.</span>
              <span aria-hidden className="block min-h-[1.05em]"><em key={word} className="word-in ink-underline text-cobalt">{word}</em></span>
            </h1>
            <p className="reveal mt-7 max-w-lg text-[17px] leading-relaxed text-ink-soft" style={dl(160)}>
              Turn office surveys and room photographs into one reviewable furniture inventory — with confirmed counts, measured dimensions and a planned action for every item.
            </p>
            <div className="reveal mt-9 flex flex-wrap gap-3" style={dl(240)}>
              <Link to="/contact" className="btn-accent h-11 px-5">Request early access <ArrowRight size={16} /></Link>
              <Link to="/inventory" className="btn-secondary h-11 px-5">Explore the live demo</Link>
            </div>
            <dl className="reveal mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-5 text-[12px]" style={dl(320)}>
              {[['Rooms', 'mapped to plan'], ['Records', 'reviewed by people'], ['Actions', 'ready for the move']].map(([k, v]) => (
                <div key={k}><dt className="font-semibold text-ink">{k}</dt><dd className="text-muted">{v}</dd></div>
              ))}
            </dl>
          </div>
          <div className="reveal relative" style={dl(380)}>
            <DashboardMockup />
            <FloatCard className="float -left-6 -top-8 hidden lg:flex" icon={<Copy size={16} className="text-amber" />} title="Possible duplicate · DG-01" body="3 photos, one sit-stand desk? Review before counting." />
            <FloatCard className="float-slow -bottom-10 right-6 hidden lg:flex" icon={<CheckCircle2 size={16} className="text-teal" />} title="Quantity confirmed" body="24 task chairs · Room 3.04 · reviewed on site" style={{ animationDelay: '-2s' }} />
            <FloatCard className="float -bottom-12 left-6 hidden xl:flex" icon={<AlertTriangle size={16} className="text-rust" />} title="Dimensions not verified" body="Measure before booking the lift — never estimated" style={{ animationDelay: '-4s' }} />
          </div>
        </div>
      </section>
      <Marquee />

      {/* A. Problem */}
      <section id="problem" className="border-b border-line">
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
              {PROBLEM_STATS.map((st, i) => <Stat key={st.label} {...st} delay={i * 120} />)}
            </div>
          </div>
          <p className="mt-4 text-[11.5px] text-muted md:ml-[180px]">Published figures from third-party sources, linked above. They describe the wider office-furniture industry, not Roomtally results.</p>
          <div className="mt-14 grid gap-4 md:ml-[180px] md:grid-cols-[1.5fr_1fr]">
            <Photo src={PHOTOS.officeWide} alt="Open-plan office floor before a relocation" className="aspect-[16/10]" caption="Open workspace — before survey" />
            <Photo src={PHOTOS.chairs} alt="Office chairs grouped in a meeting space" className="aspect-[16/10] md:aspect-auto" position="center 60%" />
          </div>
        </div>
      </section>

      <SolutionSection />

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
      <section id="who" className="border-b border-line">
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
                <li key={t} className="reveal grid gap-2 py-5 sm:grid-cols-[200px_1fr]">
                  <h3 className="text-[15px] font-semibold">{t}</h3>
                  <p className="text-[14px] leading-relaxed text-muted">{b}</p>
                </li>
              ))}
            </ul>
            <Photo src={PHOTOS.team} alt="Facilities team reviewing plans at a table" className="aspect-[4/3]" />
          </div>
        </div>
      </section>

      <CompareSection />
      <AiSection />
      <SafeguardsSection />
      <TechnologySection />
      <PricingSection />
      <RoadmapSection />
      <TeamSection />
      <FaqSection />
      <EarlyAccessSection />
      <FinalCta />
    </>
  );
}
