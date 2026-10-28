import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useSocket } from '../context/SocketContext';
import { Sun, Moon, Calendar, Bell, Search, Clock } from 'lucide-react';

const BusinessHeader = ({ title = 'Dashboard', subtitle }) => {
  const { isDark, toggleTheme } = useTheme();
  const { isConnected } = useSocket();
  const [currentDate, setCurrentDate] = useState('');
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }));

    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-20 border-b border-[#EDE4D6] dark:border-[#3D2539] bg-[#FBF8F2]/95 dark:bg-[#1A101A]/95 backdrop-blur-md px-8 flex items-center justify-between transition-colors">
      {/* Search pill from reference */}
      <div className="flex items-center gap-3 w-72 sm:w-96">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C7A8A]" />
          <input
            type="text"
            readOnly
            placeholder="Search customers, services..."
            className="w-full pl-11 pr-4 py-2 rounded-full border border-[#EDE4D6] dark:border-[#3D2539] bg-white dark:bg-[#231522] text-xs text-[#231522] dark:text-[#FBF8F2] placeholder-[#8C7A8A] focus:outline-none shadow-soft-sm cursor-pointer"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Live Socket Status */}
        <div
          className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
            isConnected
              ? 'bg-[#E4EBE3] text-[#476045] border-[#CCD7C8] dark:bg-[#1E2E20] dark:text-[#A3B899] dark:border-[#2C402E]'
              : 'bg-[#FBF0E8] text-[#B8532F] border-[#F0D5C5] dark:bg-[#2D1B1C] dark:text-[#E28555]'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isConnected ? 'bg-[#587356] live-indicator' : 'bg-[#B8532F]'
            }`}
          />
          <span className="text-[11px] font-semibold">
            {isConnected ? 'Real-time Sync Active' : 'Connecting Sync...'}
          </span>
        </div>

        {/* Date pill like in reference */}
        <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#EDE4D6] dark:border-[#3D2539] bg-white dark:bg-[#231522] text-xs font-medium text-[#685465] dark:text-[#C5B5C3] shadow-soft-sm">
          <Calendar className="h-3.5 w-3.5 text-[#C3532B]" />
          <span>{currentDate}</span>
        </div>

        {/* Clock */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-[#7A6777] dark:text-[#9E8C9B] font-mono">
          <Clock className="h-3.5 w-3.5" />
          <span>{time}</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2.5 rounded-full text-[#685465] hover:text-[#231522] dark:text-[#D8CAB9] dark:hover:text-white hover:bg-[#F2ECE1] dark:hover:bg-[#2D1B2C] transition-colors"
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-[#D87D50]" />
          ) : (
            <Moon className="h-4 w-4 text-[#231522]" />
          )}
        </button>
      </div>
    </header>
  );
};

export default BusinessHeader;
