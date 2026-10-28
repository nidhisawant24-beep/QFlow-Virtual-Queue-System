import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useSocket } from '../context/SocketContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Badge from '../components/Badge';
import toast from 'react-hot-toast';
import {
  Bell,
  Clock,
  Users,
  MapPin,
  Building2,
  AlertTriangle,
  ArrowLeft,
  XCircle,
  PartyPopper,
  Volume2,
} from 'lucide-react';

const LiveTokenPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { socket, joinToken, joinQueue } = useSocket();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const fetchTokenStatus = async () => {
    try {
      const res = await api.get(`/tokens/${id}/status`);
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch token status:', error);
      toast.error('Could not load token status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenStatus();
  }, [id]);

  // Audio tone generator for browser when token is called
  const playAlertChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880.0, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      console.log('Audio chime not supported without user interaction');
    }
  };

  // Socket.IO subscriptions
  useEffect(() => {
    if (!socket || !id) return;

    joinToken(id);

    if (data?.token?.queue?._id) {
      joinQueue(data.token.queue._id);
    }

    const handleCalled = (payload) => {
      fetchTokenStatus();
      if (payload.tokenId === id || payload.tokenNumber === data?.token?.tokenNumber) {
        playAlertChime();
        toast.success(`🎉 IT'S YOUR TURN! Please proceed to the service counter!`, {
          duration: 10000,
          icon: '🔔',
        });
      }
    };

    const handleStatusChanged = (payload) => {
      fetchTokenStatus();
      if (payload.status === 'completed') {
        toast.success('Your service has been completed!');
      } else if (payload.status === 'skipped') {
        toast.error('Your token was skipped by the operator.');
      }
    };

    const handleQueueUpdated = () => {
      fetchTokenStatus();
    };

    socket.on('token_called', handleCalled);
    socket.on('token_status_changed', handleStatusChanged);
    socket.on('queue_updated', handleQueueUpdated);

    return () => {
      socket.off('token_called', handleCalled);
      socket.off('token_status_changed', handleStatusChanged);
      socket.off('queue_updated', handleQueueUpdated);
    };
  }, [socket, id, data?.token?.queue?._id, soundEnabled]);

  const handleCancelTicket = async () => {
    if (!window.confirm('Are you sure you want to cancel your queue ticket?')) {
      return;
    }

    setCancelling(true);
    try {
      const res = await api.delete(`/tokens/${id}`);
      if (res.data.success) {
        toast.success('Ticket cancelled');
        fetchTokenStatus();
      }
    } catch (error) {
      toast.error('Failed to cancel ticket');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Connecting to live queue stream..." />;
  }

  if (!data || !data.token) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Token Not Found
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          This token reference is invalid or has expired.
        </p>
        <Link
          to="/explore"
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-brand-600 text-white"
        >
          Explore Places
        </Link>
      </div>
    );
  }

  const { token, status, position, peopleAhead, estimatedWaitTimeMinutes, currentServingToken } = data;
  const isServing = status === 'serving';
  const isWaiting = status === 'waiting';
  const isCompleted = status === 'completed';
  const isCancelled = status === 'cancelled';
  const isSkipped = status === 'skipped';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
      {/* Top back navigation */}
      <div className="flex items-center justify-between mb-8">
        <Link
          to={`/business/${token.business?._id}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-plum-700 dark:text-cream-200 bg-cream-100/80 dark:bg-plum-900/60 border border-plum-200/40 dark:border-plum-800/60 hover:bg-cream-200/80 dark:hover:bg-plum-800/80 transition-colors shadow-soft-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {token.business?.businessName || 'Business Page'}
        </Link>

        <button
          onClick={() => {
            setSoundEnabled((prev) => !prev);
            toast.success(soundEnabled ? 'Chime sound muted' : 'Chime sound enabled');
          }}
          className={`flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full border transition-colors shadow-soft-sm ${
            soundEnabled
              ? 'border-terracotta-200 bg-terracotta-100/70 text-terracotta-800 dark:border-terracotta-800 dark:bg-terracotta-950/60 dark:text-terracotta-200'
              : 'border-plum-200/40 bg-cream-100/60 text-plum-500 dark:border-plum-800 dark:bg-plum-900/40'
          }`}
        >
          <Volume2 className="h-3.5 w-3.5" />
          <span>{soundEnabled ? 'Chime Active' : 'Muted'}</span>
        </button>
      </div>

      {/* Serving Celebration Alert Banner */}
      {isServing && (
        <div className="mb-8 p-5 rounded-32 bg-plum-900 text-cream-50 border-2 border-terracotta-500 shadow-soft-lg flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-terracotta-500 flex items-center justify-center text-white">
              <PartyPopper className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-normal tracking-wide text-white">
                NOW SERVING: IT'S YOUR TURN!
              </h4>
              <p className="text-xs text-cream-200/80 mt-0.5">
                Please proceed directly to {token.queue?.name} ({token.queue?.department}).
              </p>
            </div>
          </div>
          <Bell className="h-5 w-5 text-terracotta-400 animate-spin" />
        </div>
      )}

      {/* Main Digital Ticket Card */}
      <div className="relative rounded-32 border border-plum-200/40 dark:border-plum-800/60 bg-cream-100/70 dark:bg-plum-900/40 shadow-soft-lg overflow-hidden mb-8">
        {/* Ticket Header in Luxury Deep Plum */}
        <div className="p-8 sm:p-10 bg-plum-900 text-cream-50 relative">
          {/* Subtle architectural background circle cutout */}
          <div className="absolute right-0 top-0 w-44 h-44 rounded-full bg-terracotta-600/10 pointer-events-none -mr-16 -mt-16" />

          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-terracotta-400 block mb-1 font-sans">
                Electronic Queue Pass
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-normal">
                {token.business?.businessName || token.business?.name}
              </h2>
              <p className="text-xs text-cream-200/70 mt-1 font-sans">
                {token.queue?.name} • Desk: {token.queue?.department}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full bg-cream-50/10 backdrop-blur-md text-sage-300 border border-white/10">
                <span className="h-1.5 w-1.5 rounded-full bg-sage-400 live-indicator" />
                Live Sync
              </span>
              <span className="text-[10px] text-cream-300/60 font-sans">
                Issued {new Date(token.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Token Hero Number matching reference A-102 card */}
          <div className="mt-8 text-center py-6 px-4 bg-cream-50/10 rounded-28 backdrop-blur-sm border border-white/10 relative z-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-terracotta-300 block mb-2 font-sans">
              Your Queue Token
            </span>
            <div className="text-6xl sm:text-7xl font-sans font-black tracking-tight text-cream-50 drop-shadow-sm">
              {token.tokenNumber}
            </div>
            <div className="text-xs text-cream-200/80 font-medium mt-2 font-sans">
              Guest: {token.customerName}
            </div>
          </div>
        </div>

        {/* Status & Live Estimates Body */}
        <div className="p-6 sm:p-10 font-sans">
          <div className="flex items-center justify-between pb-6 border-b border-plum-200/40 dark:border-plum-800/40 mb-8">
            <span className="text-xs font-semibold text-plum-600 dark:text-cream-300 uppercase tracking-wider">
              Current Pass Status
            </span>
            <Badge status={status} size="md" />
          </div>

          {/* Live Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="p-5 rounded-28 bg-cream-50 dark:bg-plum-950/60 border border-plum-200/30 dark:border-plum-800/40 text-center">
              <div className="flex justify-center text-terracotta-600 dark:text-terracotta-400 mb-1.5">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-plum-400 dark:text-cream-300 block">
                Now Serving
              </span>
              <span className="text-2xl font-black text-plum-900 dark:text-white mt-1 block">
                {currentServingToken || 'None'}
              </span>
            </div>

            <div className="p-5 rounded-28 bg-cream-50 dark:bg-plum-950/60 border border-plum-200/30 dark:border-plum-800/40 text-center">
              <div className="flex justify-center text-plum-700 dark:text-cream-200 mb-1.5">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-plum-400 dark:text-cream-300 block">
                Ahead of You
              </span>
              <span className="text-2xl font-bold text-plum-900 dark:text-white mt-1 block">
                {isWaiting ? `${peopleAhead} ${peopleAhead === 1 ? 'guest' : 'guests'}` : '0'}
              </span>
            </div>

            <div className="p-5 rounded-28 bg-cream-50 dark:bg-plum-950/60 border border-plum-200/30 dark:border-plum-800/40 text-center">
              <div className="flex justify-center text-sage-600 dark:text-sage-400 mb-1.5">
                <Clock className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-plum-400 dark:text-cream-300 block">
                Estimated Wait
              </span>
              <span className="text-2xl font-bold text-sage-700 dark:text-sage-400 mt-1 block">
                {isWaiting ? `~${estimatedWaitTimeMinutes}m` : isServing ? 'Ready Now' : 'Completed'}
              </span>
            </div>
          </div>

          {/* Progress explanation */}
          {isWaiting && (
            <div className="p-5 rounded-28 bg-terracotta-100/60 dark:bg-plum-950/80 border border-terracotta-200/60 dark:border-plum-800 mb-8">
              <div className="flex items-center gap-2 text-xs font-semibold text-terracotta-800 dark:text-terracotta-300 mb-1">
                <span className="h-2 w-2 rounded-full bg-terracotta-500 live-indicator" />
                Live Dynamic Queue Flow
              </div>
              <p className="text-xs text-plum-700/80 dark:text-cream-200/70 leading-relaxed">
                You are #{position} in this queue. Relax freely nearby—we will play an alert chime when your number is called.
              </p>
            </div>
          )}

          {/* Business location info */}
          <div className="rounded-28 border border-plum-200/40 dark:border-plum-800/40 bg-cream-50/50 dark:bg-plum-950/40 p-5 space-y-2 text-xs text-plum-700 dark:text-cream-200 mb-8">
            {token.business?.businessAddress && (
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-terracotta-500 flex-shrink-0" />
                <span>{token.business.businessAddress}</span>
              </div>
            )}
            {token.notes && (
              <div className="pt-2 border-t border-plum-200/30 dark:border-plum-800/30 text-plum-600 dark:text-cream-300/80">
                <strong>Your Notes:</strong> {token.notes}
              </div>
            )}
          </div>

          {/* Action buttons */}
          {isWaiting && (
            <div className="flex justify-end">
              <button
                onClick={handleCancelTicket}
                disabled={cancelling}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-100/60 dark:hover:bg-rose-950/40 transition-colors"
              >
                <XCircle className="h-4 w-4" />
                {cancelling ? 'Cancelling...' : 'Cancel Queue Pass'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveTokenPage;
