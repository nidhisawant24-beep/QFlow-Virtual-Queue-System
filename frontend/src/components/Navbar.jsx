import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Sun,
  Moon,
  Ticket,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  Building2,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isBusiness, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-[#EDE4D6] dark:border-[#3D2539] bg-[#FBF8F2]/90 dark:bg-[#1A101A]/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Architectural Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C3532B] text-white shadow-soft transition-transform group-hover:scale-105">
              <span className="font-serif font-bold text-lg leading-none tracking-tighter">Q</span>
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-bold text-xl tracking-tight text-[#231522] dark:text-[#FBF8F2] leading-none">
                QFlow
              </span>
              <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[#7A6777] dark:text-[#9E8C9B] mt-0.5">
                VIRTUAL QUEUES
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors relative py-1 ${
                isActive('/')
                  ? 'text-[#C3532B] font-semibold'
                  : 'text-[#685465] dark:text-[#D8CAB9] hover:text-[#231522] dark:hover:text-white'
              }`}
            >
              Home
              {isActive('/') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C3532B] rounded-full" />
              )}
            </Link>

            <Link
              to="/explore"
              className={`text-sm font-medium transition-colors relative py-1 ${
                isActive('/explore')
                  ? 'text-[#C3532B] font-semibold'
                  : 'text-[#685465] dark:text-[#D8CAB9] hover:text-[#231522] dark:hover:text-white'
              }`}
            >
              Browse Places
              {isActive('/explore') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C3532B] rounded-full" />
              )}
            </Link>

            {isAuthenticated && !isBusiness && (
              <Link
                to="/my-queues"
                className={`text-sm font-medium transition-colors relative py-1 ${
                  isActive('/my-queues')
                    ? 'text-[#C3532B] font-semibold'
                    : 'text-[#685465] dark:text-[#D8CAB9] hover:text-[#231522] dark:hover:text-white'
                }`}
              >
                My Tickets
                {isActive('/my-queues') && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C3532B] rounded-full" />
                )}
              </Link>
            )}

            {isBusiness ? (
              <Link
                to="/business/dashboard"
                className="text-sm font-semibold text-[#C3532B] hover:text-[#A43F1B] transition-colors"
              >
                Business Dashboard
              </Link>
            ) : (
              <Link
                to="/business/login"
                className="text-xs font-semibold uppercase tracking-wider text-[#7A6777] dark:text-[#9E8C9B] hover:text-[#C3532B] transition-colors"
              >
                For Businesses
              </Link>
            )}
          </div>

          {/* Right Controls: Theme Toggle & User Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-full text-[#685465] hover:text-[#231522] dark:text-[#D8CAB9] dark:hover:text-white hover:bg-[#F2ECE1] dark:hover:bg-[#2D1B2C] transition-colors"
            >
              {isDark ? <Sun className="h-4 w-4 text-[#D87D50]" /> : <Moon className="h-4 w-4 text-[#231522]" />}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-[#EDE4D6] dark:border-[#3D2539] bg-[#FFFFFF] dark:bg-[#231522] hover:bg-[#F7F2EA] dark:hover:bg-[#2D1B2C] transition-colors shadow-soft-sm"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E4EBE3] text-[#587356] font-semibold text-xs">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-[#231522] dark:text-[#FBF8F2] max-w-[120px] truncate">
                    {user?.name}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-[#7A6777]" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-52 rounded-28 bg-[#FFFFFF] dark:bg-[#231522] border border-[#EDE4D6] dark:border-[#3D2539] shadow-soft-lg py-2 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-2.5 border-b border-[#F0EAE1] dark:border-[#331E30]">
                      <p className="text-xs font-semibold text-[#231522] dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-[#7A6777] truncate">
                        {user.email}
                      </p>
                    </div>

                    {isBusiness ? (
                      <Link
                        to="/business/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#231522] dark:text-[#FBF8F2] hover:bg-[#F7F2EA] dark:hover:bg-[#2D1B2C] transition-colors"
                      >
                        <Building2 className="h-4 w-4 text-[#C3532B]" />
                        Dashboard
                      </Link>
                    ) : (
                      <>
                        <Link
                          to="/my-queues"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#231522] dark:text-[#FBF8F2] hover:bg-[#F7F2EA] dark:hover:bg-[#2D1B2C] transition-colors"
                        >
                          <Ticket className="h-4 w-4 text-[#C3532B]" />
                          My Active Tickets
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#231522] dark:text-[#FBF8F2] hover:bg-[#F7F2EA] dark:hover:bg-[#2D1B2C] transition-colors"
                        >
                          <User className="h-4 w-4 text-[#7A6777]" />
                          Edit Profile
                        </Link>
                      </>
                    )}

                    <div className="border-t border-[#F0EAE1] dark:border-[#331E30] my-1" />

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-xs font-medium text-[#B84030] hover:bg-[#FAF0EE] dark:hover:bg-[#34161C] transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-medium text-[#231522] dark:text-[#FBF8F2] hover:text-[#C3532B] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold text-[#FBF8F2] bg-[#231522] hover:bg-[#C3532B] transition-all shadow-soft"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-[#685465] hover:bg-[#F2ECE1] dark:hover:bg-[#2D1B2C]"
            >
              {isDark ? <Sun className="h-4 w-4 text-[#D87D50]" /> : <Moon className="h-4 w-4 text-[#231522]" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg text-[#231522] dark:text-[#FBF8F2] hover:bg-[#F2ECE1] dark:hover:bg-[#2D1B2C]"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#EDE4D6] dark:border-[#3D2539] bg-[#FBF8F2] dark:bg-[#1A101A] px-4 py-5 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-[#231522] dark:text-[#FBF8F2] hover:bg-[#F2ECE1] dark:hover:bg-[#2D1B2C]"
          >
            Home
          </Link>
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-[#231522] dark:text-[#FBF8F2] hover:bg-[#F2ECE1] dark:hover:bg-[#2D1B2C]"
          >
            Browse Businesses
          </Link>
          {isAuthenticated && (
            <Link
              to="/my-queues"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-[#231522] dark:text-[#FBF8F2] hover:bg-[#F2ECE1] dark:hover:bg-[#2D1B2C]"
            >
              My Queue Tickets
            </Link>
          )}
          <Link
            to="/business/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-[#C3532B] dark:text-[#D87D50] hover:bg-[#F2ECE1] dark:hover:bg-[#2D1B2C]"
          >
            Business Dashboard
          </Link>

          <div className="pt-3 border-t border-[#EDE4D6] dark:border-[#3D2539]">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                  navigate('/');
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-[#B84030] hover:bg-[#FAF0EE] dark:hover:bg-[#34161C]"
              >
                Sign Out
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-full text-xs font-medium border border-[#EDE4D6] dark:border-[#3D2539] text-[#231522] dark:text-[#FBF8F2]"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-full text-xs font-semibold bg-[#231522] text-[#FBF8F2]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
