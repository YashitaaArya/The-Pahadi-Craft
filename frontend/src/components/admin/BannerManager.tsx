import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  X,
  Loader,
  AlertCircle,
} from 'lucide-react';
import {
  getAllBannersAdmin,
  createBanner,
  updateBanner,
  deleteBanner,
  uploadProductImage,
} from '../../api/adminApi';
import { showSuccess, showError } from './common';

interface Banner {
  id: string;
  title: string;
  description?: string;
  image: string;
  link?: string;
  active: boolean;
  position: number;
}

interface FormData {
  title: string;
  description: string;
  image: string;
  link: string;
  active: boolean;
}

const BannerManager: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    image: '',
    link: '',
    active: true,
  });

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    setLoading(true);
    try {
      const data = await getAllBannersAdmin();
      setBanners(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load banners:', error);
      showError('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return formData.image;

    setUploading(true);
    try {
      const url = await uploadProductImage(imageFile);
      return url;
    } catch (error) {
      console.error('Failed to upload image:', error);
      showError('Failed to upload image');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleEditBanner = (banner: Banner) => {
    setEditingId(banner.id);
    setFormData({
      title: banner.title,
      description: banner.description || '',
      image: banner.image,
      link: banner.link || '',
      active: banner.active,
    });
    setImagePreview(banner.image);
    setShowForm(true);
  };

  const handleResetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      link: '',
      active: true,
    });
    setImageFile(null);
    setImagePreview('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showError('Title is required');
      return;
    }

    if (!formData.image && !imageFile) {
      showError('Image is required');
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl = formData.image;

      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const bannerData = {
        title: formData.title,
        description: formData.description,
        image: imageUrl,
        link: formData.link,
        active: formData.active,
      };

      if (editingId) {
        await updateBanner(editingId, bannerData);
        showSuccess('Banner updated successfully');
      } else {
        await createBanner(bannerData);
        showSuccess('Banner created successfully');
      }

      handleResetForm();
      loadBanners();
    } catch (error) {
      console.error('Failed to save banner:', error);
      showError('Failed to save banner');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) {
      return;
    }

    try {
      await deleteBanner(id);
      showSuccess('Banner deleted successfully');
      loadBanners();
    } catch (error) {
      console.error('Failed to delete banner:', error);
      showError('Failed to delete banner');
    }
  };

  const handleMoveBanner = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = banners.findIndex((b) => b.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= banners.length) return;

    const banner = banners[currentIndex];
    const targetBanner = banners[newIndex];

    try {
      const newPosition = direction === 'up' ? targetBanner.position : targetBanner.position;
      await updateBanner(banner.id, { position: newPosition });
      loadBanners();
    } catch (error) {
      console.error('Failed to reorder banners:', error);
      showError('Failed to reorder banners');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Hero Slides Management</h2>
        <motion.button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          Add New Slide
        </motion.button>
      </div>

      {/* Form Section */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingId ? 'Edit Banner' : 'Create New Banner'}
              </h3>
              <button
                onClick={handleResetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Summer Collection"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Optional banner description"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image *
                </label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {imagePreview && (
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Link Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link (Optional)
                </label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  placeholder="e.g., /shop?category=summer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData({ ...formData, active: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="active" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2 pt-4">
                <motion.button
                  type="submit"
                  disabled={submitting || uploading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {submitting || uploading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Banner'
                  )}
                </motion.button>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Banners List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <Loader className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : banners.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No hero slides found. Create one to get started!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {banners.map((banner, index) => (
              <motion.div
                key={banner.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 flex gap-4 items-start hover:bg-gray-50 transition-colors"
              >
                {/* Image */}
                <div className="w-20 h-20 flex-shrink-0">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">{banner.title}</h3>
                      {banner.description && (
                        <p className="text-sm text-gray-600 mt-1">{banner.description}</p>
                      )}
                      {banner.link && (
                        <p className="text-sm text-blue-600 mt-1">Link: {banner.link}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            banner.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {banner.active ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-xs text-gray-500">
                          Position: {banner.position}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      {index > 0 && (
                        <motion.button
                          onClick={() => handleMoveBanner(banner.id, 'up')}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Move up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </motion.button>
                      )}
                      {index < banners.length - 1 && (
                        <motion.button
                          onClick={() => handleMoveBanner(banner.id, 'down')}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Move down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </motion.button>
                      )}
                      <motion.button
                        onClick={() => handleEditBanner(banner)}
                        className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteBanner(banner.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerManager;
