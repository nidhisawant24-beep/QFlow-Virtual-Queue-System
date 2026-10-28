import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import Badge from '../../components/Badge';
import EmptyState from '../../components/EmptyState';
import toast from 'react-hot-toast';
import {
  Users,
  Search,
  Phone,
  Clock,
  CheckCircle2,
  FastForward,
  XCircle,
  PlayCircle,
  RefreshCw,
  UserCheck,
  Radio,
} from 'lucide-react';

const BusinessLiveQueuePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQueueId = searchParams.get('queueId');

  const { socket, joinQueue, leaveQueue } = useSocket();
  const { user } = useAuth();

  const [queues, setQueues] = useState([]);
  const [selectedQueueId, setSelectedQueueId] = useState(initialQueueId || '');
  const [queueDetails, setQueueDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('waiting'); // 'waiting' or 'completed'
  const [completedTokens, setCompletedTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  // Load business queues
  const fetchMyQueues = async () => {
    try {
      const res = await api.get('/queues/my-queues');
      if (res.data.success && res.data.data.length > 0) {
        setQueues(res.data.data);
        if (!selectedQueueId) {
          setSelectedQueueId(res.data.data[0]._id);
        }
      }
    } catch (error) {
      console.error('Failed to load queues:', error);
    }
  };

  // Load single queue details & tokens
  const fetchQueueDetails = async (qId) => {
    if (!qId) return;
    try {
      const res = await api.get(`/queues/${qId}`);
      if (res.data.success) {
        setQueueDetails(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load queue details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load completed tokens for tab
  const fetchCompletedTokens = async (qId) => {
    if (!qId) return;
    try {
      const res = await api.get(`/tokens/completed/${qId}`);
      if (res.data.success) {
        setCompletedTokens(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load completed tokens:', error);
    }
  };

  useEffect(() => {
    fetchMyQueues();
  }, []);

  useEffect(() => {
    if (selectedQueueId) {
      setLoading(true);
      fetchQueueDetails(selectedQueueId);
      if (activeTab === 'completed') {
        fetchCompletedTokens(selectedQueueId);
      }
    }
  }, [selectedQueueId, activeTab]);

  // Socket sync
  useEffect(() => {
    if (!socket || !selectedQueueId) return;
    joinQueue(selectedQueueId);

    const handleUpdate = () => {
      fetchQueueDetails(selectedQueueId);
      if (activeTab === 'completed') {
        fetchCompletedTokens(selectedQueueId);
      }
    };

    socket.on('queue_updated', handleUpdate);
    socket.on('token_called', handleUpdate);
    socket.on('token_status_changed', handleUpdate);

    return () => {
      leaveQueue(selectedQueueId);
      socket.off('queue_updated', handleUpdate);
      socket.off('token_called', handleUpdate);
      socket.off('token_status_changed', handleUpdate);
    };
  }, [socket, selectedQueueId, activeTab]);

  // Handle Call Next Customer
  const handleCallNext = async () => {
    if (!selectedQueueId) return;
    setActionLoading(true);
    try {
      const res = await api.post('/tokens/call-next', { queueId: selectedQueueId });
      if (res.data.success) {
        if (res.data.nextToken) {
          toast.success(`Now calling Token ${res.data.nextToken.tokenNumber}!`);
        } else {
          toast(res.data.message, { icon: 'ℹ️' });
        }
        fetchQueueDetails(selectedQueueId);
      }
    } catch (error) {
      toast.error('Failed to call next token');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Skip
  const handleSkip = async (tokenId) => {
    try {
      const res = await api.post(`/tokens/${tokenId}/skip`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchQueueDetails(selectedQueueId);
      }
    } catch (error) {
      toast.error('Failed to skip token');
    }
  };

  // Handle Remove / Cancel
  const handleRemove = async (tokenId) => {
    if (!window.confirm('Remove this customer from the queue?')) return;
    try {
      const res = await api.delete(`/tokens/${tokenId}`);
      if (res.data.success) {
        toast.success('Token removed');
        fetchQueueDetails(selectedQueueId);
      }
    } catch (error) {
      toast.error('Failed to remove token');
    }
  };

  // Token Search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    try {
      const res = await api.get('/tokens/search', {
        params: { query: searchQuery.trim(), queueId: selectedQueueId },
      });
      if (res.data.success) {
        setSearchResults(res.data.data);
      }
    } catch (error) {
      toast.error('Search failed');
    }
  };

  if (loading && !queueDetails) {
    return <LoadingSpinner text="Connecting to operator dispatch..." />;
  }

  const currentServing = queueDetails?.currentServing;
  const waitingTokens = queueDetails?.waitingTokens || [];
  const currentQueue = queueDetails?.queue;

  return (
    <div className="space-y-8 p-6 lg:p-10 max-w-7xl mx-auto">
      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-32 bg-cream-100/70 dark:bg-plum-900/40 border border-plum-200/40 dark:border-plum-800/60 shadow-soft">
        {/* Queue Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-plum-500 dark:text-cream-300">
            Active Desk:
          </label>
          <select
            value={selectedQueueId}
            onChange={(e) => {
              setSelectedQueueId(e.target.value);
              setSearchParams({ queueId: e.target.value });
            }}
            className="px-4 py-2 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-50 dark:bg-plum-950 text-xs font-semibold text-plum-900 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-terracotta-500 shadow-soft-sm"
          >
            {queues.map((q) => (
              <option key={q._id} value={q._id}>
                {q.name} ({q.department}) • Code: {q.code}
              </option>
            ))}
          </select>

          {currentQueue && <Badge status={currentQueue.status} size="xs" />}
        </div>

        {/* Search Token Input */}
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-plum-400 dark:text-cream-300" />
            <input
              type="text"
              placeholder="Search token # or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-50 dark:bg-plum-950 text-xs text-plum-900 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-terracotta-500 w-56 shadow-soft-sm placeholder-plum-400 dark:placeholder-cream-300/60"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold rounded-full bg-cream-200/80 dark:bg-plum-800/80 text-plum-900 dark:text-cream-100 hover:bg-cream-300/80 transition-colors"
          >
            Find
          </button>
          {searchResults && (
            <button
              type="button"
              onClick={() => {
                setSearchResults(null);
                setSearchQuery('');
              }}
              className="text-xs text-plum-500 hover:text-plum-800 dark:text-cream-300 dark:hover:text-white underline ml-1"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Search Results Dropdown Overlay */}
      {searchResults && (
        <div className="p-5 rounded-28 bg-terracotta-100/70 dark:bg-plum-950/80 border border-terracotta-200/80 dark:border-plum-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-terracotta-900 dark:text-terracotta-200">
              Found {searchResults.length} Search Result(s) for "{searchQuery}"
            </h4>
            <button
              onClick={() => setSearchResults(null)}
              className="text-xs text-terracotta-700 dark:text-terracotta-300 hover:underline"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {searchResults.map((st) => (
              <div
                key={st._id}
                className="p-3 rounded-28 bg-cream-50 dark:bg-plum-900 border border-plum-200/40 dark:border-plum-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-black text-terracotta-600 dark:text-terracotta-400">{st.tokenNumber}</span>
                  <div className="text-plum-900 dark:text-cream-50 font-medium">{st.customerName}</div>
                </div>
                <Badge status={st.status} size="xs" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hero: Currently Serving Operator Station - Matching Reference A-102 Card */}
      <div className="rounded-32 border border-terracotta-500/20 bg-plum-900 text-cream-50 p-8 sm:p-10 shadow-soft-lg relative overflow-hidden">
        {/* Subtle decorative architectural curve */}
        <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-terracotta-600/10 pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          {/* Active Serving Info */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream-50/10 backdrop-blur-md text-[11px] font-semibold text-terracotta-300 mb-4 border border-white/10">
              <Radio className="h-3 w-3 text-sage-400 animate-pulse" />
              Counter Operator Active • {currentQueue?.department}
            </div>

            <div className="flex items-baseline gap-4 mt-1">
              <span className="text-xs font-bold uppercase tracking-widest text-cream-300/80 font-sans">
                Now Serving:
              </span>
              <span className="text-5xl sm:text-7xl font-sans font-black tracking-tight text-cream-50 drop-shadow-sm">
                {currentServing ? currentServing.tokenNumber : 'None'}
              </span>
            </div>

            {currentServing ? (
              <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-cream-200/80 font-sans">
                <span className="font-semibold text-cream-50 text-sm">
                  Customer: {currentServing.customerName}
                </span>
                {currentServing.customerPhone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-terracotta-400" />
                    {currentServing.customerPhone}
                  </span>
                )}
                {currentServing.calledAt && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-sage-400" />
                    Called at {new Date(currentServing.calledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            ) : (
              <p className="mt-3 text-xs text-cream-300/70 font-sans">
                No customer is currently called at the counter. Click "Call Next Customer" to advance.
              </p>
            )}
          </div>

          {/* Action Operator Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {currentServing && (
              <button
                onClick={() => handleSkip(currentServing._id)}
                className="px-5 py-3.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/20 text-cream-50 transition-all flex items-center justify-center gap-2"
              >
                <FastForward className="h-4 w-4" />
                Skip Customer
              </button>
            )}

            <button
              onClick={handleCallNext}
              disabled={actionLoading}
              className="px-8 py-4 rounded-full text-sm font-bold text-cream-50 bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-50 transition-all shadow-soft-md flex items-center justify-center gap-2.5"
            >
              <UserCheck className="h-5 w-5" />
              {actionLoading
                ? 'Calling...'
                : currentServing
                ? 'Complete & Call Next'
                : 'Call Next Customer'}
            </button>
          </div>
        </div>
      </div>

      {/* Queue Lists: Tabs for Waiting vs Completed */}
      <div className="rounded-32 border border-plum-200/40 dark:border-plum-800/60 bg-cream-100/70 dark:bg-plum-900/40 shadow-soft overflow-hidden">
        {/* Tabs Bar */}
        <div className="flex items-center justify-between border-b border-plum-200/40 dark:border-plum-800/40 px-6 sm:px-8 pt-5">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('waiting')}
              className={`pb-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'waiting'
                  ? 'border-plum-900 text-plum-900 dark:text-cream-50 dark:border-terracotta-500'
                  : 'border-transparent text-plum-500 hover:text-plum-900 dark:text-cream-300/70'
              }`}
            >
              <span>Waiting List</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-terracotta-100 text-terracotta-800 dark:bg-plum-800 dark:text-cream-100 font-bold">
                {waitingTokens.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('completed')}
              className={`pb-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'completed'
                  ? 'border-plum-900 text-plum-900 dark:text-cream-50 dark:border-terracotta-500'
                  : 'border-transparent text-plum-500 hover:text-plum-900 dark:text-cream-300/70'
              }`}
            >
              <span>Completed / History Today</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-cream-200/70 dark:bg-plum-800 text-plum-700 dark:text-cream-300 font-bold">
                {completedTokens.length}
              </span>
            </button>
          </div>

          <button
            onClick={() => {
              fetchQueueDetails(selectedQueueId);
              if (activeTab === 'completed') fetchCompletedTokens(selectedQueueId);
            }}
            title="Refresh List"
            className="p-2 text-plum-400 hover:text-plum-800 dark:text-cream-300 rounded-full hover:bg-cream-200/60 dark:hover:bg-plum-800/60 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {/* Tab 1: Waiting List */}
        {activeTab === 'waiting' && (
          <div>
            {waitingTokens.length === 0 ? (
              <EmptyState
                icon={Users}
                title="Queue is currently clear"
                description="There are no waiting customers in line for this queue."
              />
            ) : (
              <div className="divide-y divide-plum-200/30 dark:divide-plum-800/40">
                {waitingTokens.map((t, index) => (
                  <div
                    key={t._id}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-cream-50/60 dark:hover:bg-plum-950/40 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Sequence Badge */}
                      <span className="flex items-center justify-center h-8 w-8 rounded-full bg-cream-200/70 dark:bg-plum-800 text-xs font-bold text-plum-800 dark:text-cream-200">
                        #{index + 1}
                      </span>

                      {/* Token Big Tag */}
                      <div className="h-11 w-20 rounded-28 bg-terracotta-100/70 dark:bg-plum-950 text-terracotta-800 dark:text-terracotta-300 flex items-center justify-center font-black text-lg border border-terracotta-200/80 dark:border-plum-800 font-sans shadow-soft-sm">
                        {t.tokenNumber}
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-plum-900 dark:text-white font-serif">
                          {t.customerName}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-plum-600 dark:text-cream-300/80 mt-0.5 font-sans">
                          {t.customerPhone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {t.customerPhone}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Joined {new Date(t.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {t.notes && (
                          <div className="text-[11px] text-terracotta-600 dark:text-terracotta-400 mt-1 font-sans">
                            Note: {t.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSkip(t._id)}
                        className="px-4 py-2 rounded-full text-xs font-semibold text-plum-700 dark:text-cream-200 hover:bg-cream-200/60 dark:hover:bg-plum-800 border border-plum-200/60 dark:border-plum-800 transition-colors"
                      >
                        Skip
                      </button>
                      <button
                        onClick={() => handleRemove(t._id)}
                        className="p-2 rounded-full text-plum-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Remove from queue"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Completed / History */}
        {activeTab === 'completed' && (
          <div>
            {completedTokens.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="No completed tokens yet"
                description="Customers served today will appear here."
              />
            ) : (
              <div className="divide-y divide-plum-200/30 dark:divide-plum-800/40">
                {completedTokens.map((t) => (
                  <div
                    key={t._id}
                    className="p-5 flex items-center justify-between text-xs hover:bg-cream-50/60 dark:hover:bg-plum-950/40 font-sans"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-16 rounded-full bg-cream-200/60 dark:bg-plum-800 text-plum-800 dark:text-cream-200 flex items-center justify-center font-bold">
                        {t.tokenNumber}
                      </div>
                      <div>
                        <div className="font-bold text-plum-900 dark:text-white">
                          {t.customerName}
                        </div>
                        <div className="text-[11px] text-plum-500 dark:text-cream-400">
                          {new Date(t.updatedAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {t.actualWaitTimeMinutes > 0 && (
                        <span className="text-plum-600 dark:text-cream-300">
                          {t.actualWaitTimeMinutes}m wait
                        </span>
                      )}
                      <Badge status={t.status} size="xs" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessLiveQueuePage;
