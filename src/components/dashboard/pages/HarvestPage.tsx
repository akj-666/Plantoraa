import { useState, useEffect } from 'react';
import { Plus, X, BarChart2, TrendingUp } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../context/AuthContext';

interface HarvestLog {
  id: string;
  crop_name: string;
  harvest_quantity: number;
  unit: string;
  harvest_date: string;
  zone: string;
  workers_involved: string;
  quality_grade: string;
  quality_notes: string;
}

const grades = ['A', 'B', 'C', 'D'];
const gradeColors: Record<string, string> = {
  A: 'text-[#7BAE7F] bg-[#7BAE7F]/10 border-[#7BAE7F]/20',
  B: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
  C: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  D: 'text-red-400 bg-red-400/10 border-red-400/20',
};

export default function HarvestPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<HarvestLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    crop_name: '',
    harvest_quantity: 0,
    unit: 'kg',
    harvest_date: new Date().toISOString().split('T')[0],
    zone: '',
    workers_involved: '',
    quality_grade: 'A',
    quality_notes: '',
  });

  useEffect(() => { fetchLogs(); }, []);

  const fetchLogs = async () => {
    setLoading(true);
    const { data } = await supabase.from('harvest_logs').select('*').order('harvest_date', { ascending: false }).limit(100);
    setLogs((data || []) as HarvestLog[]);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await supabase.from('harvest_logs').insert({ ...form, owner_id: user.id, created_by: user.id });
    setShowForm(false);
    setForm({ crop_name: '', harvest_quantity: 0, unit: 'kg', harvest_date: new Date().toISOString().split('T')[0], zone: '', workers_involved: '', quality_grade: 'A', quality_notes: '' });
    fetchLogs();
  };

  const totalYield = logs.reduce((s, l) => s + l.harvest_quantity, 0);
  const thisWeekYield = logs.filter(l => {
    const d = new Date(l.harvest_date);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return d >= weekAgo;
  }).reduce((s, l) => s + l.harvest_quantity, 0);

  const cropTotals = logs.reduce((acc, l) => {
    acc[l.crop_name] = (acc[l.crop_name] || 0) + l.harvest_quantity;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Harvest Logs</h1>
          <p className="text-white/50 text-sm">Track crop yields, quality grades, and zone-level productivity.</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#7BAE7F] hover:bg-[#8fc494] text-[#1F4D3A] font-semibold rounded-xl text-sm transition-all">
          <Plus size={16} /> Log Harvest
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/8">
          <div className="text-white/40 text-xs mb-1">Total Yield Recorded</div>
          <div className="text-2xl font-bold text-[#7BAE7F]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {totalYield.toLocaleString()} kg
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/8">
          <div className="text-white/40 text-xs mb-1">This Week</div>
          <div className="text-2xl font-bold text-emerald-400" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {thisWeekYield.toLocaleString()} kg
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/8">
          <div className="text-white/40 text-xs mb-1">Total Harvests</div>
          <div className="text-2xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>{logs.length}</div>
        </div>
      </div>

      {/* Crop breakdown */}
      {Object.keys(cropTotals).length > 0 && (
        <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/8 mb-6">
          <h2 className="text-white font-semibold mb-4 text-sm flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <TrendingUp size={15} className="text-[#7BAE7F]" />
            Yield by Crop
          </h2>
          <div className="space-y-3">
            {Object.entries(cropTotals).sort((a, b) => b[1] - a[1]).map(([crop, qty]) => {
              const max = Math.max(...Object.values(cropTotals));
              const pct = (qty / max) * 100;
              return (
                <div key={crop}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/70">{crop}</span>
                    <span className="text-[#7BAE7F] font-medium">{qty.toLocaleString()} kg</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#7BAE7F] rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-white/40 text-sm">Loading...</div>
      ) : logs.length === 0 ? (
        <div className="text-center py-16">
          <BarChart2 size={40} className="text-white/20 mx-auto mb-3" />
          <p className="text-white/40 text-sm">No harvest records yet.</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden border border-white/8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/[0.04] border-b border-white/8">
                <th className="text-left px-4 py-3 text-white/50 text-xs font-medium">Crop</th>
                <th className="text-left px-4 py-3 text-white/50 text-xs font-medium">Quantity</th>
                <th className="text-left px-4 py-3 text-white/50 text-xs font-medium">Date</th>
                <th className="text-left px-4 py-3 text-white/50 text-xs font-medium">Zone</th>
                <th className="text-left px-4 py-3 text-white/50 text-xs font-medium">Grade</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={log.id} className={`border-b border-white/5 last:border-0 hover:bg-white/[0.02] ${i % 2 === 0 ? '' : 'bg-white/[0.015]'}`}>
                  <td className="px-4 py-3 text-white/80 text-xs font-medium">{log.crop_name}</td>
                  <td className="px-4 py-3">
                    <span className="text-[#7BAE7F] font-semibold text-xs">{log.harvest_quantity.toLocaleString()} {log.unit}</span>
                  </td>
                  <td className="px-4 py-3 text-white/50 text-xs">
                    {new Date(log.harvest_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 text-white/50 text-xs">{log.zone || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full border text-xs ${gradeColors[log.quality_grade] || 'text-white/50 bg-white/5 border-white/10'}`}>
                      Grade {log.quality_grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f2a1e] border border-white/10 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>Log Harvest</h2>
              <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/60 text-xs mb-1">Crop Name</label>
                <input required value={form.crop_name} onChange={e => setForm(p => ({ ...p, crop_name: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/50"
                  placeholder="e.g. Palm Oil FFB, Rubber..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 text-xs mb-1">Quantity</label>
                  <input type="number" step="0.01" required value={form.harvest_quantity} onChange={e => setForm(p => ({ ...p, harvest_quantity: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7BAE7F]/50" />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Unit</label>
                  <input value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7BAE7F]/50" />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Harvest Date</label>
                  <input type="date" value={form.harvest_date} onChange={e => setForm(p => ({ ...p, harvest_date: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7BAE7F]/50" />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Zone</label>
                  <input value={form.zone} onChange={e => setForm(p => ({ ...p, zone: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/50"
                    placeholder="Zone A, B..." />
                </div>
              </div>
              <div>
                <label className="block text-white/60 text-xs mb-1">Workers Involved</label>
                <input value={form.workers_involved} onChange={e => setForm(p => ({ ...p, workers_involved: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/50"
                  placeholder="Names or team code" />
              </div>
              <div>
                <label className="block text-white/60 text-xs mb-2">Quality Grade</label>
                <div className="flex gap-2">
                  {grades.map(g => (
                    <button key={g} type="button" onClick={() => setForm(p => ({ ...p, quality_grade: g }))}
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${form.quality_grade === g ? gradeColors[g] : 'bg-white/5 border-white/10 text-white/50'}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-white/60 text-xs mb-1">Quality Notes</label>
                <textarea value={form.quality_notes} onChange={e => setForm(p => ({ ...p, quality_notes: e.target.value }))} rows={2}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/50 resize-none"
                  placeholder="Quality observations..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 bg-white/5 border border-white/10 text-white/60 rounded-xl text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#7BAE7F] text-[#1F4D3A] font-semibold rounded-xl text-sm">Save Log</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
