import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { PageHero } from '../components/SiteLayout';
import { useSeo } from '../components/ui';
import { pricingConfig, type PricingTier } from '../config/pricing';
import { FinalCta } from './Home';

function priceFor(t: PricingTier, annual: boolean) {
  if (t.price === null) return { main: 'Custom', unit: '' };
  if (annual && t.unit === '/month') {
    const p = Math.round(t.price * (1 - pricingConfig.annualDiscount));
    return { main: `${pricingConfig.currencySymbol}${p}`, unit: '/month, billed annually' };
  }
  return { main: `${pricingConfig.currencySymbol}${t.price}`, unit: t.unit };
}

export default function Pricing() {
  useSeo('Pricing', 'Illustrative Roomtally pricing: Survey Project at $39 per project, Business at $129 per month, and custom Enterprise plans.', '/pricing');
  const [annual, setAnnual] = useState(false);
  const hasMonthly = pricingConfig.tiers.some((t) => t.unit === '/month');
  return (
    <>
      <PageHero eyebrow="Pricing" title="Priced per project or per team." intro="Start with a single survey, or give your facilities team a workspace for every property and move." />
      <section className="border-b border-line">
        <div className="container-x py-16">
          {hasMonthly && pricingConfig.annualDiscount > 0 && (
            <div className="mb-8 flex items-center gap-3" role="group" aria-label="Billing period">
              <button className={`btn-sm btn ${!annual ? 'border-ink bg-ink text-paper' : 'border-line'}`} aria-pressed={!annual} onClick={() => setAnnual(false)}>Monthly</button>
              <button className={`btn-sm btn ${annual ? 'border-ink bg-ink text-paper' : 'border-line'}`} aria-pressed={annual} onClick={() => setAnnual(true)}>
                Annual · save {Math.round(pricingConfig.annualDiscount * 100)}%
              </button>
            </div>
          )}
          <div className="grid gap-px border border-line bg-line lg:grid-cols-3">
            {pricingConfig.tiers.map((t) => {
              const p = priceFor(t, annual);
              return (
                <div key={t.id} className={`relative flex flex-col p-8 ${t.highlighted ? 'bg-white' : 'bg-paper'}`}>
                  {t.highlighted && <div className="absolute inset-x-0 top-0 h-[3px] bg-cobalt" aria-hidden="true" />}
                  <div className="flex items-center justify-between">
                    <h2 className="text-[17px] font-semibold">{t.name}</h2>
                    {t.highlighted && <span className="eyebrow !text-cobalt">Most teams</span>}
                  </div>
                  <p className="mt-2 min-h-[44px] text-[14px] text-muted">{t.summary}</p>
                  <div className="mt-6 flex items-baseline gap-1.5">
                    <span className="display text-[52px]">{p.main}</span>
                    <span className="text-[13px] text-muted">{p.unit}</span>
                  </div>
                  <ul className="mt-8 flex-1 space-y-3 border-t border-line pt-6 text-[14px]">
                    {t.features.map((f) => (
                      <li key={f} className="flex gap-2.5"><Check size={16} className="mt-0.5 shrink-0 text-teal" />{f}</li>
                    ))}
                  </ul>
                  <Link to={t.cta.to} className={`mt-8 ${t.highlighted ? 'btn-accent' : 'btn-secondary'}`}>{t.cta.label}</Link>
                </div>
              );
            })}
          </div>
          <p className="mt-5 text-[12.5px] text-muted">{pricingConfig.note}</p>
        </div>
      </section>
      <section className="border-b border-line">
        <div className="container-x grid gap-10 py-20 md:grid-cols-[180px_1fr]">
          <div className="eyebrow pt-1">Questions</div>
          <dl className="divide-y divide-line border-y border-line">
            {[
              ['What counts as a project?', 'One property surveyed for one relocation, refurbishment, or audit, with access for 90 days.'],
              ['Does Roomtally value our furniture?', 'No. Roomtally records condition and dimensions you confirm. Resale and refurbishment pricing stay with your specialists.'],
              ['Can relocation companies use it for clients?', 'Yes — Enterprise includes separate client workspaces and custom action workflows.'],
              ['Can we export our data?', 'Every plan includes CSV export. Enterprise adds structured exports to CAFM and asset registers.'],
            ].map(([q, a]) => (
              <div key={q} className="grid gap-2 py-5 sm:grid-cols-[1fr_1.4fr]"><dt className="font-semibold">{q}</dt><dd className="text-[14.5px] text-muted">{a}</dd></div>
            ))}
          </dl>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
