import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Wordmark } from './ui';

export const NAV = [
  { to: '/product', label: 'Product' },
  { to: '/inventory-management', label: 'Inventory' },
  { to: '/relocation-planning', label: 'Relocation' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
];

export function SiteLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:bg-ink focus:px-3 focus:py-2 focus:text-paper">
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
        <div className="container-x flex h-16 items-center justify-between gap-6">
          <Link to="/" aria-label="Roomtally home"><Wordmark /></Link>
          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `px-3 py-2 text-[13.5px] transition-colors ${isActive ? 'text-ink' : 'text-muted hover:text-ink'}`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            <Link to="/contact" className="btn-ghost btn-sm">Contact</Link>
            <Link to="/inventory" className="btn-primary btn-sm">Open the demo <ArrowUpRight size={14} /></Link>
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
              {[...NAV, { to: '/contact', label: 'Contact' }].map((n) => (
                <NavLink key={n.to} to={n.to} className="border-b border-line py-3 text-[15px] last:border-0">
                  {n.label}
                </NavLink>
              ))}
              <Link to="/inventory" className="btn-primary mt-3">Open the demo</Link>
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
    { title: 'Product', links: [['/product', 'Overview'], ['/inventory-management', 'Inventory management'], ['/relocation-planning', 'Relocation planning'], ['/how-it-works', 'How it works'], ['/pricing', 'Pricing']] },
    { title: 'Company', links: [['/about', 'About'], ['/contact', 'Contact'], ['/inventory', 'Interactive demo']] },
  ];
  return (
    <footer className="border-t border-line bg-stone-50">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-muted">
            Know what you have before you move. Furniture inventory and reuse planning for office relocations and facilities teams.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <div className="eyebrow mb-4">{c.title}</div>
            <ul className="space-y-2.5">
              {c.links.map(([to, label]) => (
                <li key={to}><Link to={to} className="text-[13.5px] text-ink-soft hover:text-ink">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <div className="eyebrow mb-4">Get in touch</div>
          <a href="mailto:tunde@roomtally.top" className="text-[13.5px] text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
            tunde@roomtally.top
          </a>
          <p className="mt-2 text-[13.5px] text-muted">Tunde Ogunleye, Founder</p>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col justify-between gap-2 py-5 text-[12px] text-muted sm:flex-row">
          <span>© {new Date().getFullYear()} Roomtally · roomtally.top</span>
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
        <div className="eyebrow mb-5">{eyebrow}</div>
        <h1 className="display max-w-4xl text-[44px] sm:text-[64px]">{title}</h1>
        <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-ink-soft">{intro}</p>
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}

export function SectionHead({ index, eyebrow, title, intro }: { index?: string; eyebrow: string; title: React.ReactNode; intro?: string }) {
  return (
    <div className="grid gap-6 md:grid-cols-[180px_1fr]">
      <div className="eyebrow pt-2">{index && <span className="mr-2 text-ink">{index}</span>}{eyebrow}</div>
      <div>
        <h2 className="display max-w-3xl text-[36px] sm:text-[48px]">{title}</h2>
        {intro && <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-ink-soft">{intro}</p>}
      </div>
    </div>
  );
}
