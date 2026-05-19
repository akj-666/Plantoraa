import { Leaf } from 'lucide-react';

type Page = 'home' | 'features' | 'about' | 'contact' | 'login';

interface Props {
  onNavigate: (page: Page) => void;
}

export default function Footer({ onNavigate }: Props) {
  return (
    <footer className="bg-[#0a1f15] border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-[#7BAE7F] rounded-lg flex items-center justify-center">
                <Leaf size={14} className="text-[#1F4D3A]" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-lg text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>PLANTORA</span>
            </button>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              The smart plantation management platform for serious operators. Grow smarter every season.
            </p>
          </div>

          <div>
            <div className="text-white/60 text-xs font-medium uppercase tracking-widest mb-4">Platform</div>
            <ul className="space-y-2.5">
              {(['features', 'about', 'contact'] as Page[]).map(p => (
                <li key={p}>
                  <button
                    onClick={() => onNavigate(p)}
                    className="text-white/50 hover:text-white text-sm capitalize transition-colors"
                  >
                    {p}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-white/60 text-xs font-medium uppercase tracking-widest mb-4">Account</div>
            <ul className="space-y-2.5">
              {['Login', 'Request Demo', 'Support'].map(l => (
                <li key={l}>
                  <button
                    onClick={() => onNavigate('login')}
                    className="text-white/50 hover:text-white text-sm transition-colors"
                  >
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="text-white/30 text-xs">
            2024 PLANTORA. All rights reserved.
          </div>
          <div className="text-white/30 text-xs">
            Built for plantation owners who demand excellence.
          </div>
        </div>
      </div>
    </footer>
  );
}
