import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Layers,
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  MapPin,
  ArrowRight,
  Clock,
} from 'lucide-react';

const categories = [
  'Hospital',
  'Clinic',
  'Bank',
  'Restaurant',
  'Salon',
  'Government Office',
  'Service Center',
  'Other',
];

const BusinessRegisterPage = () => {
  const { registerBusiness } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState('Clinic');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [openTime, setOpenTime] = useState('09:00 AM');
  const [closeTime, setCloseTime] = useState('06:00 PM');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await registerBusiness({
      name,
      email,
      password,
      phone,
      businessName,
      businessCategory,
      businessAddress,
      businessDescription,
      businessHours: {
        open: openTime,
        close: closeTime,
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      },
    });
    setLoading(false);
    if (res.success) {
      navigate('/business/dashboard');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-terracotta-500 text-cream-50 shadow-soft-sm font-serif text-xl font-normal">
              Q
            </div>
            <span className="font-serif text-2xl tracking-tight text-plum-900 dark:text-cream-50">
              QFlow<span className="text-terracotta-500">.</span>
            </span>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-serif font-normal text-plum-900 dark:text-cream-50">
            Register Your Business Queue
          </h2>
          <p className="text-xs text-plum-700/80 dark:text-cream-200/70 mt-1 font-sans">
            Empower your team with smart virtual ticketing in under 3 minutes
          </p>
        </div>

        <div className="rounded-32 border border-plum-200/40 dark:border-plum-800/60 bg-cream-100/70 dark:bg-plum-900/40 p-8 sm:p-10 shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Section 1: Business Identity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-plum-700 dark:text-cream-200 uppercase tracking-wider mb-1.5">
                  Business Name *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-plum-400 dark:text-cream-300" />
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Apex Medical Care"
                    className="w-full pl-11 pr-4 py-2.5 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-50/80 dark:bg-plum-950/60 text-plum-900 dark:text-cream-50 placeholder-plum-400 dark:placeholder-cream-300/60 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-plum-700 dark:text-cream-200 uppercase tracking-wider mb-1.5">
                  Industry Category *
                </label>
                <select
                  value={businessCategory}
                  onChange={(e) => setBusinessCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-50/80 dark:bg-plum-950/60 text-plum-900 dark:text-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Section 2: Manager & Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-plum-700 dark:text-cream-200 uppercase tracking-wider mb-1.5">
                  Manager / Admin Name *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-plum-400 dark:text-cream-300" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Arthur Pendelton"
                    className="w-full pl-11 pr-4 py-2.5 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-50/80 dark:bg-plum-950/60 text-plum-900 dark:text-cream-50 placeholder-plum-400 dark:placeholder-cream-300/60 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-plum-700 dark:text-cream-200 uppercase tracking-wider mb-1.5">
                  Contact Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-plum-400 dark:text-cream-300" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-11 pr-4 py-2.5 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-50/80 dark:bg-plum-950/60 text-plum-900 dark:text-cream-50 placeholder-plum-400 dark:placeholder-cream-300/60 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-plum-700 dark:text-cream-200 uppercase tracking-wider mb-1.5">
                  Official Business Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-plum-400 dark:text-cream-300" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@business.com"
                    className="w-full pl-11 pr-4 py-2.5 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-50/80 dark:bg-plum-950/60 text-plum-900 dark:text-cream-50 placeholder-plum-400 dark:placeholder-cream-300/60 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-plum-700 dark:text-cream-200 uppercase tracking-wider mb-1.5">
                  Account Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-plum-400 dark:text-cream-300" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-11 pr-4 py-2.5 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-50/80 dark:bg-plum-950/60 text-plum-900 dark:text-cream-50 placeholder-plum-400 dark:placeholder-cream-300/60 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Address */}
            <div>
              <label className="block text-xs font-semibold text-plum-700 dark:text-cream-200 uppercase tracking-wider mb-1.5">
                Physical Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-plum-400 dark:text-cream-300" />
                <input
                  type="text"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  placeholder="e.g. 742 Evergreen Terrace, Medical District"
                  className="w-full pl-11 pr-4 py-2.5 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-50/80 dark:bg-plum-950/60 text-plum-900 dark:text-cream-50 placeholder-plum-400 dark:placeholder-cream-300/60 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all"
                />
              </div>
            </div>

            {/* Section 5: Hours */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-plum-700 dark:text-cream-200 uppercase tracking-wider mb-1.5">
                  Opening Time
                </label>
                <input
                  type="text"
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                  placeholder="09:00 AM"
                  className="w-full px-4 py-2.5 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-50/80 dark:bg-plum-950/60 text-plum-900 dark:text-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-plum-700 dark:text-cream-200 uppercase tracking-wider mb-1.5">
                  Closing Time
                </label>
                <input
                  type="text"
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  placeholder="06:00 PM"
                  className="w-full px-4 py-2.5 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-50/80 dark:bg-plum-950/60 text-plum-900 dark:text-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
              </div>
            </div>

            {/* Section 6: Description */}
            <div>
              <label className="block text-xs font-semibold text-plum-700 dark:text-cream-200 uppercase tracking-wider mb-1.5">
                Business Description
              </label>
              <textarea
                rows="2"
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                placeholder="Briefly describe the services offered at your location..."
                className="w-full px-4 py-3 rounded-28 border border-plum-200/60 dark:border-plum-800 bg-cream-50/80 dark:bg-plum-950/60 text-plum-900 dark:text-cream-50 text-sm placeholder-plum-400 dark:placeholder-cream-300/60 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-xs font-semibold text-cream-50 bg-plum-900 hover:bg-terracotta-600 disabled:opacity-50 transition-all shadow-soft-sm mt-4"
            >
              {loading ? 'Setting Up Console...' : 'Launch Business Queue Console'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-plum-200/40 dark:border-plum-800/40 text-center">
            <p className="text-xs text-plum-700/80 dark:text-cream-200/70">
              Already have a business account?{' '}
              <Link
                to="/business/login"
                className="font-semibold text-terracotta-600 dark:text-terracotta-400 hover:underline"
              >
                Sign in to console
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessRegisterPage;
