import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Filter, ChevronDown, UploadCloud, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAdminDashboardStore } from '../../store/adminDashboardStore';
import { Product, ProductColorVariant } from '../../types';
import { getDriveImage } from '../../utils/driveImage';
import { uploadProductImage, getProductCategories } from '../../api/adminApi';
import { compressImage } from '../../utils/compressImage';
import {
  Modal,
  ConfirmationDialog,
  EmptyState,
  LoadingSkeleton,
  showSuccess,
  showError,
} from './common';

// Fixed top-level categories - matches backend/config/categories.js exactly.
// Prime/secondary subcategories are intentionally free text with autocomplete
// suggestions (fetched from real products already in the database), since the
// real catalog has far more variety than any hardcoded list could keep up with.
const MAIN_CATEGORIES = [
  'Candles',
  'Bath Salts & Soaps',
  'Resin Jewellery',
  'Resin Artifacts',
  'Concrete Artifacts',
  'Terracotta / Clay',
  'Occasion-Based',
];

interface ProductFormData extends Omit<Product, 'id'> {
  additionalImagesText?: string;
}

const ProductManager: React.FC = () => {
  const {
    products,
    loading,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useAdminDashboardStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock'>('name');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGalleryImages, setUploadingGalleryImages] = useState(false);
  const [galleryUploadProgress, setGalleryUploadProgress] = useState('');
  const [categorySuggestions, setCategorySuggestions] = useState<{ primeSubcategories: string[]; secondarySubcategories: string[] }>({
    primeSubcategories: [],
    secondarySubcategories: [],
  });
  const [colorVariants, setColorVariants] = useState<ProductColorVariant[]>([]);
  const [uploadingVariantIndex, setUploadingVariantIndex] = useState<number | null>(null);

  useEffect(() => {
    getProductCategories()
      .then((data) => setCategorySuggestions({
        primeSubcategories: data.primeSubcategories,
        secondarySubcategories: data.secondarySubcategories,
      }))
      .catch(() => {
        // Non-critical - the fields still work as plain free text without suggestions.
      });
  }, []);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<ProductFormData>(
    {
      defaultValues: editingProduct || {
        name: '',
        description: '',
        price: 0,
        category: '',
        subcategory: '',
        mainCategory: '',
        primeSubcategory: '',
        secondarySubcategory: '',
        scented: false,
        size: '',
        volume: '',
        capacity: '',
        stock: 0,
        sku: '',
        image: '',
        featured: false,
        trending: false,
        additionalImagesText: '',
      },
    }
  );

  // Filter and search products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(p => (p.mainCategory || p.category) === filterCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'stock':
          return b.stock - a.stock;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, searchTerm, filterCategory, sortBy]);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setColorVariants(product.colorVariants || []);
      reset({
        ...product,
        additionalImagesText: (
          product.additionalImages?.join('\n') ||
          product.addtionalImages?.join('\n') ||
          ''
        ),
      });
    } else {
      setEditingProduct(null);
      setColorVariants([]);
      reset({
        name: '',
        description: '',
        price: 0,
        category: '',
        subcategory: '',
        mainCategory: '',
        primeSubcategory: '',
        secondarySubcategory: '',
        scented: false,
        size: '',
        volume: '',
        capacity: '',
        stock: 0,
        sku: '',
        image: '',
        featured: false,
        trending: false,
        additionalImagesText: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setColorVariants([]);
    reset();
  };

  const handleDelete = (productId: string) => {
    setDeleteProductId(productId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteProductId) {
      deleteProduct(deleteProductId);
      showSuccess('Product deleted successfully');
      setIsDeleteDialogOpen(false);
      setDeleteProductId(null);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      const parsedAdditionalImages = (data.additionalImagesText || '')
        .split(/[,\n]+/)
        .map((item) => item.trim())
        .filter(Boolean)
        .map((url) => getDriveImage(url));

      const normalizedImage = getDriveImage(data.image || '');
      const { additionalImagesText, ...rest } = data;

      const payload: Omit<Product, 'id'> = {
        ...rest,
        image: normalizedImage,
        additionalImages: parsedAdditionalImages,
        colorVariants,
      };

      if (editingProduct) {
        await updateProduct({ ...payload, id: editingProduct.id });
        showSuccess('Product updated successfully');
      } else {
        const newProduct: Product = {
          ...payload,
          id: `product_${Date.now()}`,
        };
        await addProduct(newProduct);
        showSuccess('Product added successfully');
      }
      handleCloseModal();
    } catch (error: any) {
      showError(error?.response?.data?.error || 'Failed to save product');
    }
  };

  if (loading) {
    return <LoadingSkeleton count={5} height="h-24" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-serif text-[#5A4232]">Product Management</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleOpenModal()}
          className="btn btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </motion.button>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white rounded-lg p-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>

        {/* Category Filter */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="input"
        >
          <option value="all">All Categories</option>
          {MAIN_CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="input"
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
          <option value="stock">Sort by Stock</option>
        </select>

        {/* Results Count */}
        <div className="flex items-center justify-center bg-gray-50 rounded-lg px-4">
          <p className="text-sm text-gray-600">
            <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products
          </p>
        </div>
      </div>

      {/* Products List */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          title="No Products Found"
          description={searchTerm ? 'Try adjusting your search criteria' : 'Add your first product to get started'}
          action={{
            label: 'Add Product',
            onClick: () => handleOpenModal(),
          }}
        />
      ) : (
        <div className="space-y-3">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  {product.image ? (
                    <img
                      src={getDriveImage(product.image)}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
                      <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                    </div>
                    <div className="flex gap-2">
                      {product.featured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Featured
                        </span>
                      )}
                      {product.trending && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Trending
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3 text-sm">
                    <div>
                      <p className="text-gray-500">Price</p>
                      <p className="font-semibold text-[#C9A66B]">₹{product.price}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Category</p>
                      <p className="font-semibold text-gray-900">{product.mainCategory || product.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Stock</p>
                      <p className={`font-semibold ${product.stock <= 10 ? 'text-red-600' : 'text-green-600'}`}>
                        {product.stock} units
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Rating</p>
                      <p className="font-semibold text-gray-900">{product.ratings ? product.ratings.toFixed(1) : 'N/A'} ⭐</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>

                  <div className="flex items-center gap-3 mt-2">
                    {product.scented && (
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded-full">Scented</span>
                    )}
                    {product.colorVariants && product.colorVariants.length > 0 && (
                      <div className="flex items-center gap-1">
                        {product.colorVariants.slice(0, 6).map((v, i) => (
                          <span
                            key={i}
                            title={v.colorName}
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: v.hexCode }}
                          />
                        ))}
                        {product.colorVariants.length > 6 && (
                          <span className="text-xs text-gray-400">+{product.colorVariants.length - 6}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOpenModal(product)}
                    className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(product.id)}
                    className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Product Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        size="lg"
        onSubmit={handleSubmit(onSubmit)}
        submitText={editingProduct ? 'Update' : 'Create'}
      >
        <form className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="input"
                placeholder="Premium Scented Candle"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU *
              </label>
              <input
                type="text"
                {...register('sku', { required: 'SKU is required' })}
                className="input"
                placeholder="CANDLE-001"
              />
              {errors.sku && <p className="text-red-600 text-sm mt-1">{errors.sku.message}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              className="input resize-none"
              rows={3}
              placeholder="Detailed product description..."
            />
            {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                {...register('price', { required: 'Price is required' })}
                className="input"
                placeholder="0"
                min="0"
              />
              {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock *
              </label>
              <input
                type="number"
                {...register('stock', { required: 'Stock is required' })}
                className="input"
                placeholder="0"
                min="0"
              />
              {errors.stock && <p className="text-red-600 text-sm mt-1">{errors.stock.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount (%)
              </label>
              <input
                type="number"
                {...register('discount')}
                className="input"
                placeholder="0"
                min="0"
                max="100"
              />
            </div>
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Main Category *
              </label>
              <select {...register('mainCategory', { required: 'Category is required' })} className="input">
                <option value="">Select Category</option>
                {MAIN_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.mainCategory && <p className="text-red-600 text-sm mt-1">{errors.mainCategory.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prime Subcategory
              </label>
              <input
                type="text"
                list="prime-subcategory-options"
                {...register('primeSubcategory')}
                className="input"
                placeholder="e.g. Glass Jar Candles"
              />
              <datalist id="prime-subcategory-options">
                {categorySuggestions.primeSubcategories.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secondary Subcategory
              </label>
              <input
                type="text"
                list="secondary-subcategory-options"
                {...register('secondarySubcategory')}
                className="input"
                placeholder="Optional, more specific"
              />
              <datalist id="secondary-subcategory-options">
                {categorySuggestions.secondarySubcategories.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Size / Volume / Capacity / Scented */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
              <input type="text" {...register('size')} className="input" placeholder='e.g. 4 x 6 in' />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Volume</label>
              <input type="text" {...register('volume')} className="input" placeholder="e.g. 250ml" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <input type="text" {...register('capacity')} className="input" placeholder="e.g. 500g" />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('scented')}
                  className="w-4 h-4 rounded border-gray-300 text-[#C9A66B]"
                />
                <span className="text-sm text-gray-700">Scented</span>
              </label>
            </div>
          </div>

          {/* Featured & Trending */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('featured')}
                className="w-4 h-4 rounded border-gray-300 text-[#C9A66B]"
              />
              <span className="text-sm text-gray-700">Mark as Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('trending')}
                className="w-4 h-4 rounded border-gray-300 text-[#C9A66B]"
              />
              <span className="text-sm text-gray-700">Mark as Trending</span>
            </label>
          </div>

          {/* Product Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image
            </label>
            <div className="flex items-start gap-4">
              {watch('image') ? (
                <img
                  src={getDriveImage(watch('image') || '')}
                  alt="Product preview"
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                />
              ) : (
                <div className="w-20 h-20 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-gray-300">
                  <UploadCloud size={24} />
                </div>
              )}
              <div className="flex-1">
                <label className="flex items-center justify-center gap-2 px-4 py-2 border border-[#C9A66B] text-[#5A4232] rounded-lg text-sm cursor-pointer hover:bg-[#F5E9DA] transition-colors w-fit">
                  {uploadingImage ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <UploadCloud size={16} />
                      Upload from device
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingImage}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploadingImage(true);
                      try {
                        const compressed = await compressImage(file);
                        const url = await uploadProductImage(compressed);
                        setValue('image', url, { shouldDirty: true });
                        showSuccess('Image uploaded');
                      } catch (err: any) {
                        showError(err?.response?.data?.error || 'Image upload failed');
                      } finally {
                        setUploadingImage(false);
                        e.target.value = '';
                      }
                    }}
                  />
                </label>
                <details className="mt-2">
                  <summary className="text-xs text-gray-500 cursor-pointer">Or paste an image URL instead</summary>
                  <input
                    type="url"
                    {...register('image')}
                    className="input mt-2"
                    placeholder="https://example.com/image.jpg"
                  />
                </details>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Product Images
            </label>

            {/* Thumbnails of already-added gallery images */}
            {(() => {
              const currentUrls = (watch('additionalImagesText') || '')
                .split(/[\n,]/)
                .map((u) => u.trim())
                .filter(Boolean);
              if (currentUrls.length === 0) return null;
              return (
                <div className="flex flex-wrap gap-2 mb-3">
                  {currentUrls.map((url, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={getDriveImage(url)}
                        alt={`Gallery ${idx + 1}`}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = currentUrls.filter((_, i) => i !== idx);
                          setValue('additionalImagesText', next.join('\n'), { shouldDirty: true });
                        }}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              );
            })()}

            <label className="flex items-center justify-center gap-2 px-4 py-2 border border-[#C9A66B] text-[#5A4232] rounded-lg text-sm cursor-pointer hover:bg-[#F5E9DA] transition-colors w-fit">
              {uploadingGalleryImages ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Uploading {galleryUploadProgress}...
                </>
              ) : (
                <>
                  <UploadCloud size={16} />
                  Upload photos from device
                </>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={uploadingGalleryImages}
                onChange={async (e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length === 0) return;
                  setUploadingGalleryImages(true);
                  const uploaded: string[] = [];
                  try {
                    for (let i = 0; i < files.length; i++) {
                      setGalleryUploadProgress(`${i + 1}/${files.length}`);
                      try {
                        const compressed = await compressImage(files[i]);
                        const url = await uploadProductImage(compressed);
                        uploaded.push(url);
                      } catch (err: any) {
                        showError(err?.response?.data?.error || `Failed to upload ${files[i].name}`);
                      }
                    }
                    if (uploaded.length > 0) {
                      const existing = (watch('additionalImagesText') || '')
                        .split(/[\n,]/)
                        .map((u) => u.trim())
                        .filter(Boolean);
                      setValue('additionalImagesText', [...existing, ...uploaded].join('\n'), { shouldDirty: true });
                      showSuccess(`Uploaded ${uploaded.length} image${uploaded.length > 1 ? 's' : ''}`);
                    }
                  } finally {
                    setUploadingGalleryImages(false);
                    setGalleryUploadProgress('');
                    e.target.value = '';
                  }
                }}
              />
            </label>
            <p className="text-xs text-gray-500 mt-1">
              You can select multiple photos at once. They'll be added to the gallery above.
            </p>

            <details className="mt-3">
              <summary className="text-xs text-gray-500 cursor-pointer">Or paste image URLs instead</summary>
              <textarea
                {...register('additionalImagesText')}
                className="input resize-none mt-2"
                rows={3}
                placeholder="Enter one image URL per line or comma-separated"
              />
            </details>
          </div>

          {/* Color Variants */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Color Variants
              </label>
              <button
                type="button"
                onClick={() => setColorVariants((prev) => [...prev, { colorName: '', hexCode: '#C9A66B', images: [], stock: 0, sku: '' }])}
                className="text-xs px-3 py-1.5 border border-[#C9A66B] text-[#5A4232] rounded-lg hover:bg-[#F5E9DA]"
              >
                + Add Color Variant
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              If this product comes in multiple colors, add one variant per color. Each shows as a round swatch for customers to pick on the product page.
            </p>

            {colorVariants.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No color variants added - leave this empty if the product only comes in one look.</p>
            ) : (
              <div className="space-y-3">
                {colorVariants.map((variant, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center gap-1">
                        <input
                          type="color"
                          value={variant.hexCode}
                          onChange={(e) => {
                            const updated = [...colorVariants];
                            updated[idx] = { ...updated[idx], hexCode: e.target.value };
                            setColorVariants(updated);
                          }}
                          className="w-10 h-10 rounded-full border border-gray-300 cursor-pointer p-0"
                          title="Swatch color"
                        />
                      </div>

                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Color name (e.g. Terracotta Orange)"
                          value={variant.colorName}
                          onChange={(e) => {
                            const updated = [...colorVariants];
                            updated[idx] = { ...updated[idx], colorName: e.target.value };
                            setColorVariants(updated);
                          }}
                          className="input"
                        />
                        <input
                          type="number"
                          placeholder="Stock"
                          min="0"
                          value={variant.stock}
                          onChange={(e) => {
                            const updated = [...colorVariants];
                            updated[idx] = { ...updated[idx], stock: Number(e.target.value) };
                            setColorVariants(updated);
                          }}
                          className="input"
                        />
                        <input
                          type="text"
                          placeholder="SKU (optional)"
                          value={variant.sku}
                          onChange={(e) => {
                            const updated = [...colorVariants];
                            updated[idx] = { ...updated[idx], sku: e.target.value };
                            setColorVariants(updated);
                          }}
                          className="input"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => setColorVariants((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove this variant"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      {variant.images.map((img, imgIdx) => (
                        <div key={imgIdx} className="relative group">
                          <img src={img} alt="" className="w-12 h-12 object-cover rounded-lg border border-gray-200" />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...colorVariants];
                              updated[idx] = { ...updated[idx], images: updated[idx].images.filter((_, i) => i !== imgIdx) };
                              setColorVariants(updated);
                            }}
                            className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <label className="flex items-center gap-1 px-2 py-1.5 border border-dashed border-gray-300 text-gray-500 rounded-lg text-xs cursor-pointer hover:bg-gray-50">
                        {uploadingVariantIndex === idx ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <UploadCloud size={12} />
                        )}
                        {uploadingVariantIndex === idx ? 'Uploading...' : 'Add photo'}
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          disabled={uploadingVariantIndex !== null}
                          onChange={async (e) => {
                            const files = Array.from(e.target.files || []);
                            if (files.length === 0) return;
                            setUploadingVariantIndex(idx);
                            const uploaded: string[] = [];
                            try {
                              for (const file of files) {
                                try {
                                  const compressed = await compressImage(file);
                                  const url = await uploadProductImage(compressed);
                                  uploaded.push(url);
                                } catch (err: any) {
                                  showError(err?.response?.data?.error || `Failed to upload ${file.name}`);
                                }
                              }
                              if (uploaded.length > 0) {
                                setColorVariants((prev) => {
                                  const updated = [...prev];
                                  updated[idx] = { ...updated[idx], images: [...updated[idx].images, ...uploaded] };
                                  return updated;
                                });
                              }
                            } finally {
                              setUploadingVariantIndex(null);
                              e.target.value = '';
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setDeleteProductId(null);
        }}
      />
    </div>
  );
};

export default ProductManager;