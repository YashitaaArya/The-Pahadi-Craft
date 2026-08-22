import React, { useEffect, useState } from 'react';
import { UploadCloud, Loader2, Save } from 'lucide-react';
import { uploadProductImage } from '../../api/adminApi';
import { compressImage } from '../../utils/compressImage';
import { DashboardLoadingSkeleton, showSuccess, showError } from './common';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('adminToken')}` });

interface AboutContent {
  candlelightDukeLogo: string;
  pahadiCraftLogo: string;
  founderPhoto: string;
  founderName: string;
  founderTitle: string;
  founderBio: string;
}

const ImageField: React.FC<{
  label: string;
  value: string;
  onChange: (url: string) => void;
}> = ({ label, value, onChange }) => {
  const [uploading, setUploading] = useState(false);
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-center gap-3">
        {value ? (
          <img src={value} alt={label} className="w-16 h-16 object-contain bg-[#F5E9DA] rounded-lg" />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gray-100" />
        )}
        <label className="flex items-center gap-2 px-3 py-2 border border-[#C9A66B] text-[#5A4232] rounded-lg text-sm cursor-pointer hover:bg-[#F5E9DA] w-fit">
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
          {uploading ? 'Uploading...' : value ? 'Replace' : 'Upload'}
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
                onChange(url);
              } catch {
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
  );
};

const AboutPageManager: React.FC = () => {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get(`${BASE_URL}/about`)
      .then((res) => setContent(res.data))
      .catch(() => showError('Failed to load About page content'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    try {
      await axios.put(`${BASE_URL}/about`, content, { headers: authHeaders() });
      showSuccess('About page updated');
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !content) return <DashboardLoadingSkeleton />;

  return (
    <div>
      <h2 className="text-2xl font-serif text-[#5A4232] mb-2">About Page Content</h2>
      <p className="text-sm text-gray-500 mb-6">
        Controls the brand history logos and founder section on the About Us page.
      </p>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="font-serif text-lg text-[#5A4232] mb-4">Brand History: Candlelight Duke → Pahadi Craft</h3>
        <div className="grid grid-cols-2 gap-6">
          <ImageField
            label="Candlelight Duke Logo (old)"
            value={content.candlelightDukeLogo}
            onChange={(url) => setContent({ ...content, candlelightDukeLogo: url })}
          />
          <ImageField
            label="Pahadi Craft Logo (current)"
            value={content.pahadiCraftLogo}
            onChange={(url) => setContent({ ...content, pahadiCraftLogo: url })}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="font-serif text-lg text-[#5A4232] mb-4">About the Founder</h3>
        <div className="space-y-4">
          <ImageField
            label="Founder Photo"
            value={content.founderPhoto}
            onChange={(url) => setContent({ ...content, founderPhoto: url })}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input className="input" value={content.founderName} onChange={(e) => setContent({ ...content, founderName: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input className="input" value={content.founderTitle} onChange={(e) => setContent({ ...content, founderTitle: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              className="input resize-none"
              rows={5}
              value={content.founderBio}
              onChange={(e) => setContent({ ...content, founderBio: e.target.value })}
              placeholder="A few paragraphs about the founder's journey..."
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-5 py-2.5 bg-[#5A4232] text-white rounded-lg text-sm disabled:opacity-50"
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
};

export default AboutPageManager;