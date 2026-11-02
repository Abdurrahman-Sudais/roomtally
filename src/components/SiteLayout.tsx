import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Wordmark } from './ui';
import { useRevealOnScroll } from '../lib/motion';
import { FOUNDERS, SITE } from '../config/site';

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

export const NAV = [
  { to: '/#problem', label: 'Problem' },
  { to: '/product', label: 'Platform' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/technology', label: 'Technology' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'Team' },
  { to: '/security', label: 'Security' },
];

export function SiteLayout() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname, hash } = useLocation();
  useRevealOnScroll(pathname);
  useEffect(() => {
    setOpen(false);
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    let tries = 0;
    let t = 0;
    const find = () => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        el.scrollIntoView();
        t = window.setTimeout(() => el.scrollIntoView(), 450);
      } else if (tries++ < 40) t = window.setTimeout(find, 50);
    };
    find();
    return () => window.clearTimeout(t);
  }, [pathname, hash]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:bg-ink focus:px-3 focus:py-2 focus:text-paper">
        Skip to content
      </a>
      <header className={`sticky top-0 z-40 border-b backdrop-blur transition-all duration-300 ${scrolled ? 'border-line bg-paper/95 shadow-[0_10px_30px_-22px_rgba(29,29,27,0.45)]' : 'border-transparent bg-paper/60'}`}>
        <div className="container-x flex h-16 items-center justify-between gap-6">
          <Link to="/" aria-label="Roomtally home"><Wordmark /></Link>
          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `relative px-3 py-2 text-[13.5px] transition-colors after:absolute after:inset-x-3 after:bottom-1 after:h-px after:origin-left after:bg-cobalt after:transition-transform ${isActive && !n.to.includes('#') ? 'text-ink after:scale-x-100' : 'text-muted after:scale-x-0 hover:text-ink hover:after:scale-x-100'}`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            <Link to="/inventory" className="btn-ghost btn-sm">Live demo</Link>
            <Link to="/contact" className="btn-accent btn-sm">Request early access <ArrowRight size={14} /></Link>
          </div>
          <button
            className="btn-ghost btn-sm px-2 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {open && (
          <nav id="mobile-nav" aria-label="Mobile" className="border-t border-line bg-paper lg:hidden">
            <div className="container-x flex flex-col py-3">
              {NAV.map((n) => (
                <NavLink key={n.to} to={n.to} className="border-b border-line py-3 text-[15px] last:border-0">
                  {n.label}
                </NavLink>
              ))}
              <Link to="/contact" className="btn-accent mt-3">Request early access</Link>
              <Link to="/inventory" className="btn-secondary mt-2">Explore the live demo</Link>
            </div>
          </nav>
        )}
      </header>
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}

function SiteFooter() {
  const cols = [
    { title: 'Platform', links: [['/product', 'Platform overview'], ['/inventory-management', 'Inventory management'], ['/relocation-planning', 'Relocation planning'], ['/inventory', 'Live demo'], ['/pricing', 'Pricing']] },
    { title: 'Solutions', links: [['/#problem', 'Problems we solve'], ['/#who', 'Who it’s for'], ['/#compare', 'Why Roomtally'], ['/how-it-works', 'How it works'], ['/#roadmap', 'Roadmap']] },
    { title: 'Company', links: [['/about', 'About & team'], ['/technology', 'Technology (AWS)'], ['/security', 'Security & safeguards'], ['/contact', 'Request early access'], ['/#faq', 'FAQ']] },
    { title: 'Legal', links: [['/privacy', 'Privacy notice'], ['/terms', 'Terms of use']] },
  ];
  return (
    <footer className="border-t border-line bg-stone-50">
      <div className="container-x grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_0.8fr]">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-muted">Know what you have before you move. Furniture inventory and reuse planning for office relocations and facilities teams.</p>
          <a href={`mailto:${SITE.email}`} className="mt-4 inline-block font-mono text-[12.5px] text-cobalt underline-offset-4 hover:underline">{SITE.email}</a>
          <div className="mt-6 inline-flex items-center gap-2 border border-line bg-paper px-3 py-1.5 text-[12px] text-ink-soft"><span className="live-dot" aria-hidden /> Early access open · pilots on one property</div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <div className="eyebrow mb-4">{c.title}</div>
            <ul className="space-y-2.5">
              {c.links.map(([to, label]) => <li key={to}><Link to={to} className="text-[13.5px] text-ink-soft hover:text-ink">{label}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col justify-between gap-2 py-5 text-[12px] text-muted md:flex-row">
          <span>
            © {new Date().getFullYear()} Roomtally · Founded by{' '}
            {FOUNDERS.map((f, i) => <span key={f.name}>{i > 0 && ' & '}<Link to="/about#team" className="text-ink-soft hover:text-ink">{f.name}</Link></span>)}
          </span>
          <span>Product demonstration uses sample data. Photograph analysis shown is simulated.</span>
        </div>
      </div>
    </footer>
  );
}

export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: React.ReactNode; intro: string; children?: React.ReactNode }) {
  return (
    <section className="border-b border-line">
      <div className="container-x py-16 sm:py-24">
        <div className="eyebrow reveal mb-5">{eyebrow}</div>
        <h1 className="display reveal max-w-4xl text-[44px] sm:text-[64px]" style={d(80)}>{title}</h1>
        <p className="reveal mt-6 max-w-2xl text-[17px] leading-relaxed text-ink-soft" style={d(160)}>{intro}</p>
        {children && <div className="reveal mt-8 flex flex-wrap gap-3" style={d(240)}>{children}</div>}
      </div>
    </section>
  );
}

export function SectionHead({ index, eyebrow, title, intro }: { index?: string; eyebrow: string; title: React.ReactNode; intro?: string }) {
  return (
    <div className="grid gap-6 md:grid-cols-[180px_1fr]">
      <div className="eyebrow reveal flex items-start gap-2 pt-2"><span className="mt-[0.45em] h-px w-5 bg-cobalt" aria-hidden />{index && <span className="text-ink">{index}</span>}{eyebrow}</div>
      <div>
        <h2 className="display reveal max-w-3xl text-[36px] sm:text-[48px]" style={d(60)}>{title}</h2>
        {intro && <p className="reveal mt-5 max-w-2xl text-[16px] leading-relaxed text-ink-soft" style={d(120)}>{intro}</p>}
      </div>
    </div>
  );
}
