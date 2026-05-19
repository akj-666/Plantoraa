import { useState } from 'react';
import { Leaf, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
  onBack: () => void;
}

export default function LoginPage({ onBack }: Props) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'owner' | 'manager'>('owner');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
    } else {
      const { error } = await signUp(email, password, fullName, role);
      if (error) setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=1920')`,
          filter: 'blur(2px)',
          transform: 'scale(1.05)',
        }}
      />
      <div className="absolute inset-0 bg-[#0a1f15]/75 backdrop-blur-sm" />

      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
      >
        <ArrowLeft size={16} />
        Back to site
      </button>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="p-8 rounded-2xl border border-white/10 backdrop-blur-xl"
          style={{ background: 'rgba(31, 77, 58, 0.35)' }}>

          <div className="flex flex-col items-center mb-8">
            <div className="w-11 h-11 bg-[#7BAE7F] rounded-xl flex items-center justify-center mb-4">
              <Leaf size={20} className="text-[#1F4D3A]" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>PLANTORA</h1>
            <p className="text-white/50 text-sm">{mode === 'login' ? 'Sign in to your account' : 'Create your account'}</p>
          </div>

          {/* Role selector */}
          <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-xl border border-white/8">
            {(['owner', 'manager'] as const).map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${
                  role === r
                    ? 'bg-[#7BAE7F] text-[#1F4D3A] shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {r === 'owner' ? 'Owner Login' : 'Manager Login'}
              </button>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-white/60 text-xs mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/60 transition-colors"
                  placeholder="Your full name"
                />
              </div>
            )}

            <div>
              <label className="block text-white/60 text-xs mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/60 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/60 transition-colors"
                  placeholder="Your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 accent-[#7BAE7F]"
                  />
                  <span className="text-white/50 text-xs">Remember me</span>
                </label>
                <button type="button" className="text-[#7BAE7F] text-xs hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#7BAE7F] hover:bg-[#8fc494] disabled:opacity-60 text-[#1F4D3A] font-semibold rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-[#7BAE7F]/20 mt-2"
            >
              {loading ? 'Please wait...' : mode === 'login' ? `Sign In as ${role === 'owner' ? 'Owner' : 'Manager'}` : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-white/40 text-xs">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            </span>
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
              className="text-[#7BAE7F] text-xs hover:underline font-medium"
            >
              {mode === 'login' ? 'Create one' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
