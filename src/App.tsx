import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import MarketingLayout from './components/marketing/MarketingLayout';
import DashboardLayout from './components/dashboard/DashboardLayout';
import LoginPage from './components/marketing/LoginPage';

type Page = 'home' | 'features' | 'about' | 'contact' | 'login';

function AppInner() {
  const { user, loading } = useAuth();
  const [marketingPage, setMarketingPage] = useState<Page>('home');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1F4D3A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#7BAE7F] border-t-transparent rounded-full animate-spin" />
          <span className="text-[#7BAE7F] font-medium tracking-widest text-sm uppercase">Loading Plantora</span>
        </div>
      </div>
    );
  }

  if (user) {
    return <DashboardLayout />;
  }

  if (marketingPage === 'login') {
    return <LoginPage onBack={() => setMarketingPage('home')} />;
  }

  return (
    <MarketingLayout
      currentPage={marketingPage}
      onNavigate={setMarketingPage}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
