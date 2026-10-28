import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { Ticket, Clock, ExternalLink, ArrowRight } from 'lucide-react';

const CustomerHistoryPage = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/tokens/my-history');
      if (res.data.success) {
        setTokens(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Retrieving your queue passes..." />;
  }

  const activeTokens = tokens.filter((t) => ['waiting', 'serving'].includes(t.status));
  const pastTokens = tokens.filter((t) => ['completed', 'skipped', 'cancelled'].includes(t.status));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <div className="mb-10 pb-6 border-b border-plum-200/40 dark:border-plum-800/40">
        <h1 className="text-3xl sm:text-4xl font-serif font-normal text-plum-900 dark:text-cream-50">
          My Queue Passes
        </h1>
        <p className="text-xs sm:text-sm text-plum-700/80 dark:text-cream-200/70 mt-1 font-sans">
          Review your current active tokens and past service history.
        </p>
      </div>

      {/* Active Tokens Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-lg font-serif font-normal text-plum-900 dark:text-cream-50">
            Active Tokens
          </h2>
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-terracotta-100 text-terracotta-800 dark:bg-plum-800 dark:text-terracotta-300">
            {activeTokens.length} Active
          </span>
        </div>

        {activeTokens.length === 0 ? (
          <div className="p-8 rounded-32 bg-cream-100/70 dark:bg-plum-900/40 border border-plum-200/40 dark:border-plum-800/60 text-center">
            <p className="text-xs text-plum-700/80 dark:text-cream-200/70">
              You are not currently in any waiting line.
            </p>
            <Link
              to="/explore"
              className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-terracotta-600 dark:text-terracotta-400 hover:text-terracotta-700"
            >
              Browse spaces & join a queue <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeTokens.map((t) => (
              <div
                key={t._id}
                className="p-6 rounded-32 border border-plum-200/40 dark:border-plum-800/60 bg-cream-100/70 dark:bg-plum-900/40 shadow-soft"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta-600 dark:text-terracotta-400 block mb-1">
                      {t.business?.businessName || t.business?.name}
                    </span>
                    <h3 className="text-2xl font-black text-plum-900 dark:text-white font-sans">
                      Token {t.tokenNumber}
                    </h3>
                    <p className="text-xs text-plum-600 dark:text-cream-300/80 mt-0.5">
                      {t.queue?.name}
                    </p>
                  </div>
                  <Badge status={t.status} />
                </div>

                <div className="pt-4 border-t border-plum-200/30 dark:border-plum-800/40 flex items-center justify-between text-xs font-sans">
                  <span className="text-plum-600 dark:text-cream-300/80">
                    Joined at {new Date(t.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <Link
                    to={`/token/${t._id}`}
                    className="inline-flex items-center gap-1.5 font-semibold text-terracotta-600 dark:text-terracotta-400 hover:underline"
                  >
                    Open Live Screen
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Tokens History */}
      <div>
        <h2 className="text-lg font-serif font-normal text-plum-900 dark:text-cream-50 mb-6">
          History & Past Visits
        </h2>

        {pastTokens.length === 0 ? (
          <EmptyState
            icon={Ticket}
            title="No past tokens yet"
            description="Completed tickets will appear here for your records."
          />
        ) : (
          <div className="rounded-32 border border-plum-200/40 dark:border-plum-800/60 bg-cream-100/70 dark:bg-plum-900/40 overflow-hidden shadow-soft">
            <div className="divide-y divide-plum-200/30 dark:divide-plum-800/40">
              {pastTokens.map((t) => (
                <div
                  key={t._id}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-cream-50/60 dark:hover:bg-plum-950/40 transition-colors font-sans"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-16 rounded-full bg-cream-200/70 dark:bg-plum-800 text-plum-900 dark:text-cream-100 flex items-center justify-center font-black text-sm">
                      {t.tokenNumber}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-plum-900 dark:text-white">
                        {t.business?.businessName || t.business?.name}
                      </h4>
                      <p className="text-xs text-plum-600 dark:text-cream-300/80">
                        {t.queue?.name} • {new Date(t.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {t.actualWaitTimeMinutes > 0 && (
                      <span className="text-xs text-plum-600 dark:text-cream-300 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-sage-600" />
                        {t.actualWaitTimeMinutes}m wait
                      </span>
                    )}
                    <Badge status={t.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerHistoryPage;
