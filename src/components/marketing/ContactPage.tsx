import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#0f2a1e] pt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <span className="text-[#7BAE7F] text-sm font-medium tracking-widest uppercase mb-3 block">Get In Touch</span>
          <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            We'd love to hear from you
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Whether you need a demo, have a question, or want to discuss your plantation's needs — our team is ready.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div>
            <div className="space-y-6 mb-10">
              {[
                { icon: Mail, label: 'Email', value: 'hello@plantora.io' },
                { icon: Phone, label: 'Phone', value: '+60 3-2345 6789' },
                { icon: MapPin, label: 'Office', value: 'Kuala Lumpur, Malaysia' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#7BAE7F]/15 flex items-center justify-center flex-shrink-0">
                    <item.icon size={18} className="text-[#7BAE7F]" />
                  </div>
                  <div>
                    <div className="text-white/40 text-xs mb-0.5">{item.label}</div>
                    <div className="text-white font-medium text-sm">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/8">
              <h3 className="text-white font-semibold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Response Time</h3>
              <p className="text-white/50 text-sm">We typically respond within 24 hours on business days. For urgent matters, call us directly.</p>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/8">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
                <div className="w-14 h-14 rounded-full bg-[#7BAE7F]/20 flex items-center justify-center">
                  <CheckCircle size={28} className="text-[#7BAE7F]" />
                </div>
                <h3 className="text-white font-semibold text-xl" style={{ fontFamily: 'Poppins, sans-serif' }}>Message sent!</h3>
                <p className="text-white/50 text-sm max-w-xs">
                  Thank you for reaching out. Our team will get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-white/60 text-xs mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/50 transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/50 transition-colors"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1.5">Company / Plantation Name</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/50 transition-colors"
                    placeholder="Your plantation name"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1.5">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/50 transition-colors resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#7BAE7F] hover:bg-[#8fc494] text-[#1F4D3A] font-semibold rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-[#7BAE7F]/20"
                >
                  <Send size={16} />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
