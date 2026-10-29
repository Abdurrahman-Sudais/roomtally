import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, Mail } from 'lucide-react';
import { PageHero } from '../components/SiteLayout';
import { Field, useSeo } from '../components/ui';
import { pricingConfig } from '../config/pricing';

interface Form {
  name: string;
  email: string;
  company: string;
  role: string;
  plan: string;
  properties: string;
  message: string;
}

export default function Contact() {
  useSeo('Contact', 'Contact Roomtally founder Tunde Ogunleye about furniture surveys, relocation planning, or pricing.', '/contact');
  const [params] = useSearchParams();
  const [form, setForm] = useState<Form>({
    name: '', email: '', company: '', role: 'Facilities manager', plan: params.get('plan') ?? '', properties: '', message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [sent, setSent] = useState(false);
  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err: typeof errors = {};
    if (!form.name.trim()) err.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = 'Please enter a valid work email.';
    if (form.message.trim().length < 10) err.message = 'Please add a few words about your project.';
    setErrors(err);
    if (Object.keys(err).length) {
      document.getElementById(`c-${Object.keys(err)[0]}`)?.focus();
      return;
    }
    setSent(true);
  };

  const mailto = `mailto:tunde@roomtally.top?subject=${encodeURIComponent(`Roomtally enquiry — ${form.company || form.name}`)}&body=${encodeURIComponent(form.message)}`;

  return (
    <>
      <PageHero eyebrow="Contact" title="Tell us about your next move." intro="Whether it’s one floor or a portfolio, we’ll walk you through how Roomtally would fit your survey and relocation process." />
      <section className="border-b border-line">
        <div className="container-x grid gap-14 py-16 lg:grid-cols-[1fr_340px]">
          {sent ? (
            <div className="panel p-8" role="status">
              <CheckCircle2 className="text-teal" />
              <h2 className="mt-4 text-[20px] font-semibold">Thanks, {form.name.split(' ')[0]}.</h2>
              <p className="mt-2 max-w-lg text-[14.5px] text-muted">
                This demonstration site does not transmit form data. To send your enquiry now, email Tunde directly — your message is pre-filled below.
              </p>
              <a href={mailto} className="btn-primary mt-6"><Mail size={15} /> Email tunde@roomtally.top</a>
              <button className="btn-ghost ml-2 mt-6" onClick={() => setSent(false)}>Edit enquiry</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2" aria-label="Contact form">
              <Field label="Full name *" htmlFor="c-name" error={errors.name}>
                <input id="c-name" className="field" value={form.name} onChange={set('name')} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'c-name-error' : undefined} />
              </Field>
              <Field label="Work email *" htmlFor="c-email" error={errors.email}>
                <input id="c-email" type="email" className="field" value={form.email} onChange={set('email')} autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'c-email-error' : undefined} />
              </Field>
              <Field label="Organisation" htmlFor="c-company">
                <input id="c-company" className="field" value={form.company} onChange={set('company')} autoComplete="organization" />
              </Field>
              <Field label="Your role" htmlFor="c-role">
                <select id="c-role" className="field" value={form.role} onChange={set('role')}>
                  {['Facilities manager', 'Move coordinator', 'Furniture surveyor', 'Refurbishment company', 'Workplace consultant', 'Other'].map((r) => <option key={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="Plan of interest" htmlFor="c-plan">
                <select id="c-plan" className="field" value={form.plan} onChange={set('plan')}>
                  <option value="">Not sure yet</option>
                  {pricingConfig.tiers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </Field>
              <Field label="Number of properties" htmlFor="c-props" hint="Approximate is fine.">
                <input id="c-props" inputMode="numeric" className="field" value={form.properties} onChange={set('properties')} aria-describedby="c-props-hint" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="About your project *" htmlFor="c-message" error={errors.message}>
                  <textarea id="c-message" rows={5} className="field" value={form.message} onChange={set('message')} placeholder="E.g. Relocating two floors (≈220 desks) in Q1; need to decide what to reuse." aria-invalid={!!errors.message} aria-describedby={errors.message ? 'c-message-error' : undefined} />
                </Field>
              </div>
              <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
                <button type="submit" className="btn-primary">Send enquiry</button>
                <span className="text-[12px] text-muted">Demo form — nothing is sent until you choose to email.</span>
              </div>
            </form>
          )}
          <aside className="space-y-6 border-t border-line pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <div>
              <div className="eyebrow mb-2">Founder</div>
              <p className="font-semibold">Tunde Ogunleye</p>
              <a href="mailto:tunde@roomtally.top" className="text-[14px] underline decoration-line underline-offset-4 hover:decoration-ink">tunde@roomtally.top</a>
            </div>
            <div>
              <div className="eyebrow mb-2">Web</div>
              <p className="text-[14px]">roomtally.top</p>
            </div>
            <div>
              <div className="eyebrow mb-2">Response time</div>
              <p className="text-[14px] text-muted">Usually within two working days.</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
