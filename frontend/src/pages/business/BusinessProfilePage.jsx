import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  Building2,
  Upload,
  MapPin,
  Clock,
  Phone,
  Save,
  User,
  ShieldCheck,
  Image as ImageIcon,
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

const BusinessProfilePage = () => {
  const { user, updateProfile, setUser } = useAuth();

  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState('Clinic');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [openTime, setOpenTime] = useState('09:00 AM');
  const [closeTime, setCloseTime] = useState('06:00 PM');
  const [logoPreview, setLogoPreview] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setBusinessName(user.businessName || '');
      setBusinessCategory(user.businessCategory || 'Clinic');
      setBusinessAddress(user.businessAddress || '');
      setBusinessDescription(user.businessDescription || '');
      setPhone(user.phone || '');
      setName(user.name || '');
      setOpenTime(user.businessHours?.open || '09:00 AM');
      setCloseTime(user.businessHours?.close || '06:00 PM');
      setLogoPreview(user.businessLogo || '');
    }
  }, [user]);

  // Handle Logo Upload via Multer
  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('logo', file);

    setUploadingLogo(true);
    try {
      const res = await api.post('/businesses/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        toast.success('Logo uploaded successfully!');
        setLogoPreview(res.data.logoUrl);
        // update local user state
        setUser((prev) => ({ ...prev, businessLogo: res.data.logoUrl }));
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to upload logo';
      toast.error(msg);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile({
      name,
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
    setSaving(false);
  };

  return (
    <div className="space-y-8 p-6 lg:p-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-6 border-b border-plum-200/40 dark:border-plum-800/40">
        <h2 className="text-2xl sm:text-3xl font-serif font-normal text-plum-900 dark:text-cream-50">
          Business Profile & Settings
        </h2>
        <p className="text-xs sm:text-sm text-plum-700/80 dark:text-cream-200/70 mt-1 font-sans">
          Update your public profile, logo branding, and location information
        </p>
      </div>

      <div className="rounded-32 border border-plum-200/40 dark:border-plum-800/60 bg-cream-100/70 dark:bg-plum-900/40 p-8 sm:p-10 shadow-soft">
        {/* Logo Upload Section */}
        <div className="mb-8 pb-8 border-b border-plum-200/40 dark:border-plum-800/40 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Business Logo"
                className="h-24 w-24 rounded-28 object-cover border-2 border-plum-200/60 dark:border-plum-800 shadow-md"
              />
            ) : (
              <div className="h-24 w-24 rounded-28 bg-terracotta-500 text-white flex items-center justify-center font-serif text-3xl shadow-md">
                {(businessName || 'B').charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left font-sans">
            <h3 className="text-sm font-bold text-plum-900 dark:text-white mb-1">
              Business Brand Logo
            </h3>
            <p className="text-xs text-plum-700/80 dark:text-cream-200/70 mb-3">
              Uploaded logos are stored and displayed on customer ticket screens and directory cards.
            </p>

            <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-plum-900 dark:text-cream-100 bg-cream-200/70 dark:bg-plum-800 hover:bg-cream-300/80 cursor-pointer transition-colors shadow-soft-sm">
              <Upload className="h-4 w-4 text-terracotta-500" />
              <span>{uploadingLogo ? 'Uploading...' : 'Upload New Logo'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                disabled={uploadingLogo}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-5 font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-plum-700 dark:text-cream-200 mb-1.5">
                Business Name *
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-50 dark:bg-plum-950 text-sm text-plum-900 dark:text-cream-50 focus:ring-2 focus:ring-terracotta-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-plum-700 dark:text-cream-200 mb-1.5">
                Industry Category *
              </label>
              <select
                value={businessCategory}
                onChange={(e) => setBusinessCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-50 dark:bg-plum-950 text-sm text-plum-900 dark:text-cream-50 focus:ring-2 focus:ring-terracotta-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-plum-700 dark:text-cream-200 mb-1.5">
                Administrator / Manager Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-50 dark:bg-plum-950 text-sm text-plum-900 dark:text-cream-50 focus:ring-2 focus:ring-terracotta-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-plum-700 dark:text-cream-200 mb-1.5">
                Public Contact Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-50 dark:bg-plum-950 text-sm text-plum-900 dark:text-cream-50 focus:ring-2 focus:ring-terracotta-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-plum-700 dark:text-cream-200 mb-1.5">
              Physical Location / Address
            </label>
            <input
              type="text"
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              placeholder="e.g. 742 Evergreen Terrace, Medical District"
              className="w-full px-4 py-2.5 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-50 dark:bg-plum-950 text-sm text-plum-900 dark:text-cream-50 focus:ring-2 focus:ring-terracotta-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-plum-700 dark:text-cream-200 mb-1.5">
                Opening Hours
              </label>
              <input
                type="text"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-50 dark:bg-plum-950 text-sm text-plum-900 dark:text-cream-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-plum-700 dark:text-cream-200 mb-1.5">
                Closing Hours
              </label>
              <input
                type="text"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-50 dark:bg-plum-950 text-sm text-plum-900 dark:text-cream-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-plum-700 dark:text-cream-200 mb-1.5">
              About Your Business
            </label>
            <textarea
              rows="3"
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-28 border border-plum-200/60 dark:border-plum-800 bg-cream-50 dark:bg-plum-950 text-sm text-plum-900 dark:text-cream-50 focus:ring-2 focus:ring-terracotta-500"
            />
          </div>

          <div className="pt-4 border-t border-plum-200/30 dark:border-plum-800/40 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-sage-700 dark:text-sage-400 font-medium">
              <ShieldCheck className="h-4 w-4" />
              Settings live and synchronized
            </span>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs font-semibold text-cream-50 bg-plum-900 hover:bg-terracotta-600 disabled:opacity-50 transition-all shadow-soft-sm"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Updating...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessProfilePage;
