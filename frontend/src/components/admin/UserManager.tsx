import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, Shield, Download, Loader2, Phone } from 'lucide-react';
import { useAdminDashboardStore } from '../../store/adminDashboardStore';
import { DashboardLoadingSkeleton, EmptyState, showError, showSuccess } from './common';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const UserManager: React.FC = () => {
  const { users, loading, error, fetchUsers } = useAdminDashboardStore();
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await axios.get(`${BASE_URL}/users/export`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      const dateStamp = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `pahadi-craft-customers-${dateStamp}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showSuccess('Customer data exported');
    } catch (err: any) {
      showError('Failed to export customer data');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <DashboardLoadingSkeleton />;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h2 className="text-2xl font-serif text-[#5A4232]">User Management</h2>
        <button
          onClick={handleExport}
          disabled={exporting || users.length === 0}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-[#C9A66B] text-[#5A4232] rounded-lg text-sm hover:bg-[#F5E9DA] transition-colors disabled:opacity-50"
        >
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {exporting ? 'Exporting...' : 'Export All to Excel'}
        </button>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {users.length === 0 ? (
        <EmptyState
          title="No customers yet"
          description="Customers who sign up or check out will show up here."
          type="empty"
        />
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{users.length} customer{users.length !== 1 ? 's' : ''} to date</p>
          <div className="grid gap-4">
            {users.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-[#F5E9DA] flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-medium text-[#5A4232]">
                        {user.name ? user.name.charAt(0) : '?'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium text-lg truncate">{user.name || 'Unnamed'}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span className="break-all">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 w-fit flex-shrink-0 ${
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
        </>
      )}
    </div>
  );
};

export default UserManager;