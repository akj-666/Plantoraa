import { useState, useEffect } from 'react';
import { Plus, X, DollarSign, Receipt, TrendingDown } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../context/AuthContext';

interface Expense {
  id: string;
  item_name: string;
  category: string;
  quantity: number;
  unit: string;
  amount: number;
  expense_date: string;
  supplier: string;
  payment_method: string;
  notes: string;
}

const categories = ['Labor Payment', 'Fuel / Petrol', 'Motor Oil', 'Machinery', 'Tools', 'Transport', 'Fertilizer', 'Hose / Pipes', 'Miscellaneous'];
const paymentMethods = ['Cash', 'Bank Transfer', 'Cheque', 'Credit Card'];

const categoryColors: Record<string, string> = {
  'Labor Payment': 'text-[#7BAE7F] bg-[#7BAE7F]/10 border-[#7BAE7F]/20',
  'Fuel / Petrol': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  'Motor Oil': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  'Machinery': 'text-sky-400 bg-sky-400/10 border-sky-400/20',
  'Tools': 'text-violet-400 bg-violet-400/10 border-violet-400/20',
  'Transport': 'text-pink-400 bg-pink-400/10 border-pink-400/20',
  'Fertilizer': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  'Hose / Pipes': 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  'Miscellaneous': 'text-white/50 bg-white/5 border-white/10',
};

const getWeekLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
};

export default function ExpensePage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    item_name: '',
    category: 'Miscellaneous',
    quantity: 1,
    unit: 'unit',
    amount: 0,
    expense_date: new Date().toISOString().split('T')[0],
    supplier: '',
    payment_method: 'Cash',
    notes: '',
  });

  useEffect(() => { fetchExpenses(); }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    const { data } = await supabase.from('expenses').select('*').order('expense_date', { ascending: false }).limit(100);
    setExpenses((data || []) as Expense[]);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await supabase.from('expenses').insert({ ...form, owner_id: user.id });
    setShowForm(false);
    setForm({ item_name: '', category: 'Miscellaneous', quantity: 1, unit: 'unit', amount: 0, expense_date: new Date().toISOString().split('T')[0], supplier: '', payment_method: 'Cash', notes: '' });
    fetchExpenses();
  };

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  const grouped: Record<string, Expense[]> = {};
  expenses.forEach(exp => {
    const week = getWeekLabel(exp.expense_date);
    if (!grouped[week]) grouped[week] = [];
    grouped[week].push(exp);
  });

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Expense Tracker</h1>
          <p className="text-white/50 text-sm">Track all plantation expenses with receipt-level detail.</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#7BAE7F] hover:bg-[#8fc494] text-[#1F4D3A] font-semibold rounded-xl text-sm transition-all">
          <Plus size={16} /> Add Expense
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/8 sm:col-span-2">
          <div className="flex items-center gap-3 mb-1">
            <DollarSign size={16} className="text-amber-400" />
            <span className="text-white/50 text-sm">Total Recorded Expenses</span>
          </div>
          <div className="text-3xl font-bold text-amber-400" style={{ fontFamily: 'Poppins, sans-serif' }}>
            RM {totalAmount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/8 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={16} className="text-white/40" />
            <span className="text-white/50 text-xs">Records</span>
          </div>
          <div className="text-2xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>{expenses.length}</div>
          <div className="text-white/30 text-xs">Total entries</div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/8 mb-6">
        <h2 className="text-white font-semibold mb-4 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>By Category</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(
            expenses.reduce((acc, e) => {
              acc[e.category] = (acc[e.category] || 0) + e.amount;
              return acc;
            }, {} as Record<string, number>)
          ).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => (
            <div key={cat} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs ${categoryColors[cat] || 'text-white/50 bg-white/5 border-white/10'}`}>
              <span>{cat}</span>
              <span className="font-semibold">RM {amt.toLocaleString('en-MY', { minimumFractionDigits: 0 })}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly grouped */}
      {loading ? (
        <div className="text-center py-12 text-white/40 text-sm">Loading...</div>
      ) : expenses.length === 0 ? (
        <div className="text-center py-16">
          <Receipt size={40} className="text-white/20 mx-auto mb-3" />
          <p className="text-white/40 text-sm">No expenses recorded yet.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([week, weekExpenses]) => (
          <div key={week} className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#7BAE7F] text-xs font-medium tracking-wider uppercase">Week of {week}</span>
              <span className="text-amber-400 text-xs font-semibold">
                RM {weekExpenses.reduce((s, e) => s + e.amount, 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="space-y-2">
              {weekExpenses.map((exp, i) => (
                <div key={exp.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:border-white/15 ${i % 2 === 0 ? 'bg-white/[0.03] border-white/8' : 'bg-white/[0.015] border-white/5'}`}>
                  <div className="flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded-full border text-xs ${categoryColors[exp.category] || 'text-white/50 bg-white/5 border-white/10'}`}>
                      {exp.category}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white/80 text-sm font-medium">{exp.item_name}</div>
                    <div className="text-white/40 text-xs">
                      {exp.quantity} {exp.unit}{exp.supplier ? ` · ${exp.supplier}` : ''} · {exp.payment_method}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-amber-400 font-semibold text-sm">RM {exp.amount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</div>
                    <div className="text-white/30 text-xs">{new Date(exp.expense_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f2a1e] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>Add Expense</h2>
              <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/60 text-xs mb-1">Item Name</label>
                <input required value={form.item_name} onChange={e => setForm(p => ({ ...p, item_name: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/50"
                  placeholder="e.g. Diesel fuel, Chain saw blade..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 text-xs mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7BAE7F]/50">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Date</label>
                  <input type="date" value={form.expense_date} onChange={e => setForm(p => ({ ...p, expense_date: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7BAE7F]/50" />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Quantity</label>
                  <input type="number" step="0.01" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7BAE7F]/50" />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Unit</label>
                  <input value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/50"
                    placeholder="litre, kg, unit..." />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Amount (RM)</label>
                  <input type="number" step="0.01" required value={form.amount} onChange={e => setForm(p => ({ ...p, amount: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7BAE7F]/50" />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Payment Method</label>
                  <select value={form.payment_method} onChange={e => setForm(p => ({ ...p, payment_method: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7BAE7F]/50">
                    {paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-white/60 text-xs mb-1">Supplier / Vendor</label>
                <input value={form.supplier} onChange={e => setForm(p => ({ ...p, supplier: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/50"
                  placeholder="Supplier name" />
              </div>
              <div>
                <label className="block text-white/60 text-xs mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/50 resize-none"
                  placeholder="Additional notes..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 bg-white/5 border border-white/10 text-white/60 rounded-xl text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#7BAE7F] text-[#1F4D3A] font-semibold rounded-xl text-sm">Save Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
