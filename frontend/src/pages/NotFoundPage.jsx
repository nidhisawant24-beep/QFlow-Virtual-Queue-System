import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-terracotta-500 text-cream-50 mb-6 shadow-soft-sm font-serif text-2xl font-normal">
          Q
        </div>

        <h1 className="text-7xl font-serif font-normal text-plum-900 dark:text-cream-50 mb-2">
          404
        </h1>
        <h2 className="text-xl font-serif text-plum-800 dark:text-cream-200 mb-3">
          Queue Space Not Found
        </h2>
        <p className="text-xs text-plum-700/80 dark:text-cream-200/70 mb-8 leading-relaxed font-sans">
          The space or virtual queue pass you are looking for does not exist or may have expired.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-cream-50 bg-plum-900 hover:bg-terracotta-600 transition-all shadow-soft-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <Link
            to="/explore"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-plum-900 dark:text-cream-100 bg-cream-100 dark:bg-plum-900 border border-plum-200/60 dark:border-plum-800 hover:bg-cream-200 transition-all shadow-soft-sm"
          >
            <Compass className="h-4 w-4 text-terracotta-500" />
            Browse Spaces
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
