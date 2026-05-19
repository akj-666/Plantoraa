import { useState, useEffect } from 'react';
import { Plus, X, ShoppingBag, TrendingUp, DollarSign } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../context/AuthContext';

interface BuyerRecord {
  id: string;
  buyer_name: string;
  crop_type: string;
  quantity_sold: number;
  unit: string;
  sale_amount: number;
  sale_date: string;
  location: string;
  transport_cost: number;
  final_profit: number;
  payment_status: 'paid' | 'pending' | 'partial';
  notes: string;
}

const statusConfig = {
  paid: { label: 'Paid', color: 'text-[#7BAE7F]', bg: 'bg-[#7BAE7F]/10', border: 'border-[#7BAE7F]/20' },
  pending: { label: 'Pending', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
  partial: { label: 'Partial', color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/20' },
};

export default function BuyerSellerPage() {
  const { user } = useAuth();
  const [records, setRecords] = useState<BuyerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    buyer_name: '',
    crop_type: '',
    quantity_sold: 0,
    unit: 'kg',
    sale_amount: 0,
    sale_date: new Date().toISOString().split('T')[0],
    location: '',
    transport_cost: 0,
    final_profit: 0,
    payment_status: 'paid' as const,
    notes: '',
  });

  useEffect(() => { fetchRecords(); }, []);

  const fetchRecords = async () => {
    setLoading(true);
    const { data } = await supabase.from('buyer_seller_records').select('*').order('sale_date', { ascending: false }).limit(100);
    setRecords((data || []) as BuyerRecord[]);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const profit = form.sale_amount - form.transport_cost;
    await supabase.from('buyer_seller_records').insert({ ...form, final_profit: profit, owner_id: user.id });
    setShowForm(false);
    setForm({ buyer_name: '', crop_type: '', quantity_sold: 0, unit: 'kg', sale_amount: 0, sale_date: new Date().toISOString().split('T')[0], location: '', transport_cost: 0, final_profit: 0, payment_status: 'paid', notes: '' });
    fetchRecords();
  };

  const totalRevenue = records.reduce((s, r) => s + r.sale_amount, 0);
  const totalProfit = records.reduce((s, r) => s + r.final_profit, 0);
  const totalQty = records.reduce((s, r) => s + r.quantity_sold, 0);

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Buyer / Seller Records</h1>
          <p className="text-white/50 text-sm">Track all crop sales, buyer details, and profit calculations.</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#7BAE7F] hover:bg-[#8fc494] text-[#1F4D3A] font-semibold rounded-xl text-sm transition-all">
          <Plus size={16} /> Add Transaction
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Revenue', value: `RM ${totalRevenue.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`, color: 'text-amber-400', icon: DollarSign },
          { label: 'Total Profit', value: `RM ${totalProfit.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`, color: 'text-[#7BAE7F]', icon: TrendingUp },
          { label: 'Total Sold', value: `${totalQty.toLocaleString()} kg`, color: 'text-sky-400', icon: ShoppingBag },
        ].map(s => (
          <div key={s.label} className="p-5 rounded-2xl bg-white/[0.04] border border-white/8">
            <div className="flex items-center gap-2 mb-1">
              <s.icon size={14} className={s.color} />
              <span className="text-white/40 text-xs">{s.label}</span>
            </div>
            <div className={`text-xl font-bold ${s.color}`} style={{ fontFamily: 'Poppins, sans-serif' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-white/40 text-sm">Loading...</div>
      ) : records.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag size={40} className="text-white/20 mx-auto mb-3" />
          <p className="text-white/40 text-sm">No buyer/seller records yet.</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden border border-white/8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/[0.04] border-b border-white/8">
                <th className="text-left px-4 py-3 text-white/50 text-xs font-medium">Buyer</th>
                <th className="text-left px-4 py-3 text-white/50 text-xs font-medium">Crop</th>
                <th className="text-left px-4 py-3 text-white/50 text-xs font-medium">Qty Sold</th>
                <th className="text-left px-4 py-3 text-white/50 text-xs font-medium">Sale Amount</th>
                <th className="text-left px-4 py-3 text-white/50 text-xs font-medium">Net Profit</th>
                <th className="text-left px-4 py-3 text-white/50 text-xs font-medium">Date</th>
                <th className="text-left px-4 py-3 text-white/50 text-xs font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec, i) => {
                const cfg = statusConfig[rec.payment_status];
                return (
                  <tr key={rec.id} className={`border-b border-white/5 last:border-0 hover:bg-white/[0.02] ${i % 2 === 0 ? '' : 'bg-white/[0.015]'}`}>
                    <td className="px-4 py-3">
                      <div className="text-white/80 text-xs font-medium">{rec.buyer_name}</div>
                      {rec.location && <div className="text-white/40 text-xs">{rec.location}</div>}
                    </td>
                    <td className="px-4 py-3 text-white/60 text-xs">{rec.crop_type}</td>
                    <td className="px-4 py-3 text-white/60 text-xs">{rec.quantity_sold.toLocaleString()} {rec.unit}</td>
                    <td className="px-4 py-3 text-amber-400 font-semibold text-xs">RM {rec.sale_amount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-[#7BAE7F] font-semibold text-xs">RM {rec.final_profit.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-white/50 text-xs">{new Date(rec.sale_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full border text-xs ${cfg.color} ${cfg.bg} ${cfg.border}`}>{cfg.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f2a1e] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>Add Transaction</h2>
              <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-white/60 text-xs mb-1">Buyer Name</label>
                  <input required value={form.buyer_name} onChange={e => setForm(p => ({ ...p, buyer_name: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/50"
                    placeholder="Buyer / company name" />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Crop Type</label>
                  <input required value={form.crop_type} onChange={e => setForm(p => ({ ...p, crop_type: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/50"
                    placeholder="Palm Oil, Rubber..." />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Sale Date</label>
                  <input type="date" value={form.sale_date} onChange={e => setForm(p => ({ ...p, sale_date: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7BAE7F]/50" />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Quantity Sold</label>
                  <input type="number" step="0.01" value={form.quantity_sold} onChange={e => setForm(p => ({ ...p, quantity_sold: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7BAE7F]/50" />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Unit</label>
                  <input value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7BAE7F]/50" />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Sale Amount (RM)</label>
                  <input type="number" step="0.01" required value={form.sale_amount} onChange={e => setForm(p => ({ ...p, sale_amount: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7BAE7F]/50" />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Transport Cost (RM)</label>
                  <input type="number" step="0.01" value={form.transport_cost} onChange={e => setForm(p => ({ ...p, transport_cost: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7BAE7F]/50" />
                </div>
                <div className="col-span-2">
                  <label className="block text-white/60 text-xs mb-1">Location Sold</label>
                  <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/50"
                    placeholder="City, mill name..." />
                </div>
              </div>
              <div>
                <label className="block text-white/60 text-xs mb-2">Payment Status</label>
                <div className="flex gap-2">
                  {Object.entries(statusConfig).map(([key, cfg]) => (
                    <button key={key} type="button" onClick={() => setForm(p => ({ ...p, payment_status: key as typeof form.payment_status }))}
                      className={`flex-1 py-2 rounded-xl border text-xs font-medium transition-all ${form.payment_status === key ? `${cfg.bg} ${cfg.border} ${cfg.color}` : 'bg-white/5 border-white/10 text-white/50'}`}>
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-white/60 text-xs mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/50 resize-none" />
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
