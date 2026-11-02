import { useState, type FormEvent } from 'react';
import { CheckCircle2, Mail, Send } from 'lucide-react';
import { SITE } from '../config/site';
import { pricingConfig } from '../config/pricing';
import { emptyLead, hubspotConfig, leadPayload, validateLead, type Lead, type LeadErrors } from '../lib/lead';

const USE_CASES = ['Office relocation', 'Refurbishment or fit-out', 'Consolidating floors or sites', 'Furniture reuse and donation', 'Keeping a live asset inventory', 'Not sure yet'];

/**
 * Early-access form. With HubSpot configured (VITE_HUBSPOT_*) it submits to the HubSpot Forms API;
 * otherwise it keeps the request in this browser and offers a pre-filled email.
 */
export function LeadForm({ initialPlan = '', compact = false }: { initialPlan?: string; compact?: boolean }) {
  const hubspot = hubspotConfig();
  const [form, setForm] = useState<Lead>(() => emptyLead(initialPlan));
  const [errors, setErrors] = useState<LeadErrors>({});
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [sent, setSent] = useState<'hubspot' | 'local' | null>(null);
  const idp = compact ? 'ea' : 'c';
  const set = <K extends keyof Lead>(k: K, v: Lead[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const mailto = `mailto:${SITE.email}?subject=${encodeURIComponent(`Roomtally early access${form.company ? ` — ${form.company}` : ''}`)}&body=${encodeURIComponent(`${form.message}\n\nName: ${form.name}\nCompany: ${form.company}\nRole: ${form.role}\nEstate size: ${form.size}\nUse case: ${form.useCase}\nPlan: ${form.plan}`)}`;

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    setFailed(false);
    if (form.website) return; // honeypot
    const e = validateLead(form);
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`${idp}-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    if (!hubspot) {
      try {
        const prev = JSON.parse(localStorage.getItem('roomtally.enquiries') ?? '[]') as unknown[];
        const { website: _hp, ...keep } = form;
        localStorage.setItem('roomtally.enquiries', JSON.stringify([...prev, { ...keep, at: new Date().toISOString() }]));
      } catch {
        /* storage unavailable: the email link still works */
      }
      setSent('local');
      return;
    }
    setBusy(true);
    try {
      const r = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${encodeURIComponent(hubspot.portalId)}/${encodeURIComponent(hubspot.formGuid)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload(form, { pageUri: location.href.split('#')[0] ?? location.href, pageName: document.title }, hubspot)),
      });
      if (!r.ok) throw new Error(String(r.status));
      setSent('hubspot');
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  const field = (k: keyof Lead) => ({ id: `${idp}-${k}`, 'aria-invalid': errors[k] ? true : undefined, 'aria-describedby': errors[k] ? `${idp}-e-${k}` : undefined });
  const Err = ({ k }: { k: keyof Lead }) => (errors[k] ? <p id={`${idp}-e-${k}`} className="mt-1 text-[12px] text-rust">{errors[k]}</p> : null);

  if (sent) {
    return (
      <div role="status" className="py-10 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-teal" aria-hidden />
        <h2 className="mt-4 text-[22px] font-semibold">Thank you, {form.name.split(' ')[0]}.</h2>
        {sent === 'hubspot' ? (
          <p className="mx-auto mt-2 max-w-sm text-[14px] text-muted">Your request has been received. We’ll reply by email to arrange a walkthrough on one of your properties.</p>
        ) : (
          <>
            <p className="mx-auto mt-2 max-w-sm text-[14px] text-muted">This site has no form backend configured yet, so your request was saved in this browser only. To send it, open it as an email:</p>
            <a href={mailto} className="btn-primary mt-5"><Mail size={15} /> Email {SITE.email}</a>
          </>
        )}
      </div>
    );
  }

  return (
    <form noValidate onSubmit={submit} className="relative grid gap-4 sm:grid-cols-2" aria-label="Request early access">
      <div><label className="field-label" htmlFor={`${idp}-name`}>Full name *</label><input className="field" autoComplete="name" maxLength={100} value={form.name} onChange={(e) => set('name', e.target.value)} {...field('name')} /><Err k="name" /></div>
      <div><label className="field-label" htmlFor={`${idp}-email`}>Work email *</label><input className="field" type="email" autoComplete="email" maxLength={200} value={form.email} onChange={(e) => set('email', e.target.value)} {...field('email')} /><Err k="email" /></div>
      <div><label className="field-label" htmlFor={`${idp}-company`}>Company *</label><input className="field" autoComplete="organization" maxLength={150} value={form.company} onChange={(e) => set('company', e.target.value)} {...field('company')} /><Err k="company" /></div>
      <div><label className="field-label" htmlFor={`${idp}-role`}>Role</label><input className="field" maxLength={100} value={form.role} onChange={(e) => set('role', e.target.value)} {...field('role')} placeholder="e.g. Facilities manager" /></div>
      <div>
        <label className="field-label" htmlFor={`${idp}-size`}>Size of estate *</label>
        <select className="field" value={form.size} onChange={(e) => set('size', e.target.value)} {...field('size')}>
          <option value="">Select…</option>
          <option>One floor or office</option>
          <option>One building</option>
          <option>2–5 sites</option>
          <option>More than 5 sites</option>
        </select>
        <Err k="size" />
      </div>
      <div>
        <label className="field-label" htmlFor={`${idp}-useCase`}>Primary use case</label>
        <select className="field" value={form.useCase} onChange={(e) => set('useCase', e.target.value)} {...field('useCase')}>
          <option value="">Select…</option>
          {USE_CASES.map((u) => <option key={u}>{u}</option>)}
        </select>
      </div>
      {!compact && (
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor={`${idp}-plan`}>Plan of interest</label>
          <select className="field" value={form.plan} onChange={(e) => set('plan', e.target.value)} {...field('plan')}>
            <option value="">Not sure yet</option>
            {pricingConfig.tiers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      )}
      <div className="sm:col-span-2">
        <label className="field-label" htmlFor={`${idp}-message`}>What are you planning? *</label>
        <textarea className="field min-h-28" placeholder="Building, number of floors or desks, and your timeline. Please don’t include confidential client data." value={form.message} onChange={(e) => set('message', e.target.value)} {...field('message')} />
        <div className="flex justify-between"><Err k="message" /><span className="ml-auto mt-1 text-[11px] text-stone-400">{form.message.length}/2000</span></div>
      </div>
      <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden><label>Leave this field empty<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set('website', e.target.value)} /></label></div>
      <div className="space-y-2 sm:col-span-2">
        <label className="flex items-start gap-2 text-[13.5px]"><input type="checkbox" className="mt-0.5 h-4 w-4 accent-[#2747b8]" checked={form.consent} onChange={(e) => set('consent', e.target.checked)} {...field('consent')} /> I agree that Roomtally may contact me about this request. *</label>
        <Err k="consent" />
        <label className="flex items-start gap-2 text-[13.5px]"><input type="checkbox" className="mt-0.5 h-4 w-4 accent-[#2747b8]" checked={form.marketing} onChange={(e) => set('marketing', e.target.checked)} /> Also send me occasional product updates (optional).</label>
      </div>
      {failed && <p role="alert" className="text-[13.5px] text-rust sm:col-span-2">Sorry, that could not be sent. Please try again, or email {SITE.email}.</p>}
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" className="btn-accent" disabled={busy}><Send size={15} /> {busy ? 'Sending…' : 'Request early access'}</button>
        <p className="text-[12px] text-muted">{hubspot ? 'Submitting sends these details to Roomtally’s customer-relationship system so we can reply.' : 'No form backend is configured: your request is saved in this browser and offered as an email.'} See the <a href="/privacy" className="underline">privacy notice</a>.</p>
      </div>
    </form>
  );
}
