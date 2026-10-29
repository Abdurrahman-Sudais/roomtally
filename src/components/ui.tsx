import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import type { Action, Condition, SurveyStatus } from '../data/types';
import { ACTION_LABEL, CONDITION_LABEL, STATUS_LABEL } from '../data/types';

/* ---------- Brand ---------- */

export function LogoMark({ className = 'h-7 w-7' }: { className?: string }) {
  // A room in plan: outer wall, two partitions, and one tallied item.
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" fill="#1f2a44" />
      <path d="M7 7h18v18H7z" fill="none" stroke="#f7f5f0" strokeWidth="2" />
      <path d="M7 16h9V7M16 16v9" fill="none" stroke="#f7f5f0" strokeWidth="2" />
      <rect x="19" y="19" width="3" height="3" fill="#7fa0ff" />
    </svg>
  );
}

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className={`text-[17px] font-semibold tracking-[-0.02em] ${light ? 'text-paper' : 'text-ink'}`}>
        room<span className="font-normal">tally</span>
      </span>
    </span>
  );
}

/* ---------- SEO ---------- */

export function useSeo(title: string, description: string, path = '') {
  useEffect(() => {
    document.title = title.includes('Roomtally') ? title : `${title} — Roomtally`;
    const set = (selector: string, attr: string, value: string) => {
      let el = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
      if (!el) {
        const [tag, key, keyVal] = selector.match(/^(\w+)\[(\w+(?::\w+)?)="([^"]+)"\]$/)!.slice(1);
        el = document.createElement(tag) as HTMLMetaElement;
        el.setAttribute(key, keyVal);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };
    set('meta[name="description"]', 'content', description);
    set('meta[property="og:title"]', 'content', document.title);
    set('meta[property="og:description"]', 'content', description);
    set('meta[property="og:url"]', 'content', `https://roomtally.top${path}`);
    set('link[rel="canonical"]', 'href', `https://roomtally.top${path}`);
  }, [title, description, path]);
}

/* ---------- Photography ---------- */

export const PHOTOS = {
  officeWide: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
  officeDesks: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80',
  chairs: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80',
  workspace: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80',
  team: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80',
  plans: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80',
  interior: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=80',
};

export function Photo({
  src,
  alt,
  className = '',
  position = 'center',
  zoom = 1,
  caption,
}: {
  src: string;
  alt: string;
  className?: string;
  position?: string;
  zoom?: number;
  caption?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <figure className={`relative overflow-hidden bg-stone-200 ${className}`}>
      {failed ? (
        <div className="grid-paper absolute inset-0 flex items-end p-4">
          <span className="eyebrow">{alt}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: position, transform: zoom !== 1 ? `scale(${zoom})` : undefined, transformOrigin: position }}
        />
      )}
      {caption && (
        <figcaption className="absolute bottom-0 left-0 bg-paper/90 px-3 py-1.5 font-mono text-[10.5px] tracking-wide text-ink-soft">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/** A neutral thumbnail for sample photograph references (no real survey images exist in the demo). */
export function PhotoRef({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const s = size === 'sm' ? 'h-12 w-16' : 'h-20 w-28';
  return (
    <div className={`grid-paper relative flex ${s} shrink-0 items-end border border-line bg-stone-100 p-1`} title={name}>
      <svg viewBox="0 0 40 28" className="absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)] text-stone-400" aria-hidden="true">
        <path d="M2 26 L14 12 L22 20 L28 15 L38 26 Z" fill="currentColor" opacity=".35" />
        <circle cx="30" cy="7" r="3" fill="currentColor" opacity=".45" />
      </svg>
      <span className="relative truncate bg-paper/90 px-1 font-mono text-[9px] text-ink-soft">{name}</span>
    </div>
  );
}

/* ---------- Tags ---------- */

const statusTone: Record<SurveyStatus, string> = {
  proposed: 'border-line bg-stone-50 text-ink-soft',
  'needs-review': 'border-amber/30 bg-amber-50 text-amber',
  confirmed: 'border-teal/25 bg-teal-50 text-teal',
  inspection: 'border-rust/25 bg-rust-50 text-rust',
};
export function StatusTag({ status }: { status: SurveyStatus }) {
  return <span className={`tag ${statusTone[status]}`}>{STATUS_LABEL[status]}</span>;
}

export const actionTone: Record<Action, { dot: string; tag: string }> = {
  unassigned: { dot: 'bg-stone-300', tag: 'border-line bg-white text-muted' },
  move: { dot: 'bg-cobalt', tag: 'border-cobalt/25 bg-cobalt-50 text-cobalt' },
  retain: { dot: 'bg-ink-soft', tag: 'border-ink/15 bg-stone-100 text-ink' },
  refurbish: { dot: 'bg-teal', tag: 'border-teal/25 bg-teal-50 text-teal' },
  donate: { dot: 'bg-[#6b5aa8]', tag: 'border-[#6b5aa8]/25 bg-[#f0edf8] text-[#4f3f8c]' },
  inspect: { dot: 'bg-amber', tag: 'border-amber/30 bg-amber-50 text-amber' },
  dispose: { dot: 'bg-rust', tag: 'border-rust/25 bg-rust-50 text-rust' },
};
export function ActionTag({ action }: { action: Action }) {
  return (
    <span className={`tag ${actionTone[action].tag}`}>
      <span className={`h-1.5 w-1.5 ${actionTone[action].dot}`} />
      {ACTION_LABEL[action]}
    </span>
  );
}

export function ConditionText({ condition }: { condition: Condition }) {
  const tone = condition === 'damaged' ? 'text-rust' : condition === 'worn' ? 'text-amber' : condition === 'unassessed' ? 'text-stone-400' : 'text-ink-soft';
  return <span className={`text-[13px] ${tone}`}>{CONDITION_LABEL[condition]}</span>;
}

export function SampleBadge({ children = 'Sample inventory data' }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 border border-dashed border-stone-400 px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">
      {children}
    </span>
  );
}

/* ---------- Overlays ---------- */

function useOverlay(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && ref.current) {
        const f = ref.current.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',
        );
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setTimeout(() => ref.current?.querySelector<HTMLElement>('[data-autofocus],input,select,textarea,button')?.focus(), 30);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
  }, [open, onClose]);
  return ref;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  width = 'max-w-xl',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: string;
}) {
  const ref = useOverlay(open, onClose);
  const id = useId();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 p-4 pt-[8vh]" onMouseDown={onClose}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
        className={`w-full ${width} border border-line bg-paper shadow-[0_24px_60px_-20px_rgba(0,0,0,.35)]`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id={id} className="text-[15px] font-semibold">{title}</h2>
          <button className="btn-ghost btn-sm px-2" onClick={onClose} aria-label="Close dialog">
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-line bg-stone-50 px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
}

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const ref = useOverlay(open, onClose);
  const id = useId();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-ink/30" onMouseDown={onClose}>
      <aside
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
        className="absolute inset-y-0 right-0 flex w-full max-w-[560px] flex-col border-l border-line bg-paper shadow-[-20px_0_60px_-30px_rgba(0,0,0,.35)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div className="min-w-0">
            {subtitle && <div className="eyebrow mb-1">{subtitle}</div>}
            <h2 id={id} className="text-lg font-semibold leading-snug">{title}</h2>
          </div>
          <button className="btn-ghost btn-sm px-2" onClick={onClose} aria-label="Close panel">
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-line bg-stone-50 px-6 py-3">{footer}</div>}
      </aside>
    </div>
  );
}

/* ---------- Form helpers ---------- */

export function Field({
  label,
  hint,
  error,
  children,
  htmlFor,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  htmlFor: string;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="field-label">{label}</label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="mt-1 text-[12px] text-rust" role="alert">{error}</p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="mt-1 text-[12px] text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function Toast({ message, onDone }: { message: string | null; onDone: () => void }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [message, onDone]);
  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-5 left-1/2 z-[60] -translate-x-1/2">
      {message && (
        <div className="pointer-events-auto border border-ink bg-ink px-4 py-2.5 text-[13px] text-paper shadow-lg">{message}</div>
      )}
    </div>
  );
}
