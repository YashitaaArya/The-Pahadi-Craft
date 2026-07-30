import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, Shield } from 'lucide-react';
import { useAdminDashboardStore } from '../../store/adminDashboardStore';
import { DashboardLoadingSkeleton, EmptyState } from './common';

const UserManager: React.FC = () => {
  const { users, loading, error, fetchUsers } = useAdminDashboardStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) {
    return <DashboardLoadingSkeleton />;
  }

  return (
    <div>
      <h2 className="text-2xl font-serif text-[#5A4232] mb-6">User Management</h2>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      {users.length === 0 ? (
        <EmptyState
          title="No customers yet"
          description="Customers who sign up or check out will show up here."
          type="empty"
        />
      ) : (
        <div className="grid gap-6">
          {users.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#F5E9DA] flex items-center justify-center">
                    <span className="text-xl font-medium text-[#5A4232]">
                      {user.name ? user.name.charAt(0) : '?'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{user.name || 'Unnamed'}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  <Shield className="w-4 h-4" />
                  <span className="capitalize">{user.role}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManager;
