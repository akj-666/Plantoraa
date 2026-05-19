import { Users, TrendingUp, DollarSign, Leaf, CloudRain, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { DashboardPage } from '../DashboardLayout';

interface Props {
  onNavigate: (page: DashboardPage) => void;
}

export default function DashboardHome({ onNavigate }: Props) {
  const { profile, isOwner } = useAuth();

  const kpis = [
    { label: 'Active Workers', value: '147', change: '+12 today', color: 'text-[#7BAE7F]', icon: Users, bg: 'bg-[#7BAE7F]/10' },
    { label: 'Weekly Yield', value: '4.2T', change: '+8% vs last week', color: 'text-emerald-400', icon: TrendingUp, bg: 'bg-emerald-400/10' },
    ...(isOwner ? [
      { label: 'Weekly Expenses', value: 'RM 8,420', change: '-3% vs last week', color: 'text-amber-400', icon: DollarSign, bg: 'bg-amber-400/10' },
    ] : []),
    { label: 'Health Score', value: '94%', change: 'Excellent condition', color: 'text-sky-400', icon: Leaf, bg: 'bg-sky-400/10' },
  ];

  const alerts = [
    { type: 'warning', msg: 'High humidity forecast — possible fungal risk on Zone C', time: '2h ago' },
    { type: 'info', msg: 'Fertilizer round #3 due in 3 days for Zone A & B', time: '5h ago' },
    { type: 'success', msg: 'Attendance rate this week: 96.2% — above target', time: '1d ago' },
  ];

  const recentActivity = [
    { action: 'Attendance marked', detail: '42 workers — Zone A morning shift', time: '8:12 AM' },
    { action: 'Harvest logged', detail: '1.4T of palm oil — Zone B', time: 'Yesterday' },
    { action: 'Fertilizer applied', detail: 'NPK Round 2 — Zone C (completed)', time: 'Yesterday' },
    { action: 'Worker added', detail: 'Ahmad bin Razak — Harvester', time: '2 days ago' },
  ];

  const upcomingFertilizer = [
    { name: 'NPK 15-15-15', zone: 'Zone A', date: 'May 22', status: 'pending' },
    { name: 'Borate', zone: 'Zone B', date: 'May 25', status: 'pending' },
    { name: 'Urea', zone: 'Zone C', date: 'Jun 1', status: 'scheduled' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Good morning, {profile?.full_name?.split(' ')[0] || 'there'}
        </h1>
        <p className="text-white/50 text-sm">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white/[0.04] border border-white/8 hover:border-white/15 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                <kpi.icon size={17} className={kpi.color} />
              </div>
              <span className="text-white/30 text-xs">{kpi.change}</span>
            </div>
            <div className={`text-2xl font-bold mb-0.5 ${kpi.color}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
              {kpi.value}
            </div>
            <div className="text-white/50 text-xs">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Attendance Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white/[0.04] border border-white/8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>Weekly Attendance</h2>
            <button onClick={() => onNavigate('attendance')} className="text-[#7BAE7F] text-xs hover:underline">View all</button>
          </div>
          <div className="flex items-end gap-2 h-28 mb-3">
            {[
              { day: 'Mon', rate: 92, count: 135 },
              { day: 'Tue', rate: 88, count: 129 },
              { day: 'Wed', rate: 95, count: 139 },
              { day: 'Thu', rate: 90, count: 132 },
              { day: 'Fri', rate: 96, count: 141 },
              { day: 'Sat', rate: 78, count: 115 },
              { day: 'Sun', rate: 45, count: 66 },
            ].map(d => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-[#7BAE7F]/60 hover:bg-[#7BAE7F] rounded-md transition-colors cursor-default relative group"
                  style={{ height: `${d.rate}%` }}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#1F4D3A] text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {d.count} workers
                  </div>
                </div>
                <span className="text-white/40 text-xs">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/8">
          <h2 className="text-white font-semibold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Alerts</h2>
          <div className="space-y-3">
            {alerts.map((a, i) => (
              <div key={i} className="flex gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  {a.type === 'warning' && <AlertTriangle size={14} className="text-amber-400" />}
                  {a.type === 'info' && <CloudRain size={14} className="text-sky-400" />}
                  {a.type === 'success' && <CheckCircle size={14} className="text-[#7BAE7F]" />}
                </div>
                <div>
                  <p className="text-white/70 text-xs leading-relaxed">{a.msg}</p>
                  <span className="text-white/30 text-xs">{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/8">
          <h2 className="text-white font-semibold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((act, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                <div className="w-1.5 h-1.5 bg-[#7BAE7F] rounded-full mt-1.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-white/80 text-xs font-medium">{act.action}</div>
                  <div className="text-white/40 text-xs">{act.detail}</div>
                </div>
                <div className="flex items-center gap-1 text-white/30 text-xs flex-shrink-0">
                  <Clock size={11} />
                  {act.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Fertilizer */}
        <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>Upcoming Fertilizer</h2>
            <button onClick={() => onNavigate('fertilizer')} className="text-[#7BAE7F] text-xs hover:underline">Manage</button>
          </div>
          <div className="space-y-3">
            {upcomingFertilizer.map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                  <Leaf size={14} className="text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white/80 text-xs font-medium">{f.name}</div>
                  <div className="text-white/40 text-xs">{f.zone}</div>
                </div>
                <div className="text-right">
                  <div className="text-white/60 text-xs">{f.date}</div>
                  <div className={`text-xs ${f.status === 'pending' ? 'text-amber-400' : 'text-sky-400'}`}>
                    {f.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weather snapshot */}
      <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-sky-900/30 to-[#1F4D3A]/40 border border-sky-500/15 cursor-pointer hover:border-sky-500/30 transition-all"
        onClick={() => onNavigate('weather')}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white/60 text-xs mb-1">Current Weather — Plantation Area</div>
            <div className="text-white font-semibold text-lg">Partly Cloudy &nbsp;·&nbsp; 28°C</div>
            <div className="text-white/50 text-xs mt-1">Humidity: 78% &nbsp;|&nbsp; Wind: 12 km/h &nbsp;|&nbsp; Risk: Low</div>
          </div>
          <div className="text-5xl opacity-40">
            <CloudRain size={48} className="text-sky-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
