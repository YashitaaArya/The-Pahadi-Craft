import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Check, MailOpen } from 'lucide-react';
import axios from 'axios';
import { DashboardLoadingSkeleton, EmptyState, showError, showSuccess } from './common';

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

  const authHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return { Authorization: `Bearer ${token}` };
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/contact`, { headers: authHeaders() });
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

  const markStatus = async (id: string, status: ContactMessage['status']) => {
    try {
      await axios.patch(`${BASE_URL}/contact/${id}`, { status }, { headers: authHeaders() });
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
      showSuccess('Updated');
    } catch {
      showError('Failed to update');
    }
  };

  if (loading) return <DashboardLoadingSkeleton />;

  return (
    <div>
      <h2 className="text-2xl font-serif text-[#5A4232] mb-2">Contact Messages</h2>
      <p className="text-sm text-gray-500 mb-6">
        Submissions from the website's Contact page. Each one is also emailed to pahadicraft@gmail.com when sent.
      </p>

      {messages.length === 0 ? (
        <EmptyState title="No messages yet" description="Contact form submissions will show up here." type="empty" />
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-[#5A4232]">{m.name}</p>
                  <a href={`mailto:${m.email}`} className="text-sm text-gray-500 hover:text-[#C9A66B]">{m.email}</a>
                  {m.subject && <p className="text-sm text-gray-600 mt-1">Subject: {m.subject}</p>}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full capitalize flex-shrink-0 ${
                  m.status === 'new' ? 'bg-blue-100 text-blue-700' :
                  m.status === 'responded' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {m.status}
                </span>
              </div>
              <p className="text-gray-700 text-sm mt-3 whitespace-pre-wrap">{m.message}</p>
              <div className="flex items-center gap-3 mt-4 pt-3 border-t text-sm">
                <span className="text-gray-400">{new Date(m.createdAt).toLocaleString()}</span>
                <a
                  href={`mailto:${m.email}?subject=Re: ${m.subject || 'Your message to Pahadi Craft'}`}
                  onClick={() => markStatus(m.id, 'responded')}
                  className="flex items-center gap-1 text-[#5A4232] hover:text-[#C9A66B] ml-auto"
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
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactMessages;