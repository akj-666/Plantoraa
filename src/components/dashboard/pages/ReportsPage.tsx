import { FileText, Download, BarChart3, Users, DollarSign, Leaf, CloudRain, ShoppingBag } from 'lucide-react';

const reportTypes = [
  {
    icon: Users,
    title: 'Labor Report',
    desc: 'Complete work logs, hours, and productivity breakdown by worker and week.',
    color: 'text-[#7BAE7F]',
    bg: 'bg-[#7BAE7F]/10',
    period: 'Weekly / Monthly',
  },
  {
    icon: FileText,
    title: 'Attendance Report',
    desc: 'Present/absent rates, overtime tracking, and attendance trends.',
    color: 'text-sky-400',
    bg: 'bg-sky-400/10',
    period: 'Weekly / Monthly',
  },
  {
    icon: DollarSign,
    title: 'Expense Report',
    desc: 'Category-wise expense breakdown, supplier history, and budget analysis.',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    period: 'Weekly / Monthly',
  },
  {
    icon: BarChart3,
    title: 'Harvest Analytics',
    desc: 'Yield trends, quality grades, zone productivity, and seasonal comparison.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    period: 'Monthly / Seasonal',
  },
  {
    icon: Leaf,
    title: 'Fertilizer Usage',
    desc: 'Applied fertilizers, completion rates, zone-wise usage, and pending schedules.',
    color: 'text-lime-400',
    bg: 'bg-lime-400/10',
    period: 'Monthly',
  },
  {
    icon: ShoppingBag,
    title: 'Sales Report',
    desc: 'Buyer transactions, revenue, profit margins, and payment status summary.',
    color: 'text-pink-400',
    bg: 'bg-pink-400/10',
    period: 'Monthly / Annual',
  },
  {
    icon: CloudRain,
    title: 'Weather Log',
    desc: 'Historical weather conditions, risk events, and seasonal weather patterns.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    period: 'Monthly',
  },
];

export default function ReportsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Reports & Analytics</h1>
        <p className="text-white/50 text-sm">Generate detailed reports across all operational modules.</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Reports Generated', value: '24', color: 'text-white' },
          { label: 'This Month', value: '8', color: 'text-[#7BAE7F]' },
          { label: 'Data Points', value: '1.2K', color: 'text-sky-400' },
          { label: 'Last Export', value: 'Today', color: 'text-amber-400' },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-2xl bg-white/[0.04] border border-white/8">
            <div className={`text-xl font-bold ${s.color} mb-0.5`} style={{ fontFamily: 'Poppins, sans-serif' }}>{s.value}</div>
            <div className="text-white/40 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {reportTypes.map((r, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white/[0.04] border border-white/8 hover:border-white/15 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${r.bg} flex items-center justify-center`}>
                <r.icon size={17} className={r.color} />
              </div>
              <span className="text-white/30 text-xs">{r.period}</span>
            </div>
            <h3 className="text-white font-semibold text-sm mb-1.5" style={{ fontFamily: 'Poppins, sans-serif' }}>{r.title}</h3>
            <p className="text-white/50 text-xs leading-relaxed mb-4">{r.desc}</p>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/5 border border-white/10 hover:border-white/20 rounded-lg text-white/60 hover:text-white text-xs transition-all">
                <BarChart3 size={12} />
                Preview
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/5 border border-white/10 hover:border-white/20 rounded-lg text-white/60 hover:text-white text-xs transition-all">
                <Download size={12} />
                Export
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 rounded-2xl bg-[#1F4D3A]/30 border border-[#7BAE7F]/15">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#7BAE7F]/15 flex items-center justify-center flex-shrink-0">
            <Download size={15} className="text-[#7BAE7F]" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Bulk Export</h3>
            <p className="text-white/50 text-xs leading-relaxed mb-3">
              Download all reports for a selected date range in PDF or Excel format.
            </p>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-[#7BAE7F]/15 border border-[#7BAE7F]/25 text-[#7BAE7F] text-xs rounded-lg hover:bg-[#7BAE7F]/25 transition-colors">
                Export All as PDF
              </button>
              <button className="px-4 py-2 bg-white/5 border border-white/10 text-white/60 text-xs rounded-lg hover:text-white transition-colors">
                Export as Excel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
