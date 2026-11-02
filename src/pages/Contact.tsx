import { useSearchParams } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { PageHero } from '../components/SiteLayout';
import { useSeo } from '../components/ui';
import { LeadForm } from '../components/LeadForm';
import { FOUNDERS, SITE } from '../config/site';

export default function Contact() {
  useSeo('Request early access', 'Request early access to Roomtally for furniture surveys, reuse decisions and relocation planning.', '/contact');
  const [params] = useSearchParams();
  return (
    <>
      <PageHero eyebrow="Early access" title="Tell us about your next move." intro="Whether it’s one floor or a portfolio, we’ll walk you through how Roomtally would fit your survey and relocation process." />
      <section className="border-b border-line">
        <div className="container-x grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr]">
          <div className="reveal"><LeadForm initialPlan={params.get('plan') ?? ''} /></div>
          <aside className="reveal space-y-6 border-t border-line pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <div>
              <div className="eyebrow mb-3">Founders</div>
              <ul className="space-y-3">
                {FOUNDERS.map((f) => (
                  <li key={f.name} className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center border border-line bg-paper font-serif text-[18px]">{f.initials}</span>
                    <span><span className="block font-semibold">{f.name}</span><span className="block text-[12.5px] text-muted">{f.role}</span></span>
                  </li>
                ))}
              </ul>
              <a href={`mailto:${SITE.email}`} className="mt-4 inline-flex items-center gap-2 text-[14px] underline decoration-line underline-offset-4 hover:decoration-ink"><Mail size={14} /> {SITE.email}</a>
            </div>
            <div><div className="eyebrow mb-2">Web</div><p className="text-[14px]">{SITE.domain}</p></div>
            <div><div className="eyebrow mb-2">Response time</div><p className="text-[14px] text-muted">Usually within two working days.</p></div>
          </aside>
        </div>
      </section>
    </>
  );
}
