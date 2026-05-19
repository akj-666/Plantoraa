import { ArrowRight, BarChart3, Users, CloudRain, Leaf, TrendingUp, ShieldCheck, ChevronRight, Star } from 'lucide-react';

type Page = 'home' | 'features' | 'about' | 'contact' | 'login';

interface Props {
  onNavigate: (page: Page) => void;
}

const features = [
  { icon: Users, title: 'Labor Management', desc: 'Track every worker, shift, and activity with intelligent scheduling and real-time oversight.' },
  { icon: BarChart3, title: 'Harvest Analytics', desc: 'Visualize yield trends, seasonal comparisons, and productivity with executive-level dashboards.' },
  { icon: CloudRain, title: 'Weather Intelligence', desc: 'Live weather feeds, rain alerts, and plantation risk scoring to protect your crops.' },
  { icon: Leaf, title: 'Fertilizer Scheduling', desc: 'Smart fertilizer rounds with zone allocation, mixing ratios, and automated reminders.' },
  { icon: TrendingUp, title: 'Expense Tracking', desc: 'Receipt-level expense management with weekly grouping, analytics, and downloadable reports.' },
  { icon: ShieldCheck, title: 'Role-Based Access', desc: 'Owner and Manager roles with fine-grained permission control across all modules.' },
];

const stats = [
  { value: '50K+', label: 'Workers Managed' },
  { value: '1,200+', label: 'Plantations' },
  { value: '98.5%', label: 'Uptime SLA' },
  { value: '4.9/5', label: 'Customer Rating' },
];

const testimonials = [
  {
    name: 'Rajesh Nair',
    role: 'Plantation Owner, Kerala',
    content: 'PLANTORA transformed how we manage 200+ workers across 3 estates. The attendance system alone saved us 15 hours per week.',
    rating: 5,
  },
  {
    name: 'Meena Chandran',
    role: 'Estate Manager, Tamil Nadu',
    content: 'The fertilizer scheduling and weather alerts are phenomenal. We have not missed a single application cycle since onboarding.',
    rating: 5,
  },
  {
    name: 'Arun Pillai',
    role: 'Agri-Business Owner',
    content: 'Finally a platform that understands plantation operations. The buyer records and profit tracking are exactly what we needed.',
    rating: 5,
  },
];

export default function HomePage({ onNavigate }: Props) {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=1920')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f15]/85 via-[#1F4D3A]/70 to-[#0f2a1e]/95" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#7BAE7F]/30 bg-[#7BAE7F]/10 backdrop-blur-sm mb-8 text-[#7BAE7F] text-sm font-medium">
            <span className="w-1.5 h-1.5 bg-[#7BAE7F] rounded-full animate-pulse" />
            Smart Plantation Management Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Grow Smarter
            <br />
            <span className="text-[#7BAE7F]">Every Season</span>
          </h1>

          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            The operating system for modern plantation management. Labor, harvest, weather, expenses — all in one intelligent platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('login')}
              className="group px-8 py-4 bg-[#7BAE7F] hover:bg-[#8fc494] text-[#1F4D3A] font-semibold rounded-xl text-base transition-all duration-300 hover:shadow-2xl hover:shadow-[#7BAE7F]/25 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Login to Platform
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('features')}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/15 hover:border-white/25 text-white font-medium rounded-xl text-base transition-all duration-300 hover:-translate-y-0.5"
            >
              Explore Features
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
          <span className="text-xs tracking-widest uppercase">Scroll to explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#1a3829] border-y border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {stat.value}
              </div>
              <div className="text-white/50 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-28 px-6 bg-[#0f2a1e]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#7BAE7F] text-sm font-medium tracking-widest uppercase mb-3 block">Platform Capabilities</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Everything your plantation needs
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Built for owners and managers who demand precision, clarity, and control at every level of operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-white/[0.03] border border-white/8 hover:bg-white/[0.06] hover:border-[#7BAE7F]/30 transition-all duration-300 cursor-default"
              >
                <div className="w-10 h-10 rounded-xl bg-[#7BAE7F]/15 flex items-center justify-center mb-4 group-hover:bg-[#7BAE7F]/25 transition-colors">
                  <f.icon size={20} className="text-[#7BAE7F]" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-28 px-6 bg-[#0d2218]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#7BAE7F] text-sm font-medium tracking-widest uppercase mb-3 block">Executive Dashboard</span>
              <h2 className="text-4xl font-bold text-white mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Intelligence at a glance
              </h2>
              <p className="text-white/50 leading-relaxed mb-8">
                Your entire plantation operation summarized in one powerful view. From worker attendance to harvest yield, weather risk to financial performance — all visible the moment you log in.
              </p>
              <ul className="space-y-3 mb-8">
                {['Real-time worker attendance overview', 'Yield analytics with seasonal trends', 'Live weather risk scoring', 'Weekly expense summaries'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-white/70 text-sm">
                    <div className="w-1.5 h-1.5 bg-[#7BAE7F] rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onNavigate('login')}
                className="flex items-center gap-2 text-[#7BAE7F] font-medium hover:gap-3 transition-all text-sm"
              >
                Access Dashboard <ChevronRight size={16} />
              </button>
            </div>

            <div className="relative">
              <div className="rounded-2xl bg-[#1F4D3A]/40 border border-white/10 p-6 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: 'Active Workers', value: '147', sub: '+12 today', color: 'text-[#7BAE7F]' },
                    { label: 'Yield This Week', value: '4.2T', sub: '+8% vs last', color: 'text-emerald-400' },
                    { label: 'Expenses', value: 'RM 8,420', sub: 'This week', color: 'text-amber-400' },
                    { label: 'Health Score', value: '94%', sub: 'Excellent', color: 'text-sky-400' },
                  ].map(card => (
                    <div key={card.label} className="p-4 rounded-xl bg-white/5 border border-white/8">
                      <div className="text-white/50 text-xs mb-1">{card.label}</div>
                      <div className={`text-xl font-bold mb-0.5 ${card.color}`} style={{ fontFamily: 'Poppins, sans-serif' }}>{card.value}</div>
                      <div className="text-white/40 text-xs">{card.sub}</div>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/8">
                  <div className="text-white/50 text-xs mb-3">Weekly Attendance Rate</div>
                  <div className="flex items-end gap-1 h-12">
                    {[65, 80, 75, 90, 88, 95, 82].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-[#7BAE7F]/60 rounded-sm transition-all"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-white/30 text-xs mt-2">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
                      <span key={d}>{d}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -inset-1 bg-[#7BAE7F]/5 rounded-2xl blur-xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-28 px-6 bg-[#0f2a1e]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#7BAE7F] text-sm font-medium tracking-widest uppercase mb-3 block">Trusted By Leaders</span>
            <h2 className="text-4xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
              What plantation owners say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-[#7BAE7F]/20 transition-all duration-300">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="text-[#7BAE7F] fill-[#7BAE7F]" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-4">"{t.content}"</p>
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-white/40 text-xs">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#0d2218] to-[#1F4D3A]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Ready to modernize your plantation?
          </h2>
          <p className="text-white/50 text-lg mb-10">
            Join 1,200+ plantation owners who run their operations with PLANTORA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('login')}
              className="px-8 py-4 bg-[#7BAE7F] hover:bg-[#8fc494] text-[#1F4D3A] font-semibold rounded-xl text-base transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#7BAE7F]/20"
            >
              Get Started Free
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-medium rounded-xl text-base transition-all"
            >
              Talk to Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
