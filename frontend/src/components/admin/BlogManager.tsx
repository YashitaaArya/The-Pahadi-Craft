import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Eye, UploadCloud, Loader2 } from 'lucide-react';
import { uploadProductImage } from '../../api/adminApi';
import { compressImage } from '../../utils/compressImage';
import { Modal, ConfirmationDialog, EmptyState, DashboardLoadingSkeleton, showSuccess, showError } from './common';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('adminToken')}` });

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category: string;
  tags: string[];
  featured: boolean;
  status: 'draft' | 'published';
  views: number;
  likes: number;
  createdAt: string;
}

const emptyForm = {
  title: '', slug: '', excerpt: '', content: '', image: '', author: '',
  category: '', tags: '', featured: false, status: 'published' as 'draft' | 'published',
};

const BlogManager: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/blog/admin`, { headers: authHeaders() });
      setPosts(res.data);
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Failed to load posts');
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

  const openEdit = (p: BlogPost) => {
    setEditing(p);
    setForm({
      title: p.title, slug: p.slug, excerpt: p.excerpt, content: p.content, image: p.image,
      author: p.author, category: p.category, tags: p.tags.join(', '), featured: p.featured, status: p.status,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      showError('Title and content are required');
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (editing) {
        await axios.put(`${BASE_URL}/blog/id/${editing.id}`, payload, { headers: authHeaders() });
        showSuccess('Post updated');
      } else {
        await axios.post(`${BASE_URL}/blog`, payload, { headers: authHeaders() });
        showSuccess('Post created');
      }
      setModalOpen(false);
      load();
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${BASE_URL}/blog/id/${deleteId}`, { headers: authHeaders() });
      showSuccess('Post deleted');
      setDeleteId(null);
      load();
    } catch {
      showError('Failed to delete post');
    }
  };

  if (loading) return <DashboardLoadingSkeleton />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif text-[#5A4232]">Blog Posts</h2>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-[#5A4232] text-white rounded-lg text-sm hover:bg-[#4a3628] transition-colors">
          <Plus size={16} />
          New Post
        </button>
      </div>

      {posts.length === 0 ? (
        <EmptyState title="No posts yet" description="Write your first blog post to get started." type="empty" />
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4">
              {p.image ? (
                <img src={p.image} alt={p.title} className="w-20 h-14 object-cover rounded-lg flex-shrink-0" />
              ) : (
                <div className="w-20 h-14 rounded-lg bg-gray-100 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{p.title}</p>
                <p className="text-sm text-gray-500">by {p.author || 'Unknown'} · /blog/{p.slug}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                  <span className="flex items-center gap-1"><Eye size={12} /> {p.views}</span>
                  <span>{p.likes} likes</span>
                  <span className={`px-2 py-0.5 rounded-full ${p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{p.status}</span>
                </div>
              </div>
              <button onClick={() => openEdit(p)} className="p-2 text-gray-500 hover:text-gray-700"><Edit2 size={16} /></button>
              <button onClick={() => setDeleteId(p.id)} className="p-2 text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Post' : 'New Post'} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug (optional - auto-generated from title if left blank)</label>
            <input className="input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="my-post-title" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <input className="input" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Candle Care, Entrepreneurship..." />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (shown on the blog list page)</label>
            <textarea className="input resize-none" rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea className="input resize-none font-mono text-sm" rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Separate paragraphs with a blank line" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
            <div className="flex items-center gap-3">
              {form.image && <img src={form.image} alt="preview" className="w-16 h-16 object-cover rounded-lg" />}
              <label className="flex items-center gap-2 px-3 py-2 border border-[#C9A66B] text-[#5A4232] rounded-lg text-sm cursor-pointer hover:bg-[#F5E9DA] w-fit">
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
                {uploading ? 'Uploading...' : 'Upload'}
                <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploading(true);
                  try {
                    const compressed = await compressImage(file);
                    const url = await uploadProductImage(compressed);
                    setForm((f) => ({ ...f, image: url }));
                  } catch { showError('Upload failed'); } finally { setUploading(false); e.target.value = ''; }
                }} />
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
            <input className="input" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-[#C9A66B]" />
              <span className="text-sm text-gray-700">Featured</span>
            </label>
            <select className="input w-auto" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-[#5A4232] text-white rounded-lg text-sm disabled:opacity-50">
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Publish Post'}
            </button>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      </Modal>

      <ConfirmationDialog isOpen={!!deleteId} onCancel={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete this post?" message="This will remove it from the blog immediately." isDangerous />
    </div>
  );
};

export default BlogManager;