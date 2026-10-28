import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useSocket } from '../context/SocketContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Badge from '../components/Badge';
import JoinQueueModal from '../components/JoinQueueModal';
import {
  MapPin,
  Clock,
  Phone,
  Users,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const BusinessDetailPage = () => {
  const { id } = useParams();
  const { socket, joinQueue, leaveQueue } = useSocket();

  const [business, setBusiness] = useState(null);
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBusinessDetails = async () => {
    try {
      const res = await api.get(`/businesses/${id}`);
      if (res.data.success) {
        setBusiness(res.data.data.business);
        setQueues(res.data.data.queues);
      }
    } catch (error) {
      console.error('Failed to load business details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessDetails();
  }, [id]);

  // Real-time listener for queues
  useEffect(() => {
    if (!socket || queues.length === 0) return;

    queues.forEach((q) => joinQueue(q._id));

    const handleQueueUpdate = () => {
      fetchBusinessDetails();
    };

    socket.on('queue_updated', handleQueueUpdate);
    socket.on('token_called', handleQueueUpdate);

    return () => {
      queues.forEach((q) => leaveQueue(q._id));
      socket.off('queue_updated', handleQueueUpdate);
      socket.off('token_called', handleQueueUpdate);
    };
  }, [socket, queues.length]);

  const handleOpenJoinModal = (queue) => {
    setSelectedQueue(queue);
    setIsModalOpen(true);
  };

  if (loading) {
    return <LoadingSpinner text="Loading business queues..." />;
  }

  if (!business) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Business Not Found
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          The requested business profile does not exist or may have been removed.
        </p>
        <Link
          to="/explore"
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-brand-600 text-white"
        >
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      {/* Back button */}
      <Link
        to="/explore"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-plum-700 dark:text-cream-200 bg-cream-100/80 dark:bg-plum-900/60 border border-plum-200/40 dark:border-plum-800/60 hover:bg-cream-200/80 dark:hover:bg-plum-800/80 mb-8 transition-colors shadow-soft-sm"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to all places
      </Link>

      {/* Business Hero Card */}
      <div className="rounded-32 border border-plum-200/40 dark:border-plum-800/60 bg-cream-100/70 dark:bg-plum-900/40 p-6 sm:p-10 shadow-soft mb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-plum-200/40 dark:border-plum-800/40">
          <div className="flex items-center gap-5">
            {business.businessLogo ? (
              <img
                src={business.businessLogo}
                alt="Logo"
                className="h-20 w-20 rounded-28 object-cover border border-plum-200/60 dark:border-plum-800 shadow-md"
              />
            ) : (
              <div className="h-20 w-20 rounded-28 bg-terracotta-500 text-white flex items-center justify-center font-serif text-3xl shadow-md">
                {(business.businessName || business.name).charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal text-plum-900 dark:text-cream-50">
                  {business.businessName || business.name}
                </h1>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-terracotta-100 text-terracotta-800 dark:bg-terracotta-950/60 dark:text-terracotta-300">
                  {business.businessCategory}
                </span>
              </div>
              <p className="text-xs text-plum-600 dark:text-cream-300/80 flex items-center gap-2 font-sans">
                <span>Managed by {business.name}</span>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-sage-700 dark:text-sage-400 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-sage-500 live-indicator" />
                  Live Sync Active
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Details row */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans">
          {business.businessAddress && (
            <div className="flex items-start gap-3 text-plum-700 dark:text-cream-200">
              <MapPin className="h-4 w-4 text-terracotta-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-plum-900 dark:text-white mb-0.5">Physical Address</span>
                <span className="leading-relaxed">{business.businessAddress}</span>
              </div>
            </div>
          )}

          {business.businessHours && (
            <div className="flex items-start gap-3 text-plum-700 dark:text-cream-200">
              <Clock className="h-4 w-4 text-terracotta-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-plum-900 dark:text-white mb-0.5">Operating Hours</span>
                <span>
                  {business.businessHours.open} - {business.businessHours.close}
                </span>
              </div>
            </div>
          )}

          {business.phone && (
            <div className="flex items-start gap-3 text-plum-700 dark:text-cream-200">
              <Phone className="h-4 w-4 text-terracotta-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-plum-900 dark:text-white mb-0.5">Reception Counter</span>
                <span>{business.phone}</span>
              </div>
            </div>
          )}
        </div>

        {business.businessDescription && (
          <p className="mt-8 pt-8 border-t border-plum-200/40 dark:border-plum-800/40 text-xs sm:text-sm text-plum-700/80 dark:text-cream-200/70 leading-relaxed font-sans">
            {business.businessDescription}
          </p>
        )}
      </div>

      {/* Available Queues Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-normal text-plum-900 dark:text-cream-50">
              Available Virtual Queues
            </h2>
            <p className="text-xs sm:text-sm text-plum-700/80 dark:text-cream-200/70 mt-1 font-sans">
              Select an open desk below to receive your digital ticket with live status updates.
            </p>
          </div>
          <span className="text-xs font-medium px-4 py-1.5 rounded-full bg-cream-200/70 dark:bg-plum-800/60 text-plum-900 dark:text-cream-100 self-start sm:self-auto">
            {queues.length} Service {queues.length === 1 ? 'Desk' : 'Desks'} Active
          </span>
        </div>

        {queues.length === 0 ? (
          <div className="p-10 text-center rounded-32 bg-cream-100/70 dark:bg-plum-900/40 border border-plum-200/40 dark:border-plum-800/60">
            <AlertCircle className="h-8 w-8 text-terracotta-500 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-plum-900 dark:text-white">
              No queues opened today yet
            </h4>
            <p className="text-xs text-plum-600 dark:text-cream-300/80 mt-1">
              Please check back shortly during regular business hours.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {queues.map((q) => {
              const isOpen = q.status === 'open' && q.isAcceptingTokens;
              return (
                <div
                  key={q._id}
                  className="rounded-32 border border-plum-200/40 dark:border-plum-800/60 bg-cream-100/70 dark:bg-plum-900/40 p-7 shadow-soft flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-serif text-xl font-normal text-plum-900 dark:text-white">
                          {q.name}
                        </h3>
                        <p className="text-xs font-semibold text-terracotta-600 dark:text-terracotta-400 mt-0.5">
                          {q.department} • Code: {q.code || q.prefix}
                        </p>
                      </div>
                      <Badge status={q.status} />
                    </div>

                    {q.description && (
                      <p className="text-xs text-plum-700/80 dark:text-cream-200/70 mb-5 leading-relaxed font-sans">
                        {q.description}
                      </p>
                    )}

                    {/* Live metrics strip */}
                    <div className="grid grid-cols-3 gap-3 p-4 rounded-28 bg-cream-50/80 dark:bg-plum-950/60 border border-plum-200/30 dark:border-plum-800/40 my-4 text-center font-sans">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-plum-400 dark:text-cream-300 block mb-1">
                          Now Serving
                        </span>
                        <span className="text-lg font-black text-terracotta-600 dark:text-terracotta-400">
                          {q.currentServingToken || 'None'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-plum-400 dark:text-cream-300 block mb-1">
                          Waiting Line
                        </span>
                        <span className="text-lg font-bold text-plum-900 dark:text-white">
                          {q.waitingCount || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-plum-400 dark:text-cream-300 block mb-1">
                          Est. Wait
                        </span>
                        <span className="text-lg font-bold text-sage-700 dark:text-sage-400">
                          ~{(q.waitingCount || 0) * (q.estimatedTimePerPerson || 10)}m
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-plum-200/30 dark:border-plum-800/40 flex items-center justify-between">
                    <span className="text-xs text-plum-600 dark:text-cream-300/80 font-sans">
                      Capacity: {q.capacity} max
                    </span>
                    <button
                      onClick={() => handleOpenJoinModal(q)}
                      disabled={!isOpen}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold text-cream-50 bg-plum-900 hover:bg-terracotta-600 dark:bg-plum-800 dark:hover:bg-terracotta-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-soft-sm"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      {isOpen ? 'Join Virtual Queue' : 'Queue Closed'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Join Queue Modal */}
      <JoinQueueModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        queue={selectedQueue}
        business={business}
      />
    </div>
  );
};

export default BusinessDetailPage;
