import { Link, Route, Routes } from 'react-router-dom';
import { AppLayout } from './app/AppLayout';
import DuplicatesPage from './app/DuplicatesPage';
import InventoryPage from './app/InventoryPage';
import { OverviewPage, PropertiesPage, ReportsPage, RoomsPage, SettingsPage } from './app/OtherPages';
import PlanPage from './app/PlanPage';
import { SiteLayout } from './components/SiteLayout';
import { useSeo } from './components/ui';
import About from './pages/About';
import Contact from './pages/Contact';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import InventoryManagement from './pages/InventoryManagement';
import Pricing from './pages/Pricing';
import Product from './pages/Product';
import RelocationPlanning from './pages/RelocationPlanning';

function AppSeo({ children }: { children: React.ReactNode }) {
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
        <Route path="product" element={<Product />} />
        <Route path="inventory-management" element={<InventoryManagement />} />
        <Route path="relocation-planning" element={<RelocationPlanning />} />
        <Route path="how-it-works" element={<HowItWorks />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="inventory" element={<AppSeo><AppLayout /></AppSeo>}>
        <Route index element={<OverviewPage />} />
        <Route path="properties" element={<PropertiesPage />} />
        <Route path="rooms" element={<RoomsPage />} />
        <Route path="items" element={<InventoryPage />} />
        <Route path="duplicates" element={<DuplicatesPage />} />
        <Route path="plan" element={<PlanPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
