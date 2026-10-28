import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useSocket } from '../../context/SocketContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';
import {
  Plus,
  Play,
  Pause,
  StopCircle,
  Settings,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const BusinessManageQueuesPage = () => {
  const { socket } = useSocket();
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [prefix, setPrefix] = useState('Q');
  const [estimatedTimePerPerson, setEstimatedTimePerPerson] = useState('10');
  const [capacity, setCapacity] = useState('50');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  // Edit Modal
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingQueue, setEditingQueue] = useState(null);

  const fetchQueues = async () => {
    try {
      const res = await api.get('/queues/my-queues');
      if (res.data.success) {
        setQueues(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load queues:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueues();
  }, []);

  // Real-time updates
  useEffect(() => {
    if (!socket) return;
    socket.on('queue_updated', fetchQueues);
    return () => {
      socket.off('queue_updated', fetchQueues);
    };
  }, [socket]);

  // Handle Status Update: open, paused, closed
  const handleStatusChange = async (queueId, newStatus) => {
    try {
      const res = await api.patch(`/queues/${queueId}/status`, { status: newStatus });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchQueues();
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  // Handle Create Queue
  const handleCreateQueue = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Queue name is required');
      return;
    }

    setCreating(true);
    try {
      const res = await api.post('/queues', {
        name: name.trim(),
        department: department.trim() || 'General Service',
        prefix: prefix.trim().toUpperCase() || 'Q',
        estimatedTimePerPerson: Number(estimatedTimePerPerson) || 10,
        capacity: Number(capacity) || 50,
        description: description.trim(),
      });

      if (res.data.success) {
        toast.success('New queue created!');
        setIsCreateOpen(false);
        setName('');
        setDepartment('');
        setDescription('');
        fetchQueues();
      }
    } catch (error) {
      toast.error('Failed to create queue');
    } finally {
      setCreating(false);
    }
  };

  // Handle Edit Queue
  const handleUpdateQueue = async (e) => {
    e.preventDefault();
    if (!editingQueue) return;

    try {
      const res = await api.put(`/queues/${editingQueue._id}`, {
        name: editingQueue.name,
        department: editingQueue.department,
        estimatedTimePerPerson: editingQueue.estimatedTimePerPerson,
        capacity: editingQueue.capacity,
        description: editingQueue.description,
      });

      if (res.data.success) {
        toast.success('Queue parameters updated');
        setIsEditOpen(false);
        setEditingQueue(null);
        fetchQueues();
      }
    } catch (error) {
      toast.error('Failed to update queue');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading service desks..." />;
  }

  return (
    <div className="space-y-8 p-6 lg:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-plum-200/40 dark:border-plum-800/40">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-normal text-plum-900 dark:text-cream-50">
            Manage Queues & Service Desks
          </h2>
          <p className="text-xs sm:text-sm text-plum-700/80 dark:text-cream-200/70 mt-1 font-sans">
            Create, pause, resume, or close virtual queues across your departments
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-cream-50 bg-plum-900 hover:bg-terracotta-600 dark:bg-plum-800 dark:hover:bg-terracotta-600 transition-all shadow-soft-sm self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Create New Queue
        </button>
      </div>

      {/* Queues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {queues.map((q) => {
          const isOpen = q.status === 'open';
          const isPaused = q.status === 'paused';
          const isClosed = q.status === 'closed';

          return (
            <div
              key={q._id}
              className="rounded-32 border border-plum-200/40 dark:border-plum-800/60 bg-cream-100/70 dark:bg-plum-900/40 p-7 shadow-soft flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-serif text-lg font-normal text-plum-900 dark:text-white">
                      {q.name}
                    </h3>
                    <p className="text-xs text-terracotta-600 dark:text-terracotta-400 font-semibold font-sans mt-0.5">
                      {q.department} • Code: {q.code || q.prefix}
                    </p>
                  </div>
                  <Badge status={q.status} size="xs" />
                </div>

                {q.description && (
                  <p className="text-xs text-plum-700/80 dark:text-cream-200/70 line-clamp-2 mb-4 leading-relaxed font-sans">
                    {q.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-3 p-4 rounded-28 bg-cream-50/80 dark:bg-plum-950/60 border border-plum-200/30 dark:border-plum-800/40 my-4 text-xs font-sans">
                  <div>
                    <span className="text-[10px] text-plum-400 dark:text-cream-300 font-semibold uppercase block">
                      Waiting in line
                    </span>
                    <span className="text-lg font-bold text-plum-900 dark:text-white">
                      {q.waitingCount || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-plum-400 dark:text-cream-300 font-semibold uppercase block">
                      Max Capacity
                    </span>
                    <span className="text-lg font-bold text-plum-900 dark:text-white">
                      {q.capacity || 50}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-plum-400 dark:text-cream-300 font-semibold uppercase block">
                      Est. Per Person
                    </span>
                    <span className="text-sm font-bold text-plum-800 dark:text-cream-200">
                      {q.estimatedTimePerPerson || 10}m
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-plum-400 dark:text-cream-300 font-semibold uppercase block">
                      Served Today
                    </span>
                    <span className="text-sm font-bold text-sage-700 dark:text-sage-400">
                      {q.servedTodayCount || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Controls */}
              <div className="pt-4 border-t border-plum-200/30 dark:border-plum-800/40 space-y-2">
                <div className="grid grid-cols-3 gap-2 text-xs font-sans">
                  {/* Open / Resume */}
                  <button
                    onClick={() => handleStatusChange(q._id, 'open')}
                    disabled={isOpen}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-full font-semibold transition-colors ${
                      isOpen
                        ? 'bg-sage-100 text-sage-900 dark:bg-sage-950 dark:text-sage-300 cursor-default'
                        : 'bg-cream-200/70 dark:bg-plum-800 text-plum-800 dark:text-cream-200 hover:bg-sage-100 dark:hover:bg-sage-950/40'
                    }`}
                  >
                    <Play className="h-3 w-3" />
                    Open
                  </button>

                  {/* Pause */}
                  <button
                    onClick={() => handleStatusChange(q._id, 'paused')}
                    disabled={isPaused}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-full font-semibold transition-colors ${
                      isPaused
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 cursor-default'
                        : 'bg-cream-200/70 dark:bg-plum-800 text-plum-800 dark:text-cream-200 hover:bg-amber-100 dark:hover:bg-amber-950/40'
                    }`}
                  >
                    <Pause className="h-3 w-3" />
                    Pause
                  </button>

                  {/* Close */}
                  <button
                    onClick={() => handleStatusChange(q._id, 'closed')}
                    disabled={isClosed}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-full font-semibold transition-colors ${
                      isClosed
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 cursor-default'
                        : 'bg-cream-200/70 dark:bg-plum-800 text-plum-800 dark:text-cream-200 hover:bg-rose-100 dark:hover:bg-rose-950/40'
                    }`}
                  >
                    <StopCircle className="h-3 w-3" />
                    Close
                  </button>
                </div>

                <button
                  onClick={() => {
                    setEditingQueue(q);
                    setIsEditOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-semibold text-plum-700 dark:text-cream-200 hover:bg-cream-200/60 dark:hover:bg-plum-800/60 transition-colors"
                >
                  <Settings className="h-3.5 w-3.5 text-terracotta-500" />
                  Edit Parameters
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Queue Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Virtual Queue"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateQueue} className="space-y-4 font-sans">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-plum-700 dark:text-cream-200 mb-1">
              Queue Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. VIP Teller Desk 1, Pediatric OPD, or Table Waitlist"
              className="w-full px-4 py-2.5 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-50 dark:bg-plum-950 text-plum-900 dark:text-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-plum-700 dark:text-cream-200 mb-1">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Diagnostics, Cash Counter"
                className="w-full px-4 py-2.5 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-50 dark:bg-plum-950 text-plum-900 dark:text-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-plum-700 dark:text-cream-200 mb-1">
                Token Prefix
              </label>
              <input
                type="text"
                maxLength={4}
                value={prefix}
                onChange={(e) => setPrefix(e.target.value.toUpperCase())}
                placeholder="e.g. Q, DOC, VIP"
                className="w-full px-4 py-2.5 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-50 dark:bg-plum-950 text-plum-900 dark:text-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-plum-700 dark:text-cream-200 mb-1">
                Est. Time / Customer (min)
              </label>
              <input
                type="number"
                min="1"
                value={estimatedTimePerPerson}
                onChange={(e) => setEstimatedTimePerPerson(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-50 dark:bg-plum-950 text-plum-900 dark:text-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-plum-700 dark:text-cream-200 mb-1">
                Queue Capacity Limit
              </label>
              <input
                type="number"
                min="5"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-50 dark:bg-plum-950 text-plum-900 dark:text-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-plum-700 dark:text-cream-200 mb-1">
              Description / Instructions for Customers
            </label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Please bring valid photo identification"
              className="w-full px-4 py-2.5 rounded-28 border border-plum-200/60 dark:border-plum-800 bg-cream-50 dark:bg-plum-950 text-plum-900 dark:text-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-plum-200/30 dark:border-plum-800/40">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-5 py-2.5 rounded-full text-xs font-medium text-plum-700 dark:text-cream-200 hover:bg-cream-200/60 dark:hover:bg-plum-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-6 py-2.5 rounded-full text-xs font-semibold text-cream-50 bg-plum-900 hover:bg-terracotta-600 disabled:opacity-50 transition-all shadow-soft-sm"
            >
              {creating ? 'Creating...' : 'Create Queue'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Queue Modal */}
      {editingQueue && (
        <Modal
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setEditingQueue(null);
          }}
          title={`Edit Queue: ${editingQueue.name}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleUpdateQueue} className="space-y-4 font-sans">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-plum-700 dark:text-cream-200 mb-1">
                Queue Name
              </label>
              <input
                type="text"
                required
                value={editingQueue.name}
                onChange={(e) =>
                  setEditingQueue({ ...editingQueue, name: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-50 dark:bg-plum-950 text-sm text-plum-900 dark:text-cream-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-plum-700 dark:text-cream-200 mb-1">
                Department
              </label>
              <input
                type="text"
                value={editingQueue.department}
                onChange={(e) =>
                  setEditingQueue({ ...editingQueue, department: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-50 dark:bg-plum-950 text-sm text-plum-900 dark:text-cream-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-plum-700 dark:text-cream-200 mb-1">
                  Est. Minutes / Person
                </label>
                <input
                  type="number"
                  min="1"
                  value={editingQueue.estimatedTimePerPerson}
                  onChange={(e) =>
                    setEditingQueue({
                      ...editingQueue,
                      estimatedTimePerPerson: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-50 dark:bg-plum-950 text-sm text-plum-900 dark:text-cream-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-plum-700 dark:text-cream-200 mb-1">
                  Capacity Limit
                </label>
                <input
                  type="number"
                  min="5"
                  value={editingQueue.capacity}
                  onChange={(e) =>
                    setEditingQueue({ ...editingQueue, capacity: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-50 dark:bg-plum-950 text-sm text-plum-900 dark:text-cream-50"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-plum-200/30 dark:border-plum-800/40">
              <button
                type="button"
                onClick={() => {
                  setIsEditOpen(false);
                  setEditingQueue(null);
                }}
                className="px-5 py-2.5 rounded-full text-xs font-medium text-plum-700 dark:text-cream-200 hover:bg-cream-200/60 dark:hover:bg-plum-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full text-xs font-semibold text-cream-50 bg-plum-900 hover:bg-terracotta-600 transition-all shadow-soft-sm"
              >
                Save Parameters
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default BusinessManageQueuesPage;
