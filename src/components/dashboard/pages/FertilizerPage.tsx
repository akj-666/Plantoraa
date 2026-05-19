import { useState, useEffect } from 'react';
import { Plus, X, Sprout, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../context/AuthContext';

interface FertilizerSchedule {
  id: string;
  fertilizer_name: string;
  quantity_kg: number;
  mixing_ratio: string;
  scheduled_date: string;
  completed_date: string | null;
  zone: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  notes: string;
}

const statusConfig = {
  pending: { label: 'Pending', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', icon: Clock },
  'in-progress': { label: 'In Progress', color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/20', icon: AlertCircle },
  completed: { label: 'Completed', color: 'text-[#7BAE7F]', bg: 'bg-[#7BAE7F]/10', border: 'border-[#7BAE7F]/20', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', icon: X },
};

export default function FertilizerPage() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<FertilizerSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    fertilizer_name: '',
    quantity_kg: 0,
    mixing_ratio: '',
    scheduled_date: new Date().toISOString().split('T')[0],
    zone: '',
    status: 'pending' as const,
    notes: '',
  });

  useEffect(() => { fetchSchedules(); }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    const { data } = await supabase.from('fertilizer_schedules').select('*').order('scheduled_date', { ascending: true });
    setSchedules((data || []) as FertilizerSchedule[]);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await supabase.from('fertilizer_schedules').insert({ ...form, owner_id: user.id, created_by: user.id });
    setShowForm(false);
    setForm({ fertilizer_name: '', quantity_kg: 0, mixing_ratio: '', scheduled_date: new Date().toISOString().split('T')[0], zone: '', status: 'pending', notes: '' });
    fetchSchedules();
  };

  const updateStatus = async (id: string, status: FertilizerSchedule['status']) => {
    await supabase.from('fertilizer_schedules').update({
      status,
      ...(status === 'completed' ? { completed_date: new Date().toISOString().split('T')[0] } : {}),
    }).eq('id', id);
    fetchSchedules();
  };

  const upcoming = schedules.filter(s => s.status !== 'completed' && s.status !== 'cancelled');
  const completed = schedules.filter(s => s.status === 'completed' || s.status === 'cancelled');

  const isOverdue = (date: string, status: string) => {
    return status === 'pending' && new Date(date) < new Date();
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Fertilizer Schedule</h1>
          <p className="text-white/50 text-sm">Plan fertilizer rounds, track applications, and set zone reminders.</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#7BAE7F] hover:bg-[#8fc494] text-[#1F4D3A] font-semibold rounded-xl text-sm transition-all">
          <Plus size={16} /> Schedule Round
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Upcoming', value: upcoming.filter(s => s.status === 'pending').length, color: 'text-amber-400' },
          { label: 'In Progress', value: upcoming.filter(s => s.status === 'in-progress').length, color: 'text-sky-400' },
          { label: 'Completed', value: completed.filter(s => s.status === 'completed').length, color: 'text-[#7BAE7F]' },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-2xl bg-white/[0.04] border border-white/8">
            <div className={`text-2xl font-bold ${s.color} mb-0.5`} style={{ fontFamily: 'Poppins, sans-serif' }}>{s.value}</div>
            <div className="text-white/50 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-white/40 text-sm">Loading schedules...</div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="mb-8">
              <h2 className="text-white font-semibold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Active & Upcoming</h2>
              <div className="space-y-3">
                {upcoming.map(s => {
                  const cfg = statusConfig[s.status];
                  const overdue = isOverdue(s.scheduled_date, s.status);
                  return (
                    <div key={s.id} className={`p-5 rounded-2xl border transition-all ${overdue ? 'bg-red-400/5 border-red-400/15' : 'bg-white/[0.04] border-white/8 hover:border-white/15'}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                            <Sprout size={16} className="text-emerald-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-white font-semibold text-sm">{s.fertilizer_name}</span>
                              {overdue && <span className="text-red-400 text-xs">Overdue</span>}
                            </div>
                            <div className="text-white/50 text-xs">
                              {s.zone && `${s.zone} · `}{s.quantity_kg} kg{s.mixing_ratio && ` · Ratio: ${s.mixing_ratio}`}
                            </div>
                            {s.notes && <div className="text-white/40 text-xs mt-1">{s.notes}</div>}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <span className={`px-2.5 py-1 rounded-full border text-xs ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                            {cfg.label}
                          </span>
                          <div className="text-white/40 text-xs">
                            {new Date(s.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        {s.status === 'pending' && (
                          <button onClick={() => updateStatus(s.id, 'in-progress')}
                            className="px-3 py-1.5 bg-sky-400/10 border border-sky-400/20 text-sky-400 text-xs rounded-lg hover:bg-sky-400/20 transition-colors">
                            Start
                          </button>
                        )}
                        {s.status !== 'completed' && (
                          <button onClick={() => updateStatus(s.id, 'completed')}
                            className="px-3 py-1.5 bg-[#7BAE7F]/10 border border-[#7BAE7F]/20 text-[#7BAE7F] text-xs rounded-lg hover:bg-[#7BAE7F]/20 transition-colors">
                            Mark Complete
                          </button>
                        )}
                        <button onClick={() => updateStatus(s.id, 'cancelled')}
                          className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/40 text-xs rounded-lg hover:text-white hover:bg-white/10 transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {completed.length > 0 && (
            <div>
              <h2 className="text-white/50 font-semibold mb-4 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>Completed / Cancelled</h2>
              <div className="space-y-2">
                {completed.map(s => {
                  const cfg = statusConfig[s.status];
                  return (
                    <div key={s.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 opacity-60">
                      <cfg.icon size={15} className={cfg.color} />
                      <div className="flex-1 min-w-0">
                        <span className="text-white/70 text-sm">{s.fertilizer_name}</span>
                        {s.zone && <span className="text-white/40 text-xs ml-2">· {s.zone}</span>}
                      </div>
                      <span className={`text-xs ${cfg.color}`}>{cfg.label}</span>
                      <span className="text-white/30 text-xs">{new Date(s.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {schedules.length === 0 && (
            <div className="text-center py-16">
              <Sprout size={40} className="text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-sm">No fertilizer schedules yet. Create your first round.</p>
            </div>
          )}
        </>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f2a1e] border border-white/10 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>Schedule Fertilizer Round</h2>
              <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/60 text-xs mb-1">Fertilizer Name</label>
                <input required value={form.fertilizer_name} onChange={e => setForm(p => ({ ...p, fertilizer_name: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/50"
                  placeholder="e.g. NPK 15-15-15, Urea, Borate" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 text-xs mb-1">Quantity (kg)</label>
                  <input type="number" step="0.1" value={form.quantity_kg} onChange={e => setForm(p => ({ ...p, quantity_kg: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7BAE7F]/50" />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Mixing Ratio</label>
                  <input value={form.mixing_ratio} onChange={e => setForm(p => ({ ...p, mixing_ratio: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/50"
                    placeholder="e.g. 1:2:1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 text-xs mb-1">Scheduled Date</label>
                  <input type="date" value={form.scheduled_date} onChange={e => setForm(p => ({ ...p, scheduled_date: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7BAE7F]/50" />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Zone</label>
                  <input value={form.zone} onChange={e => setForm(p => ({ ...p, zone: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/50"
                    placeholder="Zone A, B, C..." />
                </div>
              </div>
              <div>
                <label className="block text-white/60 text-xs mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/50 resize-none"
                  placeholder="Special instructions, reminders..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 bg-white/5 border border-white/10 text-white/60 rounded-xl text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#7BAE7F] text-[#1F4D3A] font-semibold rounded-xl text-sm">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
