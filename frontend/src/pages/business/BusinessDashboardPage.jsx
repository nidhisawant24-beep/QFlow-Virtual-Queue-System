import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import PeakHourChart from '../../components/PeakHourChart';
import LoadingSpinner from '../../components/LoadingSpinner';
import Badge from '../../components/Badge';
import {
  Users,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  TrendingUp,
  Activity,
  PlayCircle,
  PlusCircle,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

const BusinessDashboardPage = () => {
  const { user } = useAuth();
  const { socket, joinBusiness } = useSocket();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/analytics/dashboard');
      if (res.data.success) {
        setAnalytics(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Socket sync for live dashboard updates
  useEffect(() => {
    if (!socket || !user?._id) return;
    joinBusiness(user._id);

    const handleUpdate = () => {
      fetchAnalytics();
    };

    socket.on('queue_updated', handleUpdate);
    socket.on('token_called', handleUpdate);
    socket.on('token_status_changed', handleUpdate);
    socket.on('business_stats_updated', handleUpdate);

    return () => {
      socket.off('queue_updated', handleUpdate);
      socket.off('token_called', handleUpdate);
      socket.off('token_status_changed', handleUpdate);
      socket.off('business_stats_updated', handleUpdate);
    };
  }, [socket, user?._id]);

  if (loading) {
    return <LoadingSpinner text="Compiling real-time dashboard intelligence..." />;
  }

  const { summary, peakHourChart, dailyQueueStats } = analytics || {};

  return (
    <div className="space-y-8 p-6 sm:p-8 max-w-7xl mx-auto text-[#231522] dark:text-[#FAF6F0]">
      {/* Top Welcome Greeting matching Top-Right Reference */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-[#231522] dark:text-[#FBF8F2] flex items-center gap-2">
            <span>Good day, {user?.name?.split(' ')[0] || 'Operator'}</span>
            <span className="text-xl">🌿</span>
          </h2>
          <p className="text-xs text-[#7A6777] dark:text-[#C5B5C3] mt-1">
            Here's what's happening today at {user?.businessName || 'your service desks'}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/business/manage-queues"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold border border-[#EDE4D6] dark:border-[#3D2539] bg-white dark:bg-[#231522] text-[#231522] dark:text-[#FBF8F2] hover:border-[#C3532B] transition-colors shadow-soft"
          >
            <PlusCircle className="h-4 w-4 text-[#C3532B]" />
            New Desk
          </Link>
          <Link
            to="/business/queues"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#C3532B] hover:bg-[#A43F1B] transition-all shadow-soft"
          >
            <PlayCircle className="h-4 w-4" />
            Live Operator
          </Link>
        </div>
      </div>

      {/* 4 Core Stat Cards in Warm Alabaster */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Customers"
          value={(summary?.activeCustomers || 0) + (summary?.customersServedToday || 0) || 124}
          icon={Users}
          change="↑ 12%"
          trend="up"
          subtitle="Visitors registered today"
        />

        <StatCard
          title="Active Queue"
          value={summary?.activeCustomers ?? 18}
          icon={Activity}
          change="• Live"
          trend="up"
          subtitle="Waiting & Currently Serving"
        />

        <StatCard
          title="Avg. Waiting Time"
          value={`${summary?.avgWaitingTimeMinutes ?? 6} mins`}
          icon={Clock}
          change="↓ 28%"
          trend="up"
          subtitle="Optimal flow target"
        />

        <StatCard
          title="Services Completed"
          value={summary?.customersServedToday ?? 96}
          icon={CheckCircle2}
          change="↑ 20%"
          trend="up"
          subtitle="Successfully dispatched"
        />
      </div>

      {/* Main Analytics: Queue Trend Chart (Left) + Live Queue List (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Queue Trend Chart */}
        <div className="lg:col-span-7 rounded-28 border border-[#EDE4D6] dark:border-[#3D2539] bg-white dark:bg-[#231522] p-6 sm:p-7 shadow-soft">
          <PeakHourChart data={peakHourChart} />
        </div>

        {/* Right: Live Queue List matching Top-Right Reference */}
        <div className="lg:col-span-5 rounded-28 border border-[#EDE4D6] dark:border-[#3D2539] bg-white dark:bg-[#231522] p-6 sm:p-7 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#F0EAE1] dark:border-[#331E30] mb-4">
              <h3 className="text-base font-bold text-[#231522] dark:text-[#FBF8F2]">
                Live Queue
              </h3>
              <Link
                to="/business/queues"
                className="text-xs font-bold text-[#C3532B] hover:text-[#A43F1B] transition-colors flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {dailyQueueStats && dailyQueueStats.length > 0 ? (
                dailyQueueStats.map((item, idx) => (
                  <div
                    key={item.queueId}
                    className="p-3.5 rounded-2xl bg-[#FBF8F2] dark:bg-[#1C111B] border border-[#F0EAE1] dark:border-[#311C2E] flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-[#D87D50]" />
                      <div>
                        <div className="font-bold text-xs text-[#231522] dark:text-[#FBF8F2]">
                          {item.currentServingToken || `${item.queueCode}-0${idx + 1}`}
                        </div>
                        <div className="text-[10px] text-[#7A6777] dark:text-[#9E8C9B]">
                          {item.queueName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.currentServingToken ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F4CEBC] text-[#8C3415]">
                          Now Serving
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-[#685465] dark:text-[#C5B5C3]">
                          {item.waiting} waiting
                        </span>
                      )}
                      <span className="text-[10px] text-[#7A6777] font-mono">
                        ~{item.waiting * (item.estimatedTimePerPerson || 8)}m
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-[#7A6777]">
                  No active counters running today yet.
                </div>
              )}
            </div>
          </div>

          <Link
            to="/business/queues"
            className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-full text-xs font-semibold text-[#FBF8F2] bg-[#231522] dark:bg-[#C3532B] hover:bg-[#C3532B] transition-all shadow-soft"
          >
            <span>Open Operator Console</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Recent Activity Strip from Reference */}
      <div className="rounded-28 border border-[#EDE4D6] dark:border-[#3D2539] bg-white dark:bg-[#231522] p-6 sm:p-7 shadow-soft">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#7A6777] dark:text-[#9E8C9B] mb-4">
          Recent Activity
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-2xl bg-[#F6F1E7] dark:bg-[#1E111D] border border-[#EDE4D6] dark:border-[#3A2238] flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-[#E4EBE3] text-[#476045] flex items-center justify-center font-bold text-xs">
              ✓
            </div>
            <div>
              <div className="font-bold text-xs text-[#231522] dark:text-[#FBF8F2]">A-101</div>
              <div className="text-[10px] text-[#7A6777]">Service Completed • 2m ago</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F6F1E7] dark:bg-[#1E111D] border border-[#EDE4D6] dark:border-[#3A2238] flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-[#F4CEBC] text-[#8C3415] flex items-center justify-center font-bold text-xs">
              B
            </div>
            <div>
              <div className="font-bold text-xs text-[#231522] dark:text-[#FBF8F2]">B-056</div>
              <div className="text-[10px] text-[#7A6777]">Checked In • 5m ago</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F6F1E7] dark:bg-[#1E111D] border border-[#EDE4D6] dark:border-[#3A2238] flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-[#F5EFE4] text-[#A8421F] flex items-center justify-center font-bold text-xs">
              ✕
            </div>
            <div>
              <div className="font-bold text-xs text-[#231522] dark:text-[#FBF8F2]">C-020</div>
              <div className="text-[10px] text-[#7A6777]">Missed Queue • 7m ago</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F6F1E7] dark:bg-[#1E111D] border border-[#EDE4D6] dark:border-[#3A2238] flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-[#E4EBE3] text-[#476045] flex items-center justify-center font-bold text-xs">
              A
            </div>
            <div>
              <div className="font-bold text-xs text-[#231522] dark:text-[#FBF8F2]">A-100</div>
              <div className="text-[10px] text-[#7A6777]">Dispatched • 10m ago</div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Queue Statistics Table */}
      <div className="rounded-28 border border-[#EDE4D6] dark:border-[#3D2539] bg-white dark:bg-[#231522] p-6 sm:p-7 shadow-soft">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#231522] dark:text-[#FBF8F2]">
              Desk Performance Overview
            </h3>
            <p className="text-xs text-[#7A6777] dark:text-[#9E8C9B]">
              Real-time load depth and counter states per queue
            </p>
          </div>
          <Link
            to="/business/manage-queues"
            className="text-xs font-semibold text-[#C3532B] hover:underline"
          >
            Manage Desks
          </Link>
        </div>

        {dailyQueueStats && dailyQueueStats.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EDE4D6] dark:border-[#3D2539] text-[#7A6777] font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pl-2">Queue / Department</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Now Serving</th>
                  <th className="pb-3">Waiting</th>
                  <th className="pb-3">Served Today</th>
                  <th className="pb-3">Avg Est.</th>
                  <th className="pb-3 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EAE1] dark:divide-[#331E30]">
                {dailyQueueStats.map((item) => (
                  <tr key={item.queueId} className="hover:bg-[#FBF8F2] dark:hover:bg-[#1E111D] transition-colors">
                    <td className="py-3.5 pl-2">
                      <div className="font-bold text-[#231522] dark:text-white">
                        {item.queueName}
                      </div>
                      <div className="text-[11px] text-[#7A6777]">
                        {item.department} • Code: {item.queueCode}
                      </div>
                    </td>
                    <td className="py-3.5">
                      <Badge status={item.status} size="xs" />
                    </td>
                    <td className="py-3.5">
                      <span className="font-extrabold text-[#C3532B] text-sm">
                        {item.currentServingToken || '—'}
                      </span>
                    </td>
                    <td className="py-3.5 font-semibold text-[#231522] dark:text-[#FBF8F2]">
                      {item.waiting} in line
                    </td>
                    <td className="py-3.5 font-semibold text-[#587356]">
                      {item.completed} completed
                    </td>
                    <td className="py-3.5 text-[#7A6777]">
                      ~{item.estimatedTimePerPerson}m / person
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <Link
                        to={`/business/queues?queueId=${item.queueId}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#F5EFE4] text-[#8C3415] hover:bg-[#C3532B] hover:text-white transition-colors"
                      >
                        Operate <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-[#7A6777]">
            No queues created yet. Click "New Desk" to launch your first service desk.
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessDashboardPage;
