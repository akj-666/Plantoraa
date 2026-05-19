import { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardHome from './pages/DashboardHome';
import LaborManagement from './pages/LaborManagement';
import AttendancePage from './pages/AttendancePage';
import WeatherPage from './pages/WeatherPage';
import FertilizerPage from './pages/FertilizerPage';
import ExpensePage from './pages/ExpensePage';
import HarvestPage from './pages/HarvestPage';
import BuyerSellerPage from './pages/BuyerSellerPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import { useAuth } from '../../context/AuthContext';

export type DashboardPage =
  | 'dashboard'
  | 'labor'
  | 'attendance'
  | 'weather'
  | 'fertilizer'
  | 'expenses'
  | 'harvest'
  | 'buyers'
  | 'reports'
  | 'settings';

export default function DashboardLayout() {
  const [currentPage, setCurrentPage] = useState<DashboardPage>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isOwner } = useAuth();

  const renderPage = () => {
    switch (currentPage) {
      case 'labor': return <LaborManagement />;
      case 'attendance': return <AttendancePage />;
      case 'weather': return <WeatherPage />;
      case 'fertilizer': return <FertilizerPage />;
      case 'expenses': return isOwner ? <ExpensePage /> : <AccessDenied />;
      case 'harvest': return <HarvestPage />;
      case 'buyers': return isOwner ? <BuyerSellerPage /> : <AccessDenied />;
      case 'reports': return isOwner ? <ReportsPage /> : <AccessDenied />;
      case 'settings': return isOwner ? <SettingsPage /> : <AccessDenied />;
      default: return <DashboardHome onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f2a1e] flex">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main
        className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'} min-h-screen`}
      >
        <div className="p-6 md:p-8 min-h-screen">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="text-5xl">🔒</div>
      <h2 className="text-white text-xl font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
        Access Restricted
      </h2>
      <p className="text-white/50 text-sm text-center max-w-sm">
        This module is only accessible to plantation owners. Contact your owner for access.
      </p>
    </div>
  );
}
