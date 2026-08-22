import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, UploadCloud, Loader2, Eye, EyeOff } from 'lucide-react';
import { uploadProductImage } from '../../api/adminApi';
import { compressImage } from '../../utils/compressImage';
import { Modal, ConfirmationDialog, EmptyState, DashboardLoadingSkeleton, showSuccess, showError } from './common';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('adminToken')}` });

interface PressMention {
  id: string;
  title: string;
  source: string;
  description: string;
  image: string;
  link: string;
  date: string;
  position: number;
  active: boolean;
}

const emptyForm = { title: '', source: '', description: '', image: '', link: '', date: '', active: true, position: 0 };

const PressManager: React.FC = () => {
  const [mentions, setMentions] = useState<PressMention[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PressMention | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/press/admin`, { headers: authHeaders() });
      setMentions(res.data);
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Failed to load press mentions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, position: mentions.length });
    setModalOpen(true);
  };

  const openEdit = (m: PressMention) => {
    setEditing(m);
    setForm({ title: m.title, source: m.source, description: m.description, image: m.image, link: m.link, date: m.date, active: m.active, position: m.position });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      showError('Title is required');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await axios.put(`${BASE_URL}/press/${editing.id}`, form, { headers: authHeaders() });
        showSuccess('Updated');
      } else {
        await axios.post(`${BASE_URL}/press`, form, { headers: authHeaders() });
        showSuccess('Added');
      }
      setModalOpen(false);
      load();
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${BASE_URL}/press/${deleteId}`, { headers: authHeaders() });
      showSuccess('Removed');
      setDeleteId(null);
      load();
    } catch {
      showError('Failed to delete');
    }
  };

  const toggleActive = async (m: PressMention) => {
    try {
      await axios.put(`${BASE_URL}/press/${m.id}`, { active: !m.active }, { headers: authHeaders() });
      load();
    } catch {
      showError('Failed to update');
    }
  };

  if (loading) return <DashboardLoadingSkeleton />;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-serif text-[#5A4232]">Press & Recognition</h2>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#5A4232] text-white rounded-lg text-sm hover:bg-[#4a3628] transition-colors"
        >
          <Plus size={16} />
          Add Mention
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Newspaper features, awards, and other recognition - shown on the About Us page.
      </p>

      {mentions.length === 0 ? (
        <EmptyState title="No press mentions yet" description="Add a scan of a newspaper feature or award once the owner shares one." type="empty" />
      ) : (
        <div className="space-y-3">
          {mentions.map((m) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4">
              {m.image ? (
                <img src={m.image} alt={m.title} className="w-20 h-14 object-cover rounded-lg flex-shrink-0" />
              ) : (
                <div className="w-20 h-14 rounded-lg bg-gray-100 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{m.title}</p>
                <p className="text-sm text-gray-500 truncate">{[m.source, m.date].filter(Boolean).join(' — ')}</p>
              </div>
              <button onClick={() => toggleActive(m)} className="p-2 text-gray-500 hover:text-gray-700" title={m.active ? 'Visible - click to hide' : 'Hidden - click to show'}>
                {m.active ? <Eye size={18} className="text-green-600" /> : <EyeOff size={18} />}
              </button>
              <button onClick={() => openEdit(m)} className="p-2 text-gray-500 hover:text-gray-700">
                <Edit2 size={16} />
              </button>
              <button onClick={() => setDeleteId(m.id)} className="p-2 text-red-500 hover:text-red-700">
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Mention' : 'Add Mention'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Featured in The Tribune" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <input className="input" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="The Tribune" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="March 2023" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="input resize-none"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Explain what this is about, in your own words..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Scan / Photo</label>
            <div className="flex items-center gap-3">
              {form.image && <img src={form.image} alt="preview" className="w-16 h-16 object-cover rounded-lg" />}
              <label className="flex items-center gap-2 px-3 py-2 border border-[#C9A66B] text-[#5A4232] rounded-lg text-sm cursor-pointer hover:bg-[#F5E9DA] w-fit">
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
                {uploading ? 'Uploading...' : 'Upload'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploading(true);
                    try {
                      const compressed = await compressImage(file);
                      const url = await uploadProductImage(compressed);
                      setForm((f) => ({ ...f, image: url }));
                    } catch (err: any) {
                      showError('Upload failed');
                    } finally {
                      setUploading(false);
                      e.target.value = '';
                    }
                  }}
                />
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link (optional)</label>
            <input className="input" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://..." />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-[#C9A66B]" />
            <span className="text-sm text-gray-700">Visible on About Us</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-[#5A4232] text-white rounded-lg text-sm disabled:opacity-50">
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add'}
            </button>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      </Modal>

      <ConfirmationDialog isOpen={!!deleteId} onCancel={() => setDeleteId(null)} onConfirm={handleDelete} title="Remove this mention?" message="This will remove it from the About Us page immediately." isDangerous />
    </div>
  );
};

export default PressManager;