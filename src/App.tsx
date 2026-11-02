import { Suspense, lazy, type ComponentType, type ReactNode } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { SiteLayout } from './components/SiteLayout';
import { useSeo } from './components/ui';
import Home from './pages/Home';

// The home page ships in the main bundle; every other page, and the whole demo workspace, loads on demand.
const named = <K extends string>(load: () => Promise<Record<K, ComponentType<any>>>, key: K) => lazy(() => load().then((m) => ({ default: m[key] })));
const other = () => import('./app/OtherPages');
const trust = () => import('./pages/Trust');
const AppLayout = named(() => import('./app/AppLayout'), 'AppLayout');
const DuplicatesPage = lazy(() => import('./app/DuplicatesPage'));
const InventoryPage = lazy(() => import('./app/InventoryPage'));
const OverviewPage = named(other, 'OverviewPage');
const PropertiesPage = named(other, 'PropertiesPage');
const ReportsPage = named(other, 'ReportsPage');
const RoomsPage = named(other, 'RoomsPage');
const SettingsPage = named(other, 'SettingsPage');
const PlanPage = lazy(() => import('./app/PlanPage'));
const AuditPage = lazy(() => import('./app/AuditPage'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const InventoryManagement = lazy(() => import('./pages/InventoryManagement'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Product = lazy(() => import('./pages/Product'));
const RelocationPlanning = lazy(() => import('./pages/RelocationPlanning'));
const Technology = named(trust, 'Technology');
const Security = named(trust, 'Security');
const Legal = named(trust, 'Legal');

function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-cobalt" aria-hidden />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
const L = ({ children }: { children: ReactNode }) => <Suspense fallback={<Loading />}>{children}</Suspense>;

function AppSeo({ children }: { children: ReactNode }) {
  useSeo('Inventory demo', 'Interactive Roomtally demonstration with sample data for Meridian House: inventory, duplicate review, and relocation planning.', '/inventory');
  return <>{children}</>;
}

function NotFound() {
  useSeo('Page not found', 'The page you were looking for could not be found.');
  return (
    <div className="container-x py-32">
      <div className="eyebrow mb-4">404</div>
      <h1 className="display text-[56px]">This room isn’t on the plan.</h1>
      <Link to="/" className="btn-primary mt-8">Back to home</Link>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="product" element={<L><Product /></L>} />
        <Route path="inventory-management" element={<L><InventoryManagement /></L>} />
        <Route path="relocation-planning" element={<L><RelocationPlanning /></L>} />
        <Route path="how-it-works" element={<L><HowItWorks /></L>} />
        <Route path="pricing" element={<L><Pricing /></L>} />
        <Route path="about" element={<L><About /></L>} />
        <Route path="contact" element={<L><Contact /></L>} />
        <Route path="technology" element={<L><Technology /></L>} />
        <Route path="security" element={<L><Security /></L>} />
        <Route path="privacy" element={<L><Legal kind="privacy" /></L>} />
        <Route path="terms" element={<L><Legal kind="terms" /></L>} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="inventory" element={<AppSeo><L><AppLayout /></L></AppSeo>}>
        <Route index element={<L><OverviewPage /></L>} />
        <Route path="properties" element={<L><PropertiesPage /></L>} />
        <Route path="rooms" element={<L><RoomsPage /></L>} />
        <Route path="items" element={<L><InventoryPage /></L>} />
        <Route path="duplicates" element={<L><DuplicatesPage /></L>} />
        <Route path="plan" element={<L><PlanPage /></L>} />
        <Route path="reports" element={<L><ReportsPage /></L>} />
        <Route path="audit" element={<L><AuditPage /></L>} />
        <Route path="settings" element={<L><SettingsPage /></L>} />
      </Route>
    </Routes>
  );
}
