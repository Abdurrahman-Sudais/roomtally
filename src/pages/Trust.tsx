import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Info } from 'lucide-react';
import { PageHero, SectionHead } from '../components/SiteLayout';
import { useSeo } from '../components/ui';
import { SITE } from '../config/site';
import { FinalCta } from './Home';

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

export const PIPELINE = [
  { step: '01', title: 'Survey', services: 'Amazon S3 · AWS AppSync', body: 'Surveyors capture room photographs and notes on a tablet as they walk the floor — offline if needed — and sync when back on the network.' },
  { step: '02', title: 'Organise', services: 'Amazon RDS for PostgreSQL', body: 'Each photo becomes an observation linked to a property and room. Proposed furniture records are built from observations, with every quantity marked unconfirmed.' },
  { step: '03', title: 'Suggest', services: 'Amazon Rekognition Custom Labels · AWS Lambda', body: 'A vision model may suggest item types and possible duplicates across photos. Suggestions are labelled — people confirm counts, condition and dimensions.' },
  { step: '04', title: 'Explain', services: 'Amazon Bedrock', body: 'The assistant answers questions from confirmed records and lists them. The model never values furniture or estimates dimensions.' },
  { step: '05', title: 'Plan & hand over', services: 'Amazon Cognito · Amazon SES', body: 'Planners assign move, retain, refurbish, donate, inspect or dispose; exports go to the move crew and refurbishers. Every change is audited.' },
];

const SERVICES: [string, string][] = [
  ['Amazon S3', 'Stores survey photographs, floor plans and exports with encryption and lifecycle rules.'],
  ['AWS AppSync', 'Syncs survey capture from tablets on site, including when the connection drops.'],
  ['Amazon RDS for PostgreSQL', 'Properties, rooms, observations, inventory records, decisions and the append-only audit log.'],
  ['Amazon Rekognition Custom Labels', 'Optional item-type and duplicate suggestions trained on your own labelled photos.'],
  ['AWS Lambda', 'Duplicate grouping, quantity roll-ups, plan summaries and CSV exports.'],
  ['Amazon Bedrock', 'Assistant answers grounded in confirmed inventory records.'],
  ['Amazon Cognito', 'Sign-in, single sign-on and role groups for managers, planners, surveyors and viewers.'],
  ['Amazon SES', 'Review and hand-over notifications by email.'],
  ['Amazon CloudWatch', 'Monitoring and alarms for sync, uploads and failed jobs.'],
  ['AWS KMS', 'Customer-specific encryption keys for data at rest.'],
];

export const SAFEGUARDS: [string, string][] = [
  ['People confirm every count', 'Quantities stay “proposed” until a reviewer confirms them. Possible duplicates are reviewed side by side before anything merges.'],
  ['Dimensions are measured, never guessed', 'Dimensions are only entered, imported or measured on site, always with explicit units. Nothing is estimated from photographs.'],
  ['No valuations', 'Condition is recorded by the reviewer. Roomtally never assigns a resale value.'],
  ['Every decision is reversible', 'Duplicate decisions keep a snapshot so they can be undone, and the reason is recorded.'],
  ['Roles, enforced', 'Managers, planners, surveyors and viewers each get only the actions they need. The demo checks every action; production enforces it on the server.'],
  ['Everything audited', 'Edits, confirmations, duplicate decisions, room changes and plan moves are written to an append-only audit log the manager can export.'],
];

const SECURITY: [string, string][] = [
  ['Encryption', 'TLS 1.2+ in transit; AWS KMS encryption at rest for databases and photo storage.'],
  ['Customer isolation', 'Every record carries a customer identifier filtered on every query; photos are stored per customer.'],
  ['Single sign-on', 'Sign in with your identity provider through Amazon Cognito, with multi-factor authentication for managers.'],
  ['Least privilege', 'Each service gets only the permissions it needs; no human uses root credentials.'],
  ['Data minimisation', 'Furniture and room records only. Survey guidance asks teams not to photograph people or screens.'],
  ['Data portability', 'Your inventory exports to CSV at any time; it remains yours.'],
];

export function Technology() {
  useSeo('Technology', 'How Roomtally proposes to use AWS: offline survey capture, linked records, suggested duplicates for people to confirm, and Amazon Bedrock for grounded answers.', '/technology');
  return (
    <>
      <PageHero eyebrow="Technology" title="How we use Amazon Web Services" intro="A proposed architecture for moving from this browser demo to a production service: capture on site, keep every record linked to its room, let models suggest and people confirm, and use AI only to explain." />
      <section className="border-b border-line"><div className="container-x py-20">
        <SectionHead eyebrow="Pipeline" title="From the walkthrough to the move plan." />
        <ol className="mt-12 grid gap-px border border-line bg-line md:ml-[180px] md:grid-cols-2 xl:grid-cols-5">
          {PIPELINE.map((p, i) => (
            <li key={p.step} className="reveal spot bg-paper p-5" style={d(i * 80)}>
              <span className="font-mono text-[12px] text-cobalt">{p.step}</span>
              <h3 className="mt-3 text-[16px] font-semibold">{p.title}</h3>
              <p className="mt-1 font-mono text-[10.5px] text-cobalt">{p.services}</p>
              <p className="mt-3 text-[13.5px] leading-relaxed text-muted">{p.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex gap-3 border border-amber/30 bg-amber-50 p-4 text-[13.5px] text-[#6d4b0c] md:ml-[180px]"><Info size={16} className="mt-0.5 shrink-0" /><p><strong>Proposed, not deployed.</strong> None of these services are connected to this website or the demo workspace, which run entirely in your browser on sample data.</p></div>
      </div></section>
      <section className="border-b border-line bg-stone-50"><div className="container-x py-20">
        <SectionHead eyebrow="Services" title="What each service does." />
        <dl className="mt-12 grid gap-px border border-line bg-line md:ml-[180px] md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(([n, b], i) => <div key={n} className="reveal bg-paper p-5" style={d((i % 3) * 80)}><dt className="font-semibold">{n}</dt><dd className="mt-2 text-[13.5px] text-muted">{b}</dd></div>)}
        </dl>
        <Link to="/security" className="mt-8 inline-flex items-center gap-2 text-[14px] font-medium text-cobalt hover:underline md:ml-[180px]">Security and safeguards <ArrowRight size={15} /></Link>
      </div></section>
      <FinalCta />
    </>
  );
}

export function Security() {
  useSeo('Security & safeguards', 'How Roomtally keeps people in charge: counts confirmed by reviewers, dimensions never estimated, no valuations, role-based access and an audit log.', '/security');
  return (
    <>
      <PageHero eyebrow="Security & safeguards" title="Photos suggest. People confirm." intro="The demo already enforces the review safeguards below. The security controls describe the proposed production design." />
      <section className="border-b border-line"><div className="container-x py-20">
        <SectionHead eyebrow="Review safeguards" title="Built into the demo you can try today." />
        <div className="mt-12 grid gap-px border border-line bg-line md:ml-[180px] md:grid-cols-2 lg:grid-cols-3">
          {SAFEGUARDS.map(([t, b], i) => <div key={t} className="reveal spot bg-paper p-6" style={d((i % 3) * 80)}><Check size={18} className="text-teal" /><h3 className="mt-3 font-semibold">{t}</h3><p className="mt-2 text-[13.5px] text-muted">{b}</p></div>)}
        </div>
        <Link to="/inventory/audit" className="mt-8 inline-flex items-center gap-2 text-[14px] font-medium text-cobalt hover:underline md:ml-[180px]">See roles and the audit log in the demo <ArrowRight size={15} /></Link>
      </div></section>
      <section className="bg-navy text-paper"><div className="container-x py-20">
        <div className="eyebrow reveal mb-4 !text-paper/60">Proposed security design</div>
        <h2 className="display reveal text-[36px] sm:text-[48px]">Controls for the production service.</h2>
        <dl className="mt-10 grid gap-px border border-white/15 bg-white/15 md:grid-cols-2 lg:grid-cols-3">
          {SECURITY.map(([t, b], i) => <div key={t} className="reveal bg-navy p-5" style={d((i % 3) * 80)}><dt className="font-semibold">{t}</dt><dd className="mt-2 text-[13.5px] text-paper/70">{b}</dd></div>)}
        </dl>
        <p className="mt-6 max-w-3xl text-[13.5px] text-paper/60">These controls are part of the proposed architecture and are not yet independently audited or certified.</p>
      </div></section>
      <FinalCta />
    </>
  );
}

const PRIVACY: [string, string][] = [
  ['What this website is', 'This website describes Roomtally and includes an interactive demo workspace that runs entirely in your browser on sample data. Meridian House and Calder Yard Annex are fictional.'],
  ['Demo data in your browser', 'Inventory edits, duplicate decisions, rooms, settings, the chosen demo user and the demo audit log are saved in your browser’s local storage under the key roomtally.demo.v1. That data never leaves your device. “Reset demo data” in Settings, or clearing site data, removes it.'],
  ['Early-access requests', `Until a form service is configured, the early-access form saves your request in your browser (key roomtally.enquiries) and offers a pre-filled email to ${SITE.email}; nothing is sent until you send that email. If the operator connects the form to a customer-relationship service (proposed: HubSpot), submitting it sends the fields you enter, your consent choices and the page address to that service so Roomtally can reply. Product updates are sent only if you tick the optional box. This notice must be updated with the confirmed service and retention before that is switched on.`],
  ['Analytics, cookies and images', 'This website includes no analytics or advertising trackers and sets no cookies. Editorial photographs load from Unsplash, which receives standard request data (such as IP address). A hosting provider may process routine request data to serve and protect the site.'],
  ['Your requests', `Contact ${SITE.email} with questions about information you have sent to Roomtally, or to ask for it to be corrected or deleted.`],
];

const TERMS: [string, string][] = [
  ['Demonstration only', 'The inventory workspace is a demonstration on sample data. It is not a production asset register and must not be used to plan real moves.'],
  ['No valuations or estimated dimensions', 'Roomtally organises furniture records and the decisions you make. It does not value furniture or estimate dimensions or fit from photographs.'],
  ['Pricing and availability', 'Prices shown are illustrative and exclude taxes. Early-access requests do not create a subscription or any commitment.'],
  ['Use of the site', 'Use the site and demo lawfully. Do not enter confidential client data or personal information into the demo or the request form.'],
  ['Changes', 'These terms are a review draft. Operator details, governing law and production service terms will be set out separately before launch.'],
];

export function Legal({ kind }: { kind: 'privacy' | 'terms' }) {
  const privacy = kind === 'privacy';
  useSeo(privacy ? 'Privacy notice' : 'Terms of use', privacy ? 'How the Roomtally website and demo workspace handle information.' : 'Terms for using the Roomtally website and demonstration workspace.', privacy ? '/privacy' : '/terms');
  return (
    <>
      <PageHero eyebrow="Review draft · operator details to be confirmed" title={privacy ? 'Privacy notice' : 'Terms of use'} intro={privacy ? 'How this website and its demo workspace handle information.' : 'Terms for using this website and its demonstration workspace.'} />
      <section><div className="container-x max-w-3xl space-y-8 py-16">
        {(privacy ? PRIVACY : TERMS).map(([t, b]) => <div key={t} className="reveal"><h2 className="text-[19px] font-semibold">{t}</h2><p className="mt-2 leading-relaxed text-ink-soft">{b}</p></div>)}
        <p className="text-[13.5px] text-muted">Contact: <a href={`mailto:${SITE.email}`} className="underline">{SITE.email}</a></p>
      </div></section>
    </>
  );
}
