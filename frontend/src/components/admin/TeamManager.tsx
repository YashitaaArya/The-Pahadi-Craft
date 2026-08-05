import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Trash2, Shield, Mail } from 'lucide-react';
import { useAdminAuthStore } from '../../store/adminAuthStore';
import {
  getAdminTeam,
  createAdminTeamMember,
  deleteAdminTeamMember,
} from '../../api/adminApi';
import { DashboardLoadingSkeleton, showSuccess, showError, ConfirmationDialog } from './common';

interface TeamMember {
  id: string;
  email: string;
  name: string;
  adminRole: 'developer' | 'owner' | 'sales';
  lastLogin?: string;
}

const ROLE_DESCRIPTIONS: Record<string, string> = {
  developer: 'Full access to everything, including managing admin logins.',
  owner: 'Everything except managing other admin logins - products, orders, customers, analytics, content.',
  sales: 'Products and orders only - no analytics, customer directory, or settings.',
};

const TeamManager: React.FC = () => {
  const { adminUser } = useAdminAuthStore();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    adminRole: 'sales' as 'developer' | 'owner' | 'sales',
  });

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAdminTeam();
      setTeam(data);
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Failed to load admin team');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createAdminTeamMember(form);
      showSuccess(`Created login for ${form.email}`);
      setForm({ email: '', password: '', name: '', adminRole: 'sales' });
      setShowForm(false);
      load();
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Failed to create admin login');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAdminTeamMember(deleteId);
      showSuccess('Admin login removed');
      setDeleteId(null);
      load();
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Failed to remove admin login');
    }
  };

  if (loading) return <DashboardLoadingSkeleton />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif text-[#5A4232]">Admin Logins</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-[#5A4232] text-white rounded-lg text-sm hover:bg-[#4a3628] transition-colors"
        >
          <UserPlus size={16} />
          New Admin Login
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={handleCreate}
          className="bg-white rounded-lg shadow-sm p-6 mb-6 grid gap-4 md:grid-cols-2"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              required
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              required
              type="email"
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              required
              type="text"
              minLength={6}
              className="input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Share this with them separately, not over email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              className="input"
              value={form.adminRole}
              onChange={(e) => setForm({ ...form, adminRole: e.target.value as any })}
            >
              <option value="sales">Sales (products + orders only)</option>
              <option value="owner">Owner (everything except managing logins)</option>
              <option value="developer">Developer (full access)</option>
            </select>
          </div>
          <p className="md:col-span-2 text-xs text-gray-500">{ROLE_DESCRIPTIONS[form.adminRole]}</p>
          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-[#C9A66B] text-white rounded-lg text-sm disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Login'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      <div className="grid gap-4">
        {team.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow-sm p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#F5E9DA] flex items-center justify-center">
                <span className="font-medium text-[#5A4232]">{member.name.charAt(0)}</span>
              </div>
              <div>
                <p className="font-medium">{member.name}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail size={14} />
                  {member.email}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm capitalize">
                <Shield size={14} />
                {member.adminRole}
              </div>
              {adminUser?.id !== member.id && (
                <button
                  onClick={() => setDeleteId(member.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                  title="Remove this admin login"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <ConfirmationDialog
        isOpen={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Remove admin login?"
        message="They will no longer be able to log into the admin dashboard."
        isDangerous
      />
    </div>
  );
};

export default TeamManager;
