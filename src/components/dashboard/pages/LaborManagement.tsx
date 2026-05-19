import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Clock, User, ChevronDown, X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../context/AuthContext';

interface LaborLog {
  id: string;
  worker_name: string;
  work_type: string;
  log_date: string;
  start_time: string | null;
  end_time: string | null;
  total_hours: number;
  supervisor_name: string;
  zone: string;
  notes: string;
}

const workTypes = ['Harvesting', 'Spraying', 'Pruning', 'Weeding', 'Transportation', 'Maintenance', 'Inspection', 'Other'];

export default function LaborManagement() {
  const { user, profile } = useAuth();
  const [logs, setLogs] = useState<LaborLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [form, setForm] = useState({
    worker_name: '',
    work_type: 'Harvesting',
    log_date: new Date().toISOString().split('T')[0],
    start_time: '07:00',
    end_time: '16:00',
    total_hours: 8,
    supervisor_name: '',
    zone: '',
    notes: '',
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('labor_logs')
      .select('*')
      .order('log_date', { ascending: false })
      .limit(100);
    setLogs((data || []) as LaborLog[]);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    await supabase.from('labor_logs').insert({
      ...form,
      owner_id: user.id,
      created_by: user.id,
    });
    setShowForm(false);
    setForm({ worker_name: '', work_type: 'Harvesting', log_date: new Date().toISOString().split('T')[0], start_time: '07:00', end_time: '16:00', total_hours: 8, supervisor_name: '', zone: '', notes: '' });
    fetchLogs();
  };

  const filtered = logs.filter(l =>
    (l.worker_name.toLowerCase().includes(search.toLowerCase()) || !search) &&
    (l.work_type === filterType || !filterType)
  );

  const groupByWeek = (logs: LaborLog[]) => {
    const groups: Record<string, LaborLog[]> = {};
    logs.forEach(log => {
      const d = new Date(log.log_date);
      const week = getWeekLabel(d);
      if (!groups[week]) groups[week] = [];
      groups[week].push(log);
    });
    return groups;
  };

  const getWeekLabel = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const grouped = groupByWeek(filtered);

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Labor Management</h1>
          <p className="text-white/50 text-sm">Track daily work logs, hours, and activities across your plantation.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#7BAE7F] hover:bg-[#8fc494] text-[#1F4D3A] font-semibold rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-[#7BAE7F]/20"
        >
          <Plus size={16} />
          Add Log
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search worker name..."
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/50"
          />
        </div>
        <div className="relative">
          <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="pl-9 pr-8 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7BAE7F]/50 appearance-none"
          >
            <option value="">All Work Types</option>
            {workTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white text-sm transition-colors">
          <Download size={14} />
          Export
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-white/40">Loading records...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-white/20 text-5xl mb-4"><User size={48} className="mx-auto" /></div>
          <p className="text-white/40 text-sm">No labor logs found. Add your first record.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([week, weekLogs]) => (
          <div key={week} className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[#7BAE7F] text-xs font-medium tracking-wider uppercase">Week of {week}</span>
              <span className="text-white/30 text-xs">{weekLogs.length} records</span>
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/[0.04] border-b border-white/8">
                    <th className="text-left px-4 py-3 text-white/50 text-xs font-medium">Worker</th>
                    <th className="text-left px-4 py-3 text-white/50 text-xs font-medium">Work Type</th>
                    <th className="text-left px-4 py-3 text-white/50 text-xs font-medium">Date</th>
                    <th className="text-left px-4 py-3 text-white/50 text-xs font-medium">Hours</th>
                    <th className="text-left px-4 py-3 text-white/50 text-xs font-medium">Zone</th>
                    <th className="text-left px-4 py-3 text-white/50 text-xs font-medium">Supervisor</th>
                  </tr>
                </thead>
                <tbody>
                  {weekLogs.map((log, i) => (
                    <tr key={log.id} className={`border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.015]'}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#7BAE7F]/20 flex items-center justify-center">
                            <span className="text-[#7BAE7F] text-xs font-semibold">{log.worker_name.charAt(0)}</span>
                          </div>
                          <span className="text-white/80 text-xs">{log.worker_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full bg-[#7BAE7F]/10 text-[#7BAE7F] text-xs border border-[#7BAE7F]/15">
                          {log.work_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white/60 text-xs">
                        {new Date(log.log_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-white/60 text-xs">
                          <Clock size={12} />
                          {log.total_hours}h
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white/50 text-xs">{log.zone || '—'}</td>
                      <td className="px-4 py-3 text-white/50 text-xs">{log.supervisor_name || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}

      {/* Add Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f2a1e] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-semibold text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>Add Labor Log</h2>
              <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-white/60 text-xs mb-1">Worker Name</label>
                  <input required value={form.worker_name} onChange={e => setForm(p => ({ ...p, worker_name: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/50"
                    placeholder="Full name" />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Work Type</label>
                  <select value={form.work_type} onChange={e => setForm(p => ({ ...p, work_type: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7BAE7F]/50">
                    {workTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Date</label>
                  <input type="date" value={form.log_date} onChange={e => setForm(p => ({ ...p, log_date: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7BAE7F]/50" />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Start Time</label>
                  <input type="time" value={form.start_time} onChange={e => setForm(p => ({ ...p, start_time: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7BAE7F]/50" />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">End Time</label>
                  <input type="time" value={form.end_time} onChange={e => setForm(p => ({ ...p, end_time: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7BAE7F]/50" />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Total Hours</label>
                  <input type="number" step="0.5" value={form.total_hours} onChange={e => setForm(p => ({ ...p, total_hours: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7BAE7F]/50" />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Zone</label>
                  <input value={form.zone} onChange={e => setForm(p => ({ ...p, zone: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/50"
                    placeholder="e.g. Zone A" />
                </div>
                <div className="col-span-2">
                  <label className="block text-white/60 text-xs mb-1">Supervisor Name</label>
                  <input value={form.supervisor_name} onChange={e => setForm(p => ({ ...p, supervisor_name: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/50"
                    placeholder="Supervisor name" />
                </div>
                <div className="col-span-2">
                  <label className="block text-white/60 text-xs mb-1">Notes</label>
                  <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/50 resize-none"
                    placeholder="Daily notes..." />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 bg-white/5 border border-white/10 text-white/60 rounded-xl text-sm hover:text-white transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 bg-[#7BAE7F] hover:bg-[#8fc494] text-[#1F4D3A] font-semibold rounded-xl text-sm transition-all">
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
