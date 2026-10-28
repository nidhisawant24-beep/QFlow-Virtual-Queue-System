import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-[#EDE4D6] dark:border-[#3D2539] bg-[#F6F1E7] dark:bg-[#140C14] transition-colors mt-auto text-[#231522] dark:text-[#FAF6F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand info */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C3532B] text-white shadow-soft">
                <span className="font-serif font-bold text-base leading-none">Q</span>
              </div>
              <span className="font-sans font-bold text-xl tracking-tight text-[#231522] dark:text-white">
                QFlow
              </span>
            </Link>
            <p className="text-xs text-[#7A6777] dark:text-[#C5B5C3] leading-relaxed mb-4">
              Architectural virtual queue management for clinics, hospitals, banks, restaurants, salons, and modern civic spaces.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#587356] dark:text-[#8FA88D] font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-[#738F71] live-indicator" />
              Real-time Queue Stream Online
            </div>
          </div>

          {/* Target Spaces */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C3532B] dark:text-[#D87D50] mb-3">
              Spaces
            </h4>
            <ul className="space-y-2 text-xs text-[#685465] dark:text-[#D8CAB9]">
              <li>Hospitals & Medical Centers</li>
              <li>Outpatient Clinics & Diagnostics</li>
              <li>Private Banking & Wealth Desks</li>
              <li>Restaurants & Bistros</li>
              <li>Luxury Salons & Spas</li>
              <li>Civic & Government Offices</li>
            </ul>
          </div>

          {/* Philosophy */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C3532B] dark:text-[#D87D50] mb-3">
              Philosophy
            </h4>
            <ul className="space-y-2 text-xs text-[#685465] dark:text-[#D8CAB9]">
              <li>People First. Queues Second.</li>
              <li>Sub-second Real-time Synchronization</li>
              <li>Zero Physical Line Footprints</li>
              <li>Dynamic Wait Estimation</li>
              <li>Instant Counter Calling</li>
              <li>Architectural Simplicity</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C3532B] dark:text-[#D87D50] mb-3">
              Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/explore"
                  className="text-[#685465] dark:text-[#D8CAB9] hover:text-[#C3532B] transition-colors"
                >
                  Browse Virtual Queues
                </Link>
              </li>
              <li>
                <Link
                  to="/business/login"
                  className="text-[#685465] dark:text-[#D8CAB9] hover:text-[#C3532B] transition-colors"
                >
                  Business Operator Login
                </Link>
              </li>
              <li>
                <Link
                  to="/business/register"
                  className="text-[#685465] dark:text-[#D8CAB9] hover:text-[#C3532B] transition-colors"
                >
                  Register New Business
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-[#685465] dark:text-[#D8CAB9] hover:text-[#C3532B] transition-colors"
                >
                  Customer Access
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#EDE4D6] dark:border-[#2D1B2C] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A6777] dark:text-[#9E8C9B]">
          <p>© {new Date().getFullYear()} QFlow Systems. Designed for quieter spaces.</p>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#587356]" />
              End-to-End Encrypted
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#C3532B]" />
              Architectural Standard
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
