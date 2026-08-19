import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Loader2, Save } from 'lucide-react';
import { getCollections, updateCollection, uploadProductImage, CollectionCard } from '../../api/adminApi';
import { compressImage } from '../../utils/compressImage';
import { DashboardLoadingSkeleton, showSuccess, showError } from './common';

const CollectionsManager: React.FC = () => {
  const [cards, setCards] = useState<CollectionCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [savingFor, setSavingFor] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setCards(await getCollections());
    } catch (err: any) {
      showError('Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateLocal = (category: string, patch: Partial<CollectionCard>) => {
    setCards((prev) => prev.map((c) => (c.category === category ? { ...c, ...patch } : c)));
  };

  const handleUpload = async (category: string, file: File) => {
    setUploadingFor(category);
    try {
      const compressed = await compressImage(file);
      const url = await uploadProductImage(compressed);
      updateLocal(category, { image: url });
      await updateCollection(category, { image: url });
      showSuccess(`Updated image for ${category}`);
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Upload failed');
    } finally {
      setUploadingFor(null);
    }
  };

  const handleSaveTagline = async (card: CollectionCard) => {
    setSavingFor(card.category);
    try {
      await updateCollection(card.category, { tagline: card.tagline });
      showSuccess('Saved');
    } catch (err: any) {
      showError('Failed to save');
    } finally {
      setSavingFor(null);
    }
  };

  if (loading) return <DashboardLoadingSkeleton />;

  return (
    <div>
      <h2 className="text-2xl font-serif text-[#5A4232] mb-2">Homepage Collections</h2>
      <p className="text-sm text-gray-500 mb-6">
        One card per main category, shown on the homepage "Our Collections" section. Set an image and a short
        tagline for each - categories without an image yet show a placeholder until you add one.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <motion.div
            key={card.category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-4"
          >
            <div className="flex gap-4">
              {card.image ? (
                <img src={card.image} alt={card.category} className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />
              ) : (
                <div className="w-24 h-24 rounded-lg bg-[#F5E9DA] flex items-center justify-center flex-shrink-0 text-xs text-gray-400 text-center p-1">
                  No image yet
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#5A4232] mb-2">{card.category}</p>
                <label className="flex items-center gap-2 px-3 py-1.5 border border-[#C9A66B] text-[#5A4232] rounded-lg text-xs cursor-pointer hover:bg-[#F5E9DA] w-fit mb-2">
                  {uploadingFor === card.category ? <Loader2 size={12} className="animate-spin" /> : <UploadCloud size={12} />}
                  {uploadingFor === card.category ? 'Uploading...' : 'Change image'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingFor !== null}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(card.category, file);
                      e.target.value = '';
                    }}
                  />
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={card.tagline}
                    onChange={(e) => updateLocal(card.category, { tagline: e.target.value })}
                    placeholder="Short tagline, e.g. Warmth in every flame"
                    className="input text-sm flex-1"
                  />
                  <button
                    onClick={() => handleSaveTagline(card)}
                    disabled={savingFor === card.category}
                    className="px-3 py-1.5 bg-[#5A4232] text-white rounded-lg text-xs disabled:opacity-50 flex items-center gap-1"
                  >
                    {savingFor === card.category ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CollectionsManager;