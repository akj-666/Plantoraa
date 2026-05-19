import { useState, useEffect } from 'react';
import { CloudRain, Wind, Droplets, Thermometer, AlertTriangle, Plus, X, Shield } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../context/AuthContext';

interface WeatherObs {
  id: string;
  observation_date: string;
  temperature_celsius: number;
  humidity_percent: number;
  wind_speed_kmh: number;
  rainfall_mm: number;
  condition: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  alert_message: string;
}

const riskConfig = {
  low: { label: 'Low Risk', color: 'text-[#7BAE7F]', bg: 'bg-[#7BAE7F]/10', border: 'border-[#7BAE7F]/20' },
  medium: { label: 'Medium Risk', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
  high: { label: 'High Risk', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
  critical: { label: 'Critical', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
};

const conditions = ['Clear', 'Partly Cloudy', 'Overcast', 'Light Rain', 'Heavy Rain', 'Thunderstorm', 'Foggy', 'Windy'];

export default function WeatherPage() {
  const { user } = useAuth();
  const [records, setRecords] = useState<WeatherObs[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    observation_date: new Date().toISOString().split('T')[0],
    temperature_celsius: 28,
    humidity_percent: 75,
    wind_speed_kmh: 10,
    rainfall_mm: 0,
    condition: 'Clear',
    risk_level: 'low' as const,
    alert_message: '',
  });

  useEffect(() => { fetchRecords(); }, []);

  const fetchRecords = async () => {
    setLoading(true);
    const { data } = await supabase.from('weather_observations').select('*').order('observation_date', { ascending: false }).limit(30);
    setRecords((data || []) as WeatherObs[]);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await supabase.from('weather_observations').insert({ ...form, owner_id: user.id, recorded_by: user.id });
    setShowForm(false);
    fetchRecords();
  };

  const latest = records[0];

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Weather Intelligence</h1>
          <p className="text-white/50 text-sm">Monitor plantation weather conditions and risk alerts.</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#7BAE7F] hover:bg-[#8fc494] text-[#1F4D3A] font-semibold rounded-xl text-sm transition-all">
          <Plus size={16} /> Add Observation
        </button>
      </div>

      {/* Current Conditions */}
      {latest ? (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-900/30 to-[#1F4D3A]/40 border border-sky-500/15 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-white/50 text-xs mb-1">Latest Observation — {new Date(latest.observation_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
              <div className="text-white text-2xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>{latest.condition}</div>
            </div>
            <div className={`px-3 py-1.5 rounded-full border text-xs font-medium ${riskConfig[latest.risk_level].color} ${riskConfig[latest.risk_level].bg} ${riskConfig[latest.risk_level].border}`}>
              {riskConfig[latest.risk_level].label}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Thermometer, label: 'Temperature', value: `${latest.temperature_celsius}°C`, color: 'text-orange-400' },
              { icon: Droplets, label: 'Humidity', value: `${latest.humidity_percent}%`, color: 'text-sky-400' },
              { icon: Wind, label: 'Wind Speed', value: `${latest.wind_speed_kmh} km/h`, color: 'text-white/70' },
              { icon: CloudRain, label: 'Rainfall', value: `${latest.rainfall_mm} mm`, color: 'text-blue-400' },
            ].map(item => (
              <div key={item.label} className="p-3 rounded-xl bg-white/5 border border-white/8">
                <div className="flex items-center gap-2 mb-1">
                  <item.icon size={14} className={item.color} />
                  <span className="text-white/40 text-xs">{item.label}</span>
                </div>
                <div className={`text-lg font-semibold ${item.color}`} style={{ fontFamily: 'Poppins, sans-serif' }}>{item.value}</div>
              </div>
            ))}
          </div>
          {latest.alert_message && (
            <div className="mt-4 flex items-start gap-3 p-3 rounded-xl bg-amber-400/10 border border-amber-400/20">
              <AlertTriangle size={15} className="text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-amber-400 text-xs">{latest.alert_message}</p>
            </div>
          )}
        </div>
      ) : !loading && (
        <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/8 mb-6 text-center">
          <Shield size={32} className="text-white/20 mx-auto mb-2" />
          <p className="text-white/40 text-sm">No weather observations yet. Add your first record.</p>
        </div>
      )}

      {/* History */}
      <h2 className="text-white font-semibold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Observation History</h2>
      {loading ? (
        <div className="text-center py-8 text-white/40 text-sm">Loading...</div>
      ) : (
        <div className="space-y-3">
          {records.slice(1).map(rec => {
            const cfg = riskConfig[rec.risk_level];
            return (
              <div key={rec.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/8 hover:border-white/15 transition-all">
                <div className="flex-shrink-0 text-center w-12">
                  <div className="text-white/60 text-xs font-medium">{new Date(rec.observation_date).toLocaleDateString('en-US', { month: 'short' })}</div>
                  <div className="text-white font-bold text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>{new Date(rec.observation_date).getDate()}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white/80 text-sm font-medium">{rec.condition}</div>
                  <div className="text-white/40 text-xs">{rec.temperature_celsius}°C · {rec.humidity_percent}% humidity · {rec.rainfall_mm}mm rain</div>
                </div>
                <span className={`px-2.5 py-1 rounded-full border text-xs ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f2a1e] border border-white/10 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>Add Weather Observation</h2>
              <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/60 text-xs mb-1">Date</label>
                <input type="date" value={form.observation_date} onChange={e => setForm(p => ({ ...p, observation_date: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7BAE7F]/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 text-xs mb-1">Temperature (°C)</label>
                  <input type="number" value={form.temperature_celsius} onChange={e => setForm(p => ({ ...p, temperature_celsius: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7BAE7F]/50" />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Humidity (%)</label>
                  <input type="number" value={form.humidity_percent} onChange={e => setForm(p => ({ ...p, humidity_percent: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7BAE7F]/50" />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Wind Speed (km/h)</label>
                  <input type="number" value={form.wind_speed_kmh} onChange={e => setForm(p => ({ ...p, wind_speed_kmh: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7BAE7F]/50" />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Rainfall (mm)</label>
                  <input type="number" step="0.1" value={form.rainfall_mm} onChange={e => setForm(p => ({ ...p, rainfall_mm: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7BAE7F]/50" />
                </div>
              </div>
              <div>
                <label className="block text-white/60 text-xs mb-1">Condition</label>
                <select value={form.condition} onChange={e => setForm(p => ({ ...p, condition: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7BAE7F]/50">
                  {conditions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-white/60 text-xs mb-2">Risk Level</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(riskConfig).map(([key, cfg]) => (
                    <button key={key} type="button" onClick={() => setForm(p => ({ ...p, risk_level: key as typeof form.risk_level }))}
                      className={`px-3 py-2 rounded-xl border text-xs font-medium capitalize transition-all ${
                        form.risk_level === key ? `${cfg.bg} ${cfg.border} ${cfg.color}` : 'bg-white/5 border-white/10 text-white/50'
                      }`}>
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-white/60 text-xs mb-1">Alert Message (optional)</label>
                <textarea value={form.alert_message} onChange={e => setForm(p => ({ ...p, alert_message: e.target.value }))} rows={2}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/50 resize-none"
                  placeholder="Any risk alerts or observations..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 bg-white/5 border border-white/10 text-white/60 rounded-xl text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#7BAE7F] text-[#1F4D3A] font-semibold rounded-xl text-sm">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
