import { useState, useEffect } from 'react';
import { Leaf, Menu, X } from 'lucide-react';

type Page = 'home' | 'features' | 'about' | 'contact' | 'login';

interface Props {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Navbar({ currentPage, onNavigate }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; page: Page }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Features', page: 'features' },
    { label: 'About', page: 'about' },
    { label: 'Contact', page: 'contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-[#0f2a1e]/95 backdrop-blur-xl border-b border-white/5 shadow-xl shadow-black/20' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 bg-[#7BAE7F] rounded-lg flex items-center justify-center group-hover:bg-[#8fc494] transition-colors">
            <Leaf size={16} className="text-[#1F4D3A]" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl tracking-tight text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
            PLANTORA
          </span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <button
              key={link.page}
              onClick={() => onNavigate(link.page)}
              className={`text-sm font-medium transition-colors ${
                currentPage === link.page
                  ? 'text-[#7BAE7F]'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => onNavigate('login')}
            className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => onNavigate('login')}
            className="px-5 py-2 bg-[#7BAE7F] hover:bg-[#8fc494] text-[#1F4D3A] text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#7BAE7F]/20"
          >
            Request Demo
          </button>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white/80 hover:text-white"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#0f2a1e]/98 backdrop-blur-xl border-t border-white/5 px-6 py-4 flex flex-col gap-4">
          {navLinks.map(link => (
            <button
              key={link.page}
              onClick={() => { onNavigate(link.page); setMenuOpen(false); }}
              className={`text-sm font-medium text-left py-2 ${
                currentPage === link.page ? 'text-[#7BAE7F]' : 'text-white/70'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => { onNavigate('login'); setMenuOpen(false); }}
            className="mt-2 px-5 py-2.5 bg-[#7BAE7F] text-[#1F4D3A] text-sm font-semibold rounded-lg w-full"
          >
            Login / Request Demo
          </button>
        </div>
      )}
    </nav>
  );
}
