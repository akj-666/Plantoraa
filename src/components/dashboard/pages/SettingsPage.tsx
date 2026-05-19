import { useState } from 'react';
import { User, Bell, Shield, Download, Save } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabase';

export default function SettingsPage() {
  const { profile, user } = useAuth();
  const [plantationName, setPlantationName] = useState(profile?.plantation_name || '');
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from('profiles').update({
      full_name: fullName,
      plantation_name: plantationName,
      updated_at: new Date().toISOString(),
    }).eq('id', user.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const sections = [
    {
      icon: User,
      title: 'Account Profile',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-white/60 text-xs mb-1">Full Name</label>
            <input
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/50"
            />
          </div>
          <div>
            <label className="block text-white/60 text-xs mb-1">Email Address</label>
            <input
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2.5 bg-white/3 border border-white/5 rounded-xl text-white/40 text-sm cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-white/60 text-xs mb-1">Plantation Name</label>
            <input
              value={plantationName}
              onChange={e => setPlantationName(e.target.value)}
              placeholder="Your plantation name"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7BAE7F]/50"
            />
          </div>
          <div>
            <label className="block text-white/60 text-xs mb-1">Role</label>
            <div className="px-4 py-2.5 bg-white/3 border border-white/5 rounded-xl text-white/40 text-sm capitalize">
              {profile?.role || 'manager'}
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: Bell,
      title: 'Notification Preferences',
      content: (
        <div className="space-y-3">
          {[
            { label: 'Weather risk alerts', desc: 'Get notified when risk level is high or critical' },
            { label: 'Fertilizer reminders', desc: 'Reminder 3 days before scheduled application' },
            { label: 'Attendance summary', desc: 'Daily attendance report at end of day' },
            { label: 'Weekly expense digest', desc: 'Weekly summary of all expenses' },
          ].map(item => (
            <div key={item.label} className="flex items-start justify-between py-3 border-b border-white/5 last:border-0">
              <div>
                <div className="text-white/80 text-sm">{item.label}</div>
                <div className="text-white/40 text-xs mt-0.5">{item.desc}</div>
              </div>
              <label className="relative inline-flex cursor-pointer mt-0.5">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#7BAE7F] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
              </label>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: Shield,
      title: 'Manager Permissions',
      content: (
        <div className="space-y-3">
          <p className="text-white/50 text-xs mb-4">
            Manager accounts have the following access permissions. Owner settings are required to modify access levels.
          </p>
          {[
            { label: 'Mark worker attendance', allowed: true },
            { label: 'Add labor logs', allowed: true },
            { label: 'Add weather observations', allowed: true },
            { label: 'Add fertilizer records', allowed: true },
            { label: 'View expense tracker', allowed: false },
            { label: 'View buyer/seller records', allowed: false },
            { label: 'Access financial reports', allowed: false },
            { label: 'Modify system settings', allowed: false },
          ].map(p => (
            <div key={p.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <span className="text-white/70 text-sm">{p.label}</span>
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${
                p.allowed
                  ? 'text-[#7BAE7F] bg-[#7BAE7F]/10 border-[#7BAE7F]/20'
                  : 'text-red-400/80 bg-red-400/10 border-red-400/15'
              }`}>
                {p.allowed ? 'Allowed' : 'Restricted'}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: Download,
      title: 'Data & Backup',
      content: (
        <div className="space-y-3">
          <p className="text-white/50 text-xs mb-4">Export your plantation data for backup or external analysis.</p>
          {[
            { label: 'Export Labor Logs', format: 'CSV / Excel' },
            { label: 'Export Attendance Records', format: 'CSV / Excel' },
            { label: 'Export Expense Data', format: 'CSV / Excel' },
            { label: 'Full Data Backup', format: 'JSON Archive' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
              <div>
                <div className="text-white/70 text-sm">{item.label}</div>
                <div className="text-white/30 text-xs">{item.format}</div>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 text-white/60 hover:text-white text-xs rounded-lg transition-colors">
                <Download size={12} />
                Export
              </button>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Settings</h1>
          <p className="text-white/50 text-sm">Manage your account, permissions, and platform preferences.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#7BAE7F] hover:bg-[#8fc494] disabled:opacity-60 text-[#1F4D3A] font-semibold rounded-xl text-sm transition-all"
        >
          <Save size={15} />
          {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        {sections.map((section, i) => (
          <div key={i} className="p-6 rounded-2xl bg-white/[0.04] border border-white/8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl bg-[#7BAE7F]/15 flex items-center justify-center">
                <section.icon size={16} className="text-[#7BAE7F]" />
              </div>
              <h2 className="text-white font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>{section.title}</h2>
            </div>
            {section.content}
          </div>
        ))}
      </div>
    </div>
  );
}
