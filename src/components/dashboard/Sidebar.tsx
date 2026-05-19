import {
  Leaf, LayoutDashboard, Users, Calendar, CloudRain, Sprout,
  DollarSign, BarChart2, ShoppingBag, FileText, Settings,
  LogOut, ChevronLeft, ChevronRight, Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DashboardPage } from './DashboardLayout';

interface NavItem {
  id: DashboardPage;
  label: string;
  icon: React.ElementType;
  ownerOnly?: boolean;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'labor', label: 'Labor', icon: Users },
  { id: 'attendance', label: 'Attendance', icon: Calendar },
  { id: 'weather', label: 'Weather', icon: CloudRain },
  { id: 'fertilizer', label: 'Fertilizer', icon: Sprout },
  { id: 'harvest', label: 'Harvest', icon: BarChart2 },
  { id: 'expenses', label: 'Expenses', icon: DollarSign, ownerOnly: true },
  { id: 'buyers', label: 'Buyers / Sellers', icon: ShoppingBag, ownerOnly: true },
  { id: 'reports', label: 'Reports', icon: FileText, ownerOnly: true },
  { id: 'settings', label: 'Settings', icon: Settings, ownerOnly: true },
];

interface Props {
  currentPage: DashboardPage;
  onNavigate: (page: DashboardPage) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ currentPage, onNavigate, isOpen, onToggle }: Props) {
  const { profile, signOut, isOwner } = useAuth();

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-[#0a1f15] border-r border-white/5 flex flex-col transition-all duration-300 z-40 ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/5 ${isOpen ? '' : 'justify-center'}`}>
        <div className="w-8 h-8 bg-[#7BAE7F] rounded-lg flex items-center justify-center flex-shrink-0">
          <Leaf size={15} className="text-[#1F4D3A]" strokeWidth={2.5} />
        </div>
        {isOpen && (
          <span className="font-bold text-white text-base tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            PLANTORA
          </span>
        )}
      </div>

      {/* Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-14 w-6 h-6 bg-[#1F4D3A] border border-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors z-50"
      >
        {isOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="px-3 space-y-1">
          {navItems.map(item => {
            const isLocked = item.ownerOnly && !isOwner;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={!isOpen ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#7BAE7F]/15 text-[#7BAE7F] border border-[#7BAE7F]/20'
                    : isLocked
                    ? 'text-white/25 cursor-pointer'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                } ${!isOpen ? 'justify-center' : ''}`}
              >
                <item.icon size={17} className="flex-shrink-0" />
                {isOpen && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {isLocked && <Lock size={12} className="text-white/25" />}
                  </>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* User */}
      <div className={`p-4 border-t border-white/5 ${!isOpen ? 'flex justify-center' : ''}`}>
        {isOpen ? (
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#7BAE7F]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[#7BAE7F] text-xs font-semibold">
                {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-medium truncate">{profile?.full_name || 'User'}</div>
              <div className="text-white/40 text-xs capitalize">{profile?.role || 'manager'}</div>
            </div>
          </div>
        ) : null}
        <button
          onClick={signOut}
          title={!isOpen ? 'Sign out' : undefined}
          className={`flex items-center gap-2 text-white/40 hover:text-red-400 text-xs transition-colors ${!isOpen ? '' : 'w-full'}`}
        >
          <LogOut size={14} />
          {isOpen && 'Sign out'}
        </button>
      </div>
    </aside>
  );
}
