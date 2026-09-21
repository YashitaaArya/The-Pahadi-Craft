import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Check, MailOpen, Search, Trash2, X } from 'lucide-react';
import axios from 'axios';
import { DashboardLoadingSkeleton, EmptyState, ConfirmationDialog, showError, showSuccess } from './common';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'responded';
  createdAt: string;
}

const ContactMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const authHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return { Authorization: `Bearer ${token}` };
  };

  const load = async (searchTerm = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/contact`, {
        headers: authHeaders(),
        params: searchTerm ? { search: searchTerm } : {},
      });
      setMessages(res.data);
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Debounced search so we're not firing a request on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      load(search.trim());
      setSelectedIds(new Set());
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const markStatus = async (id: string, status: ContactMessage['status']) => {
    try {
      await axios.patch(`${BASE_URL}/contact/${id}`, { status }, { headers: authHeaders() });
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
      showSuccess('Updated');
    } catch {
      showError('Failed to update');
    }
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      const allIds = messages.map((m) => m.id);
      const allSelected = allIds.length > 0 && allIds.every((id) => prev.has(id));
      return allSelected ? new Set() : new Set(allIds);
    });
  };

  const confirmBulkDelete = async () => {
    setDeleting(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/contact/bulk-delete`,
        { ids: Array.from(selectedIds) },
        { headers: authHeaders() }
      );
      showSuccess(`Deleted ${res.data.deletedCount} message${res.data.deletedCount !== 1 ? 's' : ''}`);
      setSelectedIds(new Set());
      setBulkDeleteOpen(false);
      load(search.trim());
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Failed to delete the selected messages');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
        <h2 className="text-2xl font-serif text-[#5A4232]">Contact Messages</h2>
        {selectedIds.size > 0 && (
          <button
            onClick={() => setBulkDeleteOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected ({selectedIds.size})
          </button>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Submissions from the website's Contact page. Each one is also emailed to pahadicraft@gmail.com when sent.
      </p>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, subject, or message..."
          className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A66B] focus:border-transparent"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {loading ? (
        <DashboardLoadingSkeleton />
      ) : messages.length === 0 ? (
        <EmptyState
          title={search ? 'No matching messages' : 'No messages yet'}
          description={search ? 'Try a different search term.' : 'Contact form submissions will show up here.'}
          type="empty"
        />
      ) : (
        <>
          <label className="flex items-center gap-2 px-1 mb-3 text-sm text-gray-500 cursor-pointer w-fit">
            <input
              type="checkbox"
              checked={messages.length > 0 && messages.every((m) => selectedIds.has(m.id))}
              onChange={toggleSelectAll}
              className="w-4 h-4 rounded border-gray-300 text-[#C9A66B]"
            />
            Select all {messages.length} shown
          </label>

          <div className="space-y-3">
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-lg shadow-sm p-4 sm:p-5 ${selectedIds.has(m.id) ? 'ring-2 ring-[#C9A66B]' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(m.id)}
                    onChange={() => toggleSelected(m.id)}
                    className="w-4 h-4 mt-1 rounded border-gray-300 text-[#C9A66B] flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-[#5A4232] truncate">{m.name}</p>
                        <a href={`mailto:${m.email}`} className="text-sm text-gray-500 hover:text-[#C9A66B] break-all">{m.email}</a>
                        {m.subject && <p className="text-sm text-gray-600 mt-1">Subject: {m.subject}</p>}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full capitalize flex-shrink-0 w-fit ${
                        m.status === 'new' ? 'bg-blue-100 text-blue-700' :
                        m.status === 'responded' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {m.status}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mt-3 whitespace-pre-wrap break-words">{m.message}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t text-sm">
                      <span className="text-gray-400 text-xs">{new Date(m.createdAt).toLocaleString()}</span>
                      <a
                        href={`mailto:${m.email}?subject=Re: ${m.subject || 'Your message to Pahadi Craft'}`}
                        onClick={() => markStatus(m.id, 'responded')}
                        className="flex items-center gap-1 text-[#5A4232] hover:text-[#C9A66B] sm:ml-auto"
                      >
                        <Mail size={14} />
                        Reply via email
                      </a>
                      {m.status !== 'read' && m.status !== 'responded' && (
                        <button onClick={() => markStatus(m.id, 'read')} className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                          <MailOpen size={14} />
                          Mark read
                        </button>
                      )}
                      {m.status !== 'responded' && (
                        <button onClick={() => markStatus(m.id, 'responded')} className="flex items-center gap-1 text-green-600 hover:text-green-800">
                          <Check size={14} />
                          Mark responded
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      <ConfirmationDialog
        isOpen={bulkDeleteOpen}
        title="Delete selected messages"
        message={`Are you sure you want to delete ${selectedIds.size} message${selectedIds.size !== 1 ? 's' : ''}? This cannot be undone.`}
        confirmText={deleting ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        isDangerous
        isLoading={deleting}
        onConfirm={confirmBulkDelete}
        onCancel={() => setBulkDeleteOpen(false)}
      />
    </div>
  );
};

export default ContactMessages;