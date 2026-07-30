import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Filter, ChevronDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAdminDashboardStore } from '../../store/adminDashboardStore';
import { Product } from '../../types';
import { getDriveImage } from '../../utils/driveImage';
import {
  Modal,
  ConfirmationDialog,
  EmptyState,
  LoadingSkeleton,
  showSuccess,
  showError,
} from './common';

const CATEGORIES = [
  'Candles',
  'Premium',
  'Occult',
  'Soaps',
  'Fragrances',
  'Resin',
  'Metal Crafts',
  'Terracotta',
  'Figurines',
  'Home Decor',
  'Glass Jars',
  'Oils',
  'Others',
];

const SUBCATEGORIES: Record<string, string[]> = {
  Candles: ['Pillar', 'Jar', 'Figurine', 'Premium', 'Romantic'],
  Soaps: ['Handmade', 'Luxury', 'Natural', 'Organic'],
  Fragrances: ['Oils', 'Sprays', 'Diffusers'],
  Resin: ['Decorative', 'Jewelry', 'Functional'],
  'Metal Crafts': ['Decorative', 'Functional', 'Premium'],
  Terracotta: ['Pots', 'Decorative', 'Lamps'],
  Figurines: ['Small', 'Medium', 'Large'],
  'Home Decor': ['Candles', 'Figurines', 'Art'],
  'Glass Jars': ['Small', 'Medium', 'Large'],
  Oils: ['Essential', 'Fragrance', 'Natural'],
  Others: ['Miscellaneous'],
};

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

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ProductFormData>(
    {
      defaultValues: editingProduct || {
        name: '',
        description: '',
        price: 0,
        category: '',
        subcategory: '',
        stock: 0,
        sku: '',
        image: '',
        featured: false,
        trending: false,
        additionalImagesText: '',
      },
    }
  );

  const selectedCategory = watch('category');
  const currentSubcategories = selectedCategory ? SUBCATEGORIES[selectedCategory] || [] : [];

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
      filtered = filtered.filter(p => p.category === filterCategory);
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
      reset({
        name: '',
        description: '',
        price: 0,
        category: '',
        subcategory: '',
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

      const payload: Product = {
        ...rest,
        image: normalizedImage,
        additionalImages: parsedAdditionalImages,
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
          {CATEGORIES.map(cat => (
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
                      <p className="font-semibold text-gray-900">{product.category}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select {...register('category', { required: 'Category is required' })} className="input">
                <option value="">Select Category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subcategory
              </label>
              <select {...register('subcategory')} className="input">
                <option value="">Select Subcategory</option>
                {currentSubcategories.map(subcat => (
                  <option key={subcat} value={subcat}>{subcat}</option>
                ))}
              </select>
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

          {/* Image URLs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image URL
            </label>
            <input
              type="url"
              {...register('image')}
              className="input"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Image URLs
            </label>
            <textarea
              {...register('additionalImagesText')}
              className="input resize-none"
              rows={3}
              placeholder="Enter one image URL per line or comma-separated"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate URLs with commas or new lines for multiple product images.
            </p>
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