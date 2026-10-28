import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layers, Mail, Lock, ArrowRight, Sparkles, User } from 'lucide-react';

const BusinessLoginPage = () => {
  const { loginBusiness } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await loginBusiness(email, password);
    setLoading(false);
    if (res.success) {
      navigate('/business/dashboard');
    }
  };

  const handleDemoLogin = async (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    setLoading(true);
    const res = await loginBusiness(demoEmail, 'password123');
    setLoading(false);
    if (res.success) {
      navigate('/business/dashboard');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-terracotta-500 text-cream-50 shadow-soft-sm font-serif text-xl font-normal">
              Q
            </div>
            <span className="font-serif text-2xl tracking-tight text-plum-900 dark:text-cream-50">
              QFlow<span className="text-terracotta-500">.</span>
            </span>
          </Link>
          <h2 className="text-2xl font-serif font-normal text-plum-900 dark:text-cream-50">
            Business Console Login
          </h2>
          <p className="text-xs text-plum-700/80 dark:text-cream-200/70 mt-1 font-sans">
            Access your queues, counter calling desk, and real-time analytics
          </p>
        </div>

        {/* 1-Click Demo Logins Grid */}
        <div className="mb-6 p-5 rounded-28 bg-terracotta-100/60 dark:bg-plum-900/60 border border-terracotta-200/80 dark:border-plum-800">
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-1.5 text-xs font-bold text-terracotta-800 dark:text-terracotta-300">
              <Sparkles className="h-3.5 w-3.5 text-terracotta-600" />
              1-Click Demo Accounts (Select Any Business)
            </span>
            <span className="text-[10px] text-terracotta-700 dark:text-terracotta-300 font-mono">pass: password123</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleDemoLogin('clinic@qflow.com')}
              className="p-3 text-left rounded-28 bg-cream-50 dark:bg-plum-950 text-plum-900 dark:text-cream-100 border border-plum-200/40 dark:border-plum-800 hover:border-terracotta-500 transition-colors shadow-soft-sm"
            >
              <div className="text-xs font-bold truncate">Metro Health Clinic</div>
              <div className="text-[10px] text-plum-500 dark:text-cream-300/70 truncate">Healthcare / OPD</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('bank@qflow.com')}
              className="p-3 text-left rounded-28 bg-cream-50 dark:bg-plum-950 text-plum-900 dark:text-cream-100 border border-plum-200/40 dark:border-plum-800 hover:border-terracotta-500 transition-colors shadow-soft-sm"
            >
              <div className="text-xs font-bold truncate">Apex National Bank</div>
              <div className="text-[10px] text-plum-500 dark:text-cream-300/70 truncate">Financial / Tellers</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('hospital@qflow.com')}
              className="p-3 text-left rounded-28 bg-cream-50 dark:bg-plum-950 text-plum-900 dark:text-cream-100 border border-plum-200/40 dark:border-plum-800 hover:border-terracotta-500 transition-colors shadow-soft-sm"
            >
              <div className="text-xs font-bold truncate">City Care Hospital</div>
              <div className="text-[10px] text-plum-500 dark:text-cream-300/70 truncate">Hospital / Diagnostics</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('restaurant@qflow.com')}
              className="p-3 text-left rounded-28 bg-cream-50 dark:bg-plum-950 text-plum-900 dark:text-cream-100 border border-plum-200/40 dark:border-plum-800 hover:border-terracotta-500 transition-colors shadow-soft-sm"
            >
              <div className="text-xs font-bold truncate">Gourmet Bistro & Grill</div>
              <div className="text-[10px] text-plum-500 dark:text-cream-300/70 truncate">Restaurant Waitlist</div>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-32 border border-plum-200/40 dark:border-plum-800/60 bg-cream-100/70 dark:bg-plum-900/40 p-8 shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-plum-700 dark:text-cream-200 uppercase tracking-wider mb-1.5">
                Business Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-plum-400 dark:text-cream-300" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@yourbusiness.com"
                  className="w-full pl-11 pr-4 py-2.5 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-50/80 dark:bg-plum-950/60 text-plum-900 dark:text-cream-50 placeholder-plum-400 dark:placeholder-cream-300/60 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-plum-700 dark:text-cream-200 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-plum-400 dark:text-cream-300" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-2.5 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-50/80 dark:bg-plum-950/60 text-plum-900 dark:text-cream-50 placeholder-plum-400 dark:placeholder-cream-300/60 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-xs font-semibold text-cream-50 bg-plum-900 hover:bg-terracotta-600 disabled:opacity-50 transition-all shadow-soft-sm mt-3"
            >
              {loading ? 'Entering Operator Console...' : 'Log In to Business Console'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-plum-200/40 dark:border-plum-800/40 text-center space-y-3">
            <p className="text-xs text-plum-700/80 dark:text-cream-200/70">
              New business on QFlow?{' '}
              <Link
                to="/business/register"
                className="font-semibold text-terracotta-600 dark:text-terracotta-400 hover:underline"
              >
                Register your business for free
              </Link>
            </p>

            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-plum-600 hover:text-plum-900 dark:text-cream-300 dark:hover:text-white transition-colors"
              >
                <User className="h-3.5 w-3.5 text-terracotta-500" />
                Looking for Customer Login? Click here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessLoginPage;
