import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, Users, Settings } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import ProductManager from './ProductManager';
import OrderManager from './OrderManager';
import UserManager from './UserManager';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('products');
  const { products, orders, users } = useAdminStore();

  const tabs = [
    { id: 'products', label: 'Products', icon: Package, count: products.length },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, count: orders.length },
    { id: 'users', label: 'Users', icon: Users, count: users.length },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen pt-20 bg-[#FFF8F2]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm"
        >
          <div className="border-b">
            <div className="flex space-x-8 p-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#5A4232] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="px-2 py-0.5 text-sm bg-[#C9A66B] text-white rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'products' && <ProductManager />}
            {activeTab === 'orders' && <OrderManager />}
            {activeTab === 'users' && <UserManager />}
            {activeTab === 'settings' && (
              <div className="text-center text-gray-500">
                Settings panel coming soon...
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;