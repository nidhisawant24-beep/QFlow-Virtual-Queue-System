import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Lock, Save, ShieldCheck } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { name, phone };
    if (password) {
      payload.password = password;
    }
    await updateProfile(payload);
    setPassword('');
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      <div className="mb-10 pb-6 border-b border-plum-200/40 dark:border-plum-800/40">
        <h1 className="text-3xl sm:text-4xl font-serif font-normal text-plum-900 dark:text-cream-50">
          Account Profile & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-plum-700/80 dark:text-cream-200/70 mt-1 font-sans">
          Manage your personal identity, contact details, and account security
        </p>
      </div>

      <div className="rounded-32 border border-plum-200/40 dark:border-plum-800/60 bg-cream-100/70 dark:bg-plum-900/40 p-8 sm:p-10 shadow-soft">
        <form onSubmit={handleSubmit} className="space-y-5 font-sans">
          <div>
            <label className="block text-xs font-semibold text-plum-700 dark:text-cream-200 uppercase tracking-wider mb-1.5">
              Email Address (Account Identifier)
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-plum-400 dark:text-cream-300" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full pl-11 pr-4 py-2.5 rounded-full border border-plum-200/40 dark:border-plum-800/60 bg-cream-200/40 dark:bg-plum-950/40 text-plum-500 dark:text-cream-300/60 text-sm cursor-not-allowed"
              />
            </div>
            <span className="text-[11px] text-plum-500 dark:text-cream-400/70 mt-1.5 block">
              Email address is locked for verified authentication.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-plum-700 dark:text-cream-200 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-plum-400 dark:text-cream-300" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-50 dark:bg-plum-950 text-plum-900 dark:text-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-plum-700 dark:text-cream-200 uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-plum-400 dark:text-cream-300" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555-0199"
                className="w-full pl-11 pr-4 py-2.5 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-50 dark:bg-plum-950 text-plum-900 dark:text-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-plum-700 dark:text-cream-200 uppercase tracking-wider mb-1.5">
              New Password (leave blank to keep current)
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-plum-400 dark:text-cream-300" />
              <input
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-2.5 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-50 dark:bg-plum-950 text-plum-900 dark:text-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>
          </div>

          <div className="pt-5 border-t border-plum-200/30 dark:border-plum-800/40 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-sage-700 dark:text-sage-400 font-medium">
              <ShieldCheck className="h-4 w-4" />
              Encrypted Profile
            </span>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs font-semibold text-cream-50 bg-plum-900 hover:bg-terracotta-600 disabled:opacity-50 transition-all shadow-soft-sm"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
