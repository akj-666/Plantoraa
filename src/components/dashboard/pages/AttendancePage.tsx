import { useState, useEffect } from 'react';
import { Plus, CheckCircle, XCircle, Clock, Minus, X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../context/AuthContext';

interface AttendanceRecord {
  id: string;
  worker_name: string;
  attendance_date: string;
  status: 'present' | 'absent' | 'half-day' | 'overtime';
  overtime_hours: number;
  notes: string;
}

const statusConfig = {
  present: { label: 'Present', color: 'text-[#7BAE7F]', bg: 'bg-[#7BAE7F]/10', border: 'border-[#7BAE7F]/20', icon: CheckCircle },
  absent: { label: 'Absent', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', icon: XCircle },
  'half-day': { label: 'Half Day', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', icon: Minus },
  overtime: { label: 'Overtime', color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/20', icon: Clock },
};

export default function AttendancePage() {
  const { user } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [form, setForm] = useState({ worker_name: '', attendance_date: new Date().toISOString().split('T')[0], status: 'present' as const, overtime_hours: 0, notes: '' });

  useEffect(() => { fetchRecords(); }, []);

  const fetchRecords = async () => {
    setLoading(true);
    const { data } = await supabase.from('attendance').select('*').order('attendance_date', { ascending: false }).limit(200);
    setRecords((data || []) as AttendanceRecord[]);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await supabase.from('attendance').upsert({
      ...form,
      owner_id: user.id,
      marked_by: user.id,
    }, { onConflict: 'worker_id,attendance_date' });
    setShowForm(false);
    fetchRecords();
  };

  const dayRecords = records.filter(r => r.attendance_date === selectedDate);
  const presentCount = dayRecords.filter(r => r.status === 'present' || r.status === 'overtime').length;
  const absentCount = dayRecords.filter(r => r.status === 'absent').length;
  const halfDayCount = dayRecords.filter(r => r.status === 'half-day').length;

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Worker Attendance</h1>
          <p className="text-white/50 text-sm">Mark and track daily attendance across all workers.</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#7BAE7F] hover:bg-[#8fc494] text-[#1F4D3A] font-semibold rounded-xl text-sm transition-all">
          <Plus size={16} />
          Mark Attendance
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Present', value: presentCount, color: 'text-[#7BAE7F]', bg: 'bg-[#7BAE7F]/10' },
          { label: 'Absent', value: absentCount, color: 'text-red-400', bg: 'bg-red-400/10' },
          { label: 'Half Day', value: halfDayCount, color: 'text-amber-400', bg: 'bg-amber-400/10' },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-2xl bg-white/[0.04] border border-white/8">
            <div className={`text-2xl font-bold ${s.color} mb-0.5`} style={{ fontFamily: 'Poppins, sans-serif' }}>{s.value}</div>
            <div className="text-white/50 text-xs">{s.label} today</div>
          </div>
        ))}
      </div>

      {/* 7-day heatmap */}
      <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/8 mb-6">
        <h2 className="text-white font-semibold mb-4 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>Last 7 Days</h2>
        <div className="flex gap-2">
          {last7Days.map(day => {
            const dayRecs = records.filter(r => r.attendance_date === day);
            const rate = dayRecs.length > 0 ? dayRecs.filter(r => r.status !== 'absent').length / dayRecs.length : 0;
            const opacity = dayRecs.length === 0 ? 0.1 : 0.15 + rate * 0.85;
            return (
              <button
                key={day}
                onClick={() => setSelectedDate(day)}
                className={`flex-1 aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 border transition-all ${
                  selectedDate === day ? 'border-[#7BAE7F]/60 ring-1 ring-[#7BAE7F]/30' : 'border-transparent'
                }`}
                style={{ backgroundColor: `rgba(123, 174, 127, ${opacity})` }}
              >
                <span className="text-white/80 text-xs font-medium">
                  {new Date(day + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
                </span>
                <span className="text-white/50 text-xs">
                  {new Date(day + 'T00:00:00').getDate()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date picker */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-white/50 text-sm">Viewing:</span>
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#7BAE7F]/50"
        />
        <span className="text-white/30 text-sm">{dayRecords.length} records</span>
      </div>

      {/* Records Table */}
      {loading ? (
        <div className="text-center py-12 text-white/40">Loading...</div>
      ) : dayRecords.length === 0 ? (
        <div className="text-center py-16 text-white/30 text-sm">No attendance records for this date.</div>
      ) : (
        <div className="rounded-2xl overflow-hidden border border-white/8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/[0.04] border-b border-white/8">
                <th className="text-left px-4 py-3 text-white/50 text-xs font-medium">Worker</th>
                <th className="text-left px-4 py-3 text-white/50 text-xs font-medium">Status</th>
                <th className="text-left px-4 py-3 text-white/50 text-xs font-medium">Overtime Hrs</th>
                <th className="text-left px-4 py-3 text-white/50 text-xs font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {dayRecords.map((rec, i) => {
                const cfg = statusConfig[rec.status];
                return (
                  <tr key={rec.id} className={`border-b border-white/5 last:border-0 ${i % 2 === 0 ? '' : 'bg-white/[0.015]'}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#7BAE7F]/20 flex items-center justify-center">
                          <span className="text-[#7BAE7F] text-xs">{rec.worker_name.charAt(0)}</span>
                        </div>
                        <span className="text-white/80 text-xs">{rec.worker_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                        <cfg.icon size={11} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/50 text-xs">
                      {rec.overtime_hours > 0 ? `${rec.overtime_hours}h` : '—'}
                    </td>
                    <td className="px-4 py-3 text-white/50 text-xs">{rec.notes || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f2a1e] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>Mark Attendance</h2>
              <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/60 text-xs mb-1">Worker Name</label>
                <input required value={form.worker_name} onChange={e => setForm(p => ({ ...p, worker_name: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/50"
                  placeholder="Worker full name" />
              </div>
              <div>
                <label className="block text-white/60 text-xs mb-1">Date</label>
                <input type="date" value={form.attendance_date} onChange={e => setForm(p => ({ ...p, attendance_date: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7BAE7F]/50" />
              </div>
              <div>
                <label className="block text-white/60 text-xs mb-2">Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(statusConfig).map(([key, cfg]) => (
                    <button key={key} type="button" onClick={() => setForm(p => ({ ...p, status: key as typeof form.status }))}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                        form.status === key ? `${cfg.bg} ${cfg.border} ${cfg.color}` : 'bg-white/5 border-white/10 text-white/50'
                      }`}>
                      <cfg.icon size={13} />
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>
              {form.status === 'overtime' && (
                <div>
                  <label className="block text-white/60 text-xs mb-1">Overtime Hours</label>
                  <input type="number" step="0.5" value={form.overtime_hours} onChange={e => setForm(p => ({ ...p, overtime_hours: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7BAE7F]/50" />
                </div>
              )}
              <div>
                <label className="block text-white/60 text-xs mb-1">Notes</label>
                <input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/50"
                  placeholder="Optional notes" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 bg-white/5 border border-white/10 text-white/60 rounded-xl text-sm">Cancel</button>
                <button type="submit"
                  className="flex-1 py-2.5 bg-[#7BAE7F] hover:bg-[#8fc494] text-[#1F4D3A] font-semibold rounded-xl text-sm">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
