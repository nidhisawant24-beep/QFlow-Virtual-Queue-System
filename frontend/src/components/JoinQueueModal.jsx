import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Users, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

const JoinQueueModal = ({ isOpen, onClose, queue, business }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setCustomerName(user.name || '');
      setCustomerPhone(user.phone || '');
      setCustomerEmail(user.email || '');
    }
  }, [user, isOpen]);

  if (!queue) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      toast.error('Please provide your name');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/tokens/join', {
        queueId: queue._id,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        notes: notes.trim(),
      });

      if (res.data.success) {
        toast.success(`Success! You received token ${res.data.data.token.tokenNumber}`);
        onClose();
        navigate(`/token/${res.data.data.token._id}`);
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to join queue';
      toast.error(msg);
      if (error.response?.data?.existingToken) {
        onClose();
        navigate(`/token/${error.response.data.existingToken._id}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Join Virtual Queue"
      maxWidth="max-w-lg"
    >
      {/* Queue Summary Box */}
      <div className="p-5 rounded-28 bg-[#F6F1E7] dark:bg-[#2D1B2C] border border-[#EDE4D6] dark:border-[#3D2539] mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-bold text-[#231522] dark:text-[#FBF8F2] text-base">
              {queue.name}
            </h4>
            <p className="text-xs text-[#C3532B] dark:text-[#E28555] font-medium mt-0.5">
              {business?.businessName || business?.name} • {queue.department}
            </p>
          </div>
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#F4CEBC] text-[#8C3415] dark:bg-[#3D1D16] dark:text-[#F4CEBC]">
            {queue.code || queue.prefix}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#EDE4D6] dark:border-[#3D2539]">
          <div className="flex items-center gap-2 text-xs text-[#685465] dark:text-[#D8CAB9]">
            <Users className="h-4 w-4 text-[#C3532B]" />
            <span>
              <strong>{queue.waitingCount || 0}</strong> in waiting line
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#685465] dark:text-[#D8CAB9]">
            <Clock className="h-4 w-4 text-[#C3532B]" />
            <span>
              ~<strong>{(queue.waitingCount || 0) * (queue.estimatedTimePerPerson || 10)} min</strong> wait
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#7A6777] dark:text-[#C5B5C3] uppercase tracking-wider mb-1.5">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="e.g. Alex Morgan"
            className="w-full px-4 py-3 rounded-2xl border border-[#EDE4D6] dark:border-[#3D2539] bg-white dark:bg-[#1A101A] text-[#231522] dark:text-white placeholder-[#9E8C9B] text-sm focus:outline-none focus:ring-2 focus:ring-[#C3532B] transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#7A6777] dark:text-[#C5B5C3] uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+1 555-0199"
              className="w-full px-4 py-3 rounded-2xl border border-[#EDE4D6] dark:border-[#3D2539] bg-white dark:bg-[#1A101A] text-[#231522] dark:text-white placeholder-[#9E8C9B] text-sm focus:outline-none focus:ring-2 focus:ring-[#C3532B] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#7A6777] dark:text-[#C5B5C3] uppercase tracking-wider mb-1.5">
              Email (optional)
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full px-4 py-3 rounded-2xl border border-[#EDE4D6] dark:border-[#3D2539] bg-white dark:bg-[#1A101A] text-[#231522] dark:text-white placeholder-[#9E8C9B] text-sm focus:outline-none focus:ring-2 focus:ring-[#C3532B] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#7A6777] dark:text-[#C5B5C3] uppercase tracking-wider mb-1.5">
            Service Notes / Preferences
          </label>
          <textarea
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Need assistance with prescription, table for 2..."
            className="w-full px-4 py-3 rounded-2xl border border-[#EDE4D6] dark:border-[#3D2539] bg-white dark:bg-[#1A101A] text-[#231522] dark:text-white placeholder-[#9E8C9B] text-sm focus:outline-none focus:ring-2 focus:ring-[#C3532B] transition-all"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-[#685465] dark:text-[#D8CAB9] pt-1">
          <ShieldCheck className="h-4 w-4 text-[#587356] flex-shrink-0" />
          <span>Real-time digital ticket with arrival estimations</span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-5 border-t border-[#EDE4D6] dark:border-[#3D2539]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#685465] dark:text-[#D8CAB9] hover:bg-[#F2ECE1] dark:hover:bg-[#2D1B2C] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-[#FBF8F2] bg-[#C3532B] hover:bg-[#231522] disabled:opacity-50 transition-all shadow-soft"
          >
            {loading ? 'Issuing Ticket...' : 'Get My Token'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default JoinQueueModal;
