import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Star, UploadCloud, Loader2 } from 'lucide-react';
import {
  getAllTestimonialsAdmin,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  uploadProductImage,
} from '../../api/adminApi';
import { compressImage } from '../../utils/compressImage';
import { Testimonial } from '../../types';
import {
  Modal,
  ConfirmationDialog,
  EmptyState,
  DashboardLoadingSkeleton,
  showSuccess,
  showError,
} from './common';

// Testimonials go live immediately - no approval step. Admin keeps full
// edit/delete control instead, so the section stays genuine and organic.
const emptyForm = { name: '', content: '', rating: 5, image: '', status: 'approved' as Testimonial['status'] };

const TestimonialManager: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAllTestimonialsAdmin();
      setTestimonials(data);
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({ name: t.name, content: t.content, rating: t.rating, image: t.image, status: 'approved' });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.content.trim()) {
      showError('Name and testimonial text are required');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateTestimonial(editing.id, form);
        showSuccess('Testimonial updated');
      } else {
        await createTestimonial(form);
        showSuccess('Testimonial added');
      }
      setModalOpen(false);
      load();
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Failed to save testimonial');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteTestimonial(deleteId);
      showSuccess('Testimonial removed');
      setDeleteId(null);
      load();
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Failed to delete testimonial');
    }
  };

  if (loading) return <DashboardLoadingSkeleton />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h2 className="text-2xl font-serif text-[#5A4232]">Testimonials</h2>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#5A4232] text-white rounded-lg text-sm hover:bg-[#4a3628] transition-colors"
        >
          <Plus size={16} />
          Add Testimonial
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-4 -mt-2">
        Reviews go live immediately once added - no approval step needed.
      </p>

      {testimonials.length === 0 ? (
        <EmptyState
          title="No testimonials yet"
          description="Add a few of the owner's favorite customer stories to feature on the homepage."
          type="empty"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {testimonials.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-5"
            >
              <div className="flex items-center gap-3">
                {t.image ? (
                  <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#F5E9DA] flex items-center justify-center text-[#5A4232] font-medium">
                    {t.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-medium">{t.name}</p>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill={i < t.rating ? '#C9A66B' : 'none'} stroke="#C9A66B" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">{t.content}</p>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t">
                <button onClick={() => openEdit(t)} className="text-gray-500 hover:text-gray-700 p-1.5" title="Edit">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => setDeleteId(t.id)} className="text-red-500 hover:text-red-700 p-1.5 ml-auto" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Testimonial' : 'Add Testimonial'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial</label>
            <textarea
              className="input resize-none"
              rows={4}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm({ ...form, rating: r })}
                  className="p-1"
                >
                  <Star size={22} fill={r <= form.rating ? '#C9A66B' : 'none'} stroke="#C9A66B" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Photo (optional)</label>
            <div className="flex items-center gap-3">
              {form.image && <img src={form.image} alt="preview" className="w-12 h-12 rounded-full object-cover" />}
              <label className="flex items-center gap-2 px-3 py-2 border border-[#C9A66B] text-[#5A4232] rounded-lg text-sm cursor-pointer hover:bg-[#F5E9DA] w-fit">
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
                {uploading ? 'Uploading...' : 'Upload photo'}
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
                      showError(err?.response?.data?.error || 'Upload failed');
                    } finally {
                      setUploading(false);
                      e.target.value = '';
                    }
                  }}
                />
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-[#5A4232] text-white rounded-lg text-sm disabled:opacity-50"
            >
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Testimonial'}
            </button>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmationDialog
        isOpen={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete testimonial?"
        message="This will remove it from the homepage immediately."
        isDangerous
      />
    </div>
  );
};

export default TestimonialManager;