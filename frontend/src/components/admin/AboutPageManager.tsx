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
  historyIntro: string;
  historyJourney: string;
  historyToday: string;
  vision: string;
}

const DEFAULT_CONTENT: AboutContent = {
  candlelightDukeLogo: '',
  pahadiCraftLogo: '',
  founderPhoto: '',
  founderName: 'Neety Arya',
  founderTitle: 'Founder, Pahadicraft',
  founderBio: '',
  historyIntro: '',
  historyJourney: '',
  historyToday: '',
  vision: '',
};

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

const TextSection: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
  placeholder: string;
  help?: string;
}> = ({ label, value, onChange, rows, placeholder, help }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {help && <p className="text-xs text-gray-500 mb-2">{help}</p>}
    <textarea
      className="input resize-y leading-relaxed"
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

const AboutPageManager: React.FC = () => {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get(`${BASE_URL}/about`)
      .then((res) => setContent({ ...DEFAULT_CONTENT, ...res.data }))
      .catch(() => showError('Failed to load About page content'))
      .finally(() => setLoading(false));
  }, []);

  const update = <K extends keyof AboutContent>(key: K, value: AboutContent[K]) => {
    setContent((current) => current ? { ...current, [key]: value } : current);
  };

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
    <div className="max-w-5xl">
      <div className="mb-8">
        <h2 className="text-3xl font-serif text-[#5A4232] mb-2">About Page Content</h2>
        <p className="text-sm text-gray-500">
          Manage the brand story, history, founder section and vision shown on the public About page.
        </p>
      </div>

      {/* Brand evolution */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-[#E0C9A6]/60">
        <h3 className="font-serif text-xl text-[#5A4232] mb-1">Brand History</h3>
        <p className="text-sm text-gray-500 mb-5">The visual transition from Candlelight Duke to Pahadicraft.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageField
            label="Candlelight Duke Logo (old)"
            value={content.candlelightDukeLogo}
            onChange={(url) => update('candlelightDukeLogo', url)}
          />
          <ImageField
            label="Pahadicraft Logo (current)"
            value={content.pahadiCraftLogo}
            onChange={(url) => update('pahadiCraftLogo', url)}
          />
        </div>
      </div>

      {/* History content */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-[#E0C9A6]/60">
        <div className="mb-6">
          <h3 className="font-serif text-xl text-[#5A4232]">History & Establishment</h3>
          <p className="text-sm text-gray-500 mt-1">
            These sections form the brand timeline from September 2017 to the present.
          </p>
        </div>

        <div className="space-y-5">
          <TextSection
            label="The Beginning — September 2017"
            value={content.historyIntro}
            onChange={(value) => update('historyIntro', value)}
            rows={7}
            placeholder="Tell the story of the beginning, returning from Hyderabad, the turning point and the first 5 kg of wax..."
            help="You can use multiple paragraphs. Keep the 2017 origin story here."
          />

          <TextSection
            label="2023 — The Vision Expands"
            value={content.historyJourney}
            onChange={(value) => update('historyJourney', value)}
            rows={9}
            placeholder="Explain the five years of Candlelight Duke, the expansion beyond candles and the birth of Pahadicraft..."
            help="This section explains the evolution from Candlelight Duke to Pahadicraft."
          />

          <TextSection
            label="Pahadicraft Today"
            value={content.historyToday}
            onChange={(value) => update('historyToday', value)}
            rows={8}
            placeholder="Describe what Pahadicraft represents today and the direction of the brand..."
          />
        </div>
      </div>

      {/* Founder */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-[#E0C9A6]/60">
        <div className="mb-6">
          <h3 className="font-serif text-xl text-[#5A4232]">About the Founder</h3>
          <p className="text-sm text-gray-500 mt-1">
            The public page presents this section in first person, as the founder telling her own story.
          </p>
        </div>

        <div className="space-y-5">
          <ImageField
            label="Founder Photo"
            value={content.founderPhoto}
            onChange={(url) => update('founderPhoto', url)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                className="input"
                value={content.founderName}
                onChange={(e) => update('founderName', e.target.value)}
                placeholder="Founder name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                className="input"
                value={content.founderTitle}
                onChange={(e) => update('founderTitle', e.target.value)}
                placeholder="Founder, Pahadicraft"
              />
            </div>
          </div>

          <TextSection
            label="Founder Story"
            value={content.founderBio}
            onChange={(value) => update('founderBio', value)}
            rows={24}
            placeholder="Write the founder's story in first person..."
            help="Use blank lines between paragraphs. The About page will preserve those paragraph breaks."
          />
        </div>
      </div>

      {/* Vision */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-[#E0C9A6]/60">
        <h3 className="font-serif text-xl text-[#5A4232] mb-1">Vision</h3>
        <p className="text-sm text-gray-500 mb-5">
          This appears as the closing vision statement on the public About page.
        </p>

        <TextSection
          label="Our Vision"
          value={content.vision}
          onChange={(value) => update('vision', value)}
          rows={6}
          placeholder="Describe the long-term vision for Pahadicraft..."
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 bg-[#5A4232] text-white rounded-lg text-sm font-medium hover:bg-[#4A3220] transition-colors disabled:opacity-50"
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
};

export default AboutPageManager;
