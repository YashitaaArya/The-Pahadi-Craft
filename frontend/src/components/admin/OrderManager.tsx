import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Package, Check, X, Truck } from 'lucide-react';
import { useAdminDashboardStore } from '../../store/adminDashboardStore';
import { getDriveImage } from '../../utils/driveImage';
import { DashboardLoadingSkeleton, EmptyState } from './common';
import type { Order } from '../../types';

const OrderManager: React.FC = () => {
  const { orders, loading, error, fetchOrders, updateOrderStatus } = useAdminDashboardStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-green-500" />;
      case 'delivered':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-green-200 text-green-900';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <DashboardLoadingSkeleton />;
  }

  return (
    <div>
      <h2 className="text-2xl font-serif text-[#5A4232] mb-6">Order Management</h2>
      {error && (
        <p className="text-red-600 text-sm mb-4">{error}</p>
      )}
      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Orders placed through checkout will show up here."
          type="empty"
        />
      ) : (
      <div className="grid gap-6">
        {orders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium text-lg">Order #{order.id}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="capitalize">{order.status}</span>
              </div>
            </div>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={`${item.product.id}-${item.product.selectedColorVariant?.sku || item.product.selectedColorVariant?.colorName || ''}-${item.product.selectedFragranceVariant?.sku || item.product.selectedFragranceVariant?.fragranceName || ''}`} className="flex items-center gap-4">
                  <img
                    src={getDriveImage(item.product.image)}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    {item.product.selectedColorVariant && <p className="text-sm text-gray-500">Color: {item.product.selectedColorVariant.colorName}</p>}
                    {item.product.selectedFragranceVariant && <p className="text-sm text-gray-500">Fragrance: {item.product.selectedFragranceVariant.fragranceName}</p>}
                    <p className="text-[#C9A66B]">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-xl font-medium">${order.total.toFixed(2)}</p>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                  className="px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C9A66B]"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      )}
    </div>
  );
};

export default OrderManager;