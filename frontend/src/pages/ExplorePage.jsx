import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import {
  Search,
  MapPin,
  Clock,
  Users,
  ArrowRight,
  Store,
  Compass,
} from 'lucide-react';

const categories = [
  'All',
  'Hospital',
  'Clinic',
  'Bank',
  'Restaurant',
  'Salon',
  'Government Office',
  'Service Center',
];

const categoryImages = {
  Hospital: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=700&q=80',
  Clinic: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=700&q=80',
  Bank: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=700&q=80',
  Restaurant: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=700&q=80',
  Salon: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=700&q=80',
  'Government Office': 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=700&q=80',
  'Service Center': 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=700&q=80',
};

const defaultImage = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=80';

const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory && selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const res = await api.get('/businesses', { params });
      if (res.data.success) {
        setBusinesses(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBusinesses();
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-plum-200/40 dark:border-plum-800/40">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta-100/70 text-terracotta-700 dark:bg-terracotta-950/40 dark:text-terracotta-300 text-xs font-medium tracking-wide mb-3">
            <Compass className="h-3.5 w-3.5" />
            <span>Architectural Virtual Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-plum-900 dark:text-cream-50 tracking-tight">
            Browse Spaces & Live Queues
          </h1>
          <p className="text-sm sm:text-base text-plum-700/80 dark:text-cream-200/70 mt-2 max-w-xl font-sans">
            Enter queues remotely from anywhere. Experience seamless virtual check-in and serene waiting.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-plum-400 dark:text-cream-300" />
          <input
            type="text"
            placeholder="Search spaces or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-full border border-plum-200/60 dark:border-plum-800 bg-cream-100/80 dark:bg-plum-900/60 text-sm text-plum-900 dark:text-cream-50 placeholder-plum-400 dark:placeholder-cream-300/60 focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all shadow-soft-sm"
          />
        </form>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-10 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-plum-900 text-cream-50 shadow-soft-sm dark:bg-terracotta-600 dark:text-cream-50'
                  : 'bg-cream-100/70 dark:bg-plum-900/40 border border-plum-200/40 dark:border-plum-800/60 text-plum-800 dark:text-cream-200 hover:bg-cream-200/60 dark:hover:bg-plum-800/60'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Businesses Grid */}
      {loading ? (
        <LoadingSpinner text="Searching live queues..." />
      ) : businesses.length === 0 ? (
        <EmptyState
          icon={Store}
          title="No spaces found"
          description="Try adjusting your search criteria or explore another curated category."
          action={
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-full text-xs font-semibold bg-plum-900 text-cream-50 hover:bg-terracotta-600 transition-colors"
            >
              Reset Filters
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {businesses.map((biz) => {
            const cardImg = biz.businessLogo || categoryImages[biz.businessCategory] || defaultImage;
            return (
              <div
                key={biz._id}
                className="group flex flex-col justify-between rounded-32 border border-plum-200/40 dark:border-plum-800/60 bg-cream-100/70 dark:bg-plum-900/40 overflow-hidden shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all"
              >
                <div>
                  {/* Card Visual Header with Architectural Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-cream-200 dark:bg-plum-950">
                    <img
                      src={cardImg}
                      alt={biz.businessName || biz.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-plum-950/70 via-transparent to-black/20" />

                    {/* Status Pill on top right */}
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-cream-50/90 text-sage-800 backdrop-blur-md shadow-soft-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-sage-500 live-indicator" />
                        Active
                      </span>
                    </div>

                    {/* Category pill bottom left */}
                    <div className="absolute bottom-3 left-4">
                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-terracotta-500/90 text-white backdrop-blur-sm">
                        {biz.businessCategory}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-normal text-plum-900 dark:text-cream-50 group-hover:text-terracotta-600 dark:group-hover:text-terracotta-400 transition-colors">
                      {biz.businessName || biz.name}
                    </h3>

                    <p className="text-xs text-plum-700/80 dark:text-cream-200/70 line-clamp-2 mt-2 leading-relaxed font-sans">
                      {biz.businessDescription || 'Modern smart virtual queue location.'}
                    </p>

                    {biz.businessAddress && (
                      <div className="flex items-center gap-2 text-xs text-plum-600 dark:text-cream-300/80 mt-3 truncate font-sans">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-terracotta-500" />
                        <span className="truncate">{biz.businessAddress}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0">
                  {/* Stats row */}
                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-plum-200/40 dark:border-plum-800/40 mb-4 text-xs font-sans">
                    <div className="flex items-center gap-2 text-plum-800 dark:text-cream-200">
                      <Users className="h-3.5 w-3.5 text-terracotta-500" />
                      <span>
                        <strong className="text-plum-900 dark:text-white font-semibold">
                          {biz.totalWaitingCustomers || 0}
                        </strong>{' '}
                        in line
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-plum-800 dark:text-cream-200">
                      <Clock className="h-3.5 w-3.5 text-sage-600" />
                      <span>
                        ~
                        <strong className="text-plum-900 dark:text-white font-semibold">
                          {biz.estimatedWaitMinutes || 5}m
                        </strong>{' '}
                        wait
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/business/${biz._id}`}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-xs font-semibold text-cream-50 bg-plum-900 hover:bg-terracotta-600 dark:bg-plum-800 dark:hover:bg-terracotta-600 transition-all shadow-soft-sm"
                  >
                    <span>View Queues & Enter</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
