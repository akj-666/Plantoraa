import { Leaf, Target, Eye, Heart } from 'lucide-react';

type Page = 'home' | 'features' | 'about' | 'contact' | 'login';

interface Props {
  onNavigate: (page: Page) => void;
}

export default function AboutPage({ onNavigate }: Props) {
  return (
    <div className="min-h-screen bg-[#0f2a1e] pt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="text-[#7BAE7F] text-sm font-medium tracking-widest uppercase mb-3 block">Our Story</span>
          <h1 className="text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Built for those who grow the world
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            PLANTORA was born from a simple frustration: plantation owners managing billion-ringgit operations with spreadsheets and paper logs. We set out to build the platform they truly deserved.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <img
              src="https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Plantation"
              className="rounded-2xl w-full h-80 object-cover opacity-80"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              The intelligence your plantation deserves
            </h2>
            <p className="text-white/60 leading-relaxed mb-4">
              Managing a plantation is one of the most complex operational challenges in agriculture. Hundreds of workers, unpredictable weather, precise chemical schedules, fragmented buyer relationships — all managed under immense pressure.
            </p>
            <p className="text-white/60 leading-relaxed">
              PLANTORA unifies every operational layer into a single, powerful platform. We combine the design sensibility of enterprise software with deep understanding of how plantations actually work on the ground.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-24">
          {[
            { icon: Target, title: 'Our Mission', desc: 'To give every plantation owner the operational intelligence of a Fortune 500 company — with the simplicity of a mobile app.' },
            { icon: Eye, title: 'Our Vision', desc: 'A world where agricultural businesses are run with the same precision, data, and insight as the most advanced tech companies.' },
            { icon: Heart, title: 'Our Values', desc: 'We believe in building tools that respect the intelligence of our users, reduce friction, and genuinely move the needle.' },
          ].map((v, i) => (
            <div key={i} className="p-8 rounded-2xl bg-white/[0.03] border border-white/8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#7BAE7F]/15 flex items-center justify-center mx-auto mb-4">
                <v.icon size={22} className="text-[#7BAE7F]" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{v.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-[#1F4D3A]/40 border border-white/8 p-10">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-[#7BAE7F] rounded-xl flex items-center justify-center mb-4">
              <Leaf size={22} className="text-[#1F4D3A]" strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Join the PLANTORA community
            </h2>
            <p className="text-white/60 mb-8 max-w-xl">
              Thousands of plantation owners and managers trust PLANTORA to run their daily operations.
            </p>
            <button
              onClick={() => onNavigate('login')}
              className="px-8 py-4 bg-[#7BAE7F] hover:bg-[#8fc494] text-[#1F4D3A] font-semibold rounded-xl transition-all hover:-translate-y-0.5"
            >
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
