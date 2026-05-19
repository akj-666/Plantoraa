import { Users, Calendar, CloudRain, Leaf, DollarSign, BarChart3, ShoppingBag, FileText, Settings, CheckCircle } from 'lucide-react';

type Page = 'home' | 'features' | 'about' | 'contact' | 'login';

interface Props {
  onNavigate: (page: Page) => void;
}

const modules = [
  {
    icon: Users,
    title: 'Labor Management',
    desc: 'Comprehensive worker registry with daily logs, shift tracking, supervisor assignment, and productivity analytics.',
    features: ['Worker ID & profile management', 'Daily work logs with hours tracking', 'Work type categorization', 'Supervisor assignment', 'Export to PDF/Excel'],
    access: 'Both',
  },
  {
    icon: Calendar,
    title: 'Worker Attendance',
    desc: 'Mark attendance with present, absent, half-day, or overtime status. Visual heatmaps and weekly reports.',
    features: ['Present / Absent / Half-day / Overtime', 'Attendance calendar view', 'Weekly attendance reports', 'Activity heatmaps', 'Overtime hour tracking'],
    access: 'Both',
  },
  {
    icon: CloudRain,
    title: 'Weather Alerts',
    desc: 'Live weather monitoring with plantation risk scoring, rain alerts, humidity and wind speed tracking.',
    features: ['Live weather data', 'Rain & storm alerts', 'Humidity monitoring', 'Wind speed tracking', 'Plantation risk scoring'],
    access: 'Both',
  },
  {
    icon: Leaf,
    title: 'Fertilizer Scheduling',
    desc: 'Plan fertilizer rounds by zone with mixing ratios, reminders, and timeline views.',
    features: ['Zone-based scheduling', 'Fertilizer name & quantity', 'Mixing ratio notes', 'Completion tracking', 'Smart reminders'],
    access: 'Both',
  },
  {
    icon: DollarSign,
    title: 'Expense Tracker',
    desc: 'Receipt-level expense management with category grouping, analytics, and downloadable weekly reports.',
    features: ['Category-based tracking', 'Receipt image upload', 'Supplier/vendor records', 'Weekly grouping', 'Downloadable reports'],
    access: 'Owner Only',
  },
  {
    icon: BarChart3,
    title: 'Harvest Logs',
    desc: 'Track crop yields by zone, date, and quality grade with seasonal comparison analytics.',
    features: ['Crop name & quantity', 'Zone-based tracking', 'Quality grading', 'Worker attribution', 'Yield trend charts'],
    access: 'Both',
  },
  {
    icon: ShoppingBag,
    title: 'Buyer / Seller Records',
    desc: 'Complete transaction history with profit tracking, transport costs, and monthly sales analytics.',
    features: ['Buyer/seller profiles', 'Sale amount & date', 'Transport cost tracking', 'Final profit calculation', 'Invoice generation'],
    access: 'Owner Only',
  },
  {
    icon: FileText,
    title: 'Reports & Analytics',
    desc: 'Generate comprehensive reports across labor, attendance, expenses, harvest, and sales.',
    features: ['Labor & attendance reports', 'Expense summaries', 'Harvest analytics', 'Sales performance', 'Downloadable formats'],
    access: 'Owner Only',
  },
  {
    icon: Settings,
    title: 'Platform Settings',
    desc: 'Plantation profile, manager permissions, notification preferences, and account controls.',
    features: ['Plantation profile setup', 'Manager permission control', 'Notification settings', 'Account management', 'Data export/backup'],
    access: 'Owner Only',
  },
];

export default function FeaturesPage({ onNavigate }: Props) {
  return (
    <div className="min-h-screen bg-[#0f2a1e] pt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-20">
          <span className="text-[#7BAE7F] text-sm font-medium tracking-widest uppercase mb-3 block">Full Platform Overview</span>
          <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Every module, explained
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            PLANTORA brings every aspect of plantation management into a single, elegant platform designed for serious operators.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {modules.map((mod, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-[#7BAE7F]/25 transition-all duration-300 group flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#7BAE7F]/15 flex items-center justify-center group-hover:bg-[#7BAE7F]/25 transition-colors">
                  <mod.icon size={20} className="text-[#7BAE7F]" />
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  mod.access === 'Owner Only'
                    ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                    : 'bg-[#7BAE7F]/10 text-[#7BAE7F] border border-[#7BAE7F]/20'
                }`}>
                  {mod.access}
                </span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{mod.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">{mod.desc}</p>
              <ul className="space-y-2 mt-auto">
                {mod.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-white/60 text-xs">
                    <CheckCircle size={12} className="text-[#7BAE7F] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-[#1F4D3A] to-[#2a5e47] border border-[#7BAE7F]/20 p-10 text-center">
          <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Start managing smarter today
          </h2>
          <p className="text-white/60 mb-8">Get full access to every module with your PLANTORA account.</p>
          <button
            onClick={() => onNavigate('login')}
            className="px-8 py-4 bg-[#7BAE7F] hover:bg-[#8fc494] text-[#1F4D3A] font-semibold rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#7BAE7F]/20"
          >
            Create Your Account
          </button>
        </div>
      </div>
    </div>
  );
}
