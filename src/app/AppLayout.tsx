import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Building2, ClipboardList, Copy, FileBarChart, KanbanSquare, LayoutDashboard, LayoutGrid, Menu, Settings, X,
} from 'lucide-react';
import { LogoMark } from '../components/ui';
import { useInventory } from '../store/InventoryContext';

const SECTIONS = [
  { to: '/inventory', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/inventory/properties', label: 'Properties', icon: Building2 },
  { to: '/inventory/rooms', label: 'Rooms', icon: LayoutGrid },
  { to: '/inventory/items', label: 'Furniture Inventory', icon: ClipboardList },
  { to: '/inventory/duplicates', label: 'Duplicate Review', icon: Copy, badge: true },
  { to: '/inventory/plan', label: 'Relocation Plan', icon: KanbanSquare },
  { to: '/inventory/reports', label: 'Reports', icon: FileBarChart },
  { to: '/inventory/settings', label: 'Settings', icon: Settings },
];

export function AppLayout() {
  const { state } = useInventory();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  const pendingDup = state.duplicateGroups.filter((g) => g.resolution === 'pending').length;
  const current = SECTIONS.find((s) => (s.end ? pathname === s.to : pathname.startsWith(s.to)));

  const nav = (
    <nav aria-label="Workspace" className="flex flex-col gap-0.5 px-3">
      {SECTIONS.map((s) => (
        <NavLink
          key={s.to}
          to={s.to}
          end={s.end}
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2 text-[13.5px] transition-colors ${
              isActive ? 'bg-ink text-paper' : 'text-ink-soft hover:bg-stone-100'
            }`
          }
        >
          <s.icon size={16} strokeWidth={1.6} />
          <span className="flex-1">{s.label}</span>
          {s.badge && pendingDup > 0 && (
            <span className="min-w-5 bg-amber px-1.5 text-center font-mono text-[10.5px] leading-5 text-white" aria-label={`${pendingDup} pending`}>
              {pendingDup}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );

  const brand = (
    <div className="flex h-14 items-center justify-between border-b border-line px-5">
      <Link to="/" className="flex items-center gap-2" aria-label="Roomtally website">
        <LogoMark className="h-6 w-6" />
        <span className="text-[15px] font-semibold tracking-tight">room<span className="font-normal">tally</span></span>
      </Link>
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Demo</span>
    </div>
  );

  const footer = (
    <div className="mt-auto border-t border-line p-4 text-[11.5px] leading-relaxed text-muted">
      <div className="mb-1 font-medium text-ink-soft">{state.settings.organisation}</div>
      Sample workspace. Edits are saved in this browser only.
    </div>
  );

  return (
    <div className="flex min-h-screen bg-stone-50">
      <a href="#app-main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:bg-ink focus:px-3 focus:py-2 focus:text-paper">Skip to content</a>
      <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col border-r border-line bg-paper lg:flex">
        {brand}
        <div className="eyebrow px-6 pb-2 pt-5">Workspace</div>
        {nav}
        {footer}
      </aside>
      {open && (
        <div className="fixed inset-0 z-50 bg-ink/30 lg:hidden" onClick={() => setOpen(false)}>
          <aside className="flex h-full w-[264px] flex-col border-r border-line bg-paper" onClick={(e) => e.stopPropagation()}>
            {brand}
            <div className="py-4">{nav}</div>
            {footer}
          </aside>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-paper/95 px-4 backdrop-blur sm:px-6">
          <button className="btn-ghost btn-sm px-2 lg:hidden" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen((o) => !o)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="min-w-0 flex-1 truncate text-[13px] text-muted">
            <span className="text-ink">Meridian House</span>
            <span className="mx-2 text-stone-300">/</span>
            {current?.label}
          </div>
          <span className="hidden border border-dashed border-stone-400 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted sm:inline">
            Sample data · simulated matching
          </span>
          <Link to="/" className="btn-secondary btn-sm">Website</Link>
        </header>
        <main id="app-main" className="flex-1 px-4 py-6 sm:px-8 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function PageTitle({ title, intro, actions }: { title: string; intro?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-[24px] font-semibold tracking-[-0.02em]">{title}</h1>
        {intro && <p className="mt-1 max-w-2xl text-[14px] text-muted">{intro}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
