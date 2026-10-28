import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Settings2,
  Store,
  LogOut,
  ExternalLink,
} from 'lucide-react';

const BusinessSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    {
      to: '/business/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      to: '/business/queues',
      label: 'Live Queue',
      icon: Users,
    },
    {
      to: '/business/manage-queues',
      label: 'Manage Queues',
      icon: Settings2,
    },
    {
      to: '/business/profile',
      label: 'Settings',
      icon: Store,
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-[#2C1929] bg-[#1C111B] text-[#FBF8F2] flex flex-col h-screen sticky top-0 transition-colors z-20">
      {/* Top Logo & Business Branding */}
      <div className="p-6 border-b border-[#2C1929]">
        <Link to="/" className="flex items-center gap-3 mb-6 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C3532B] text-white shadow-soft">
            <span className="font-serif font-bold text-base leading-none">Q</span>
          </div>
          <span className="font-sans font-bold text-xl tracking-tight text-white leading-none">
            QFlow
          </span>
        </Link>

        {/* Current Business Card */}
        <div className="p-3.5 rounded-2xl bg-[#261725] border border-[#3A2238] flex items-center gap-3">
          {user?.businessLogo ? (
            <img
              src={user.businessLogo}
              alt="Logo"
              className="h-10 w-10 rounded-xl object-cover border border-[#442842]"
            />
          ) : (
            <div className="h-10 w-10 rounded-xl bg-[#E28555] text-[#1C111B] flex items-center justify-center font-bold text-sm shadow-soft">
              {(user?.businessName || user?.name || 'B').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white truncate">
              {user?.businessName || user?.name}
            </h4>
            <p className="text-[10px] text-[#A594A3] truncate">
              {user?.businessCategory || 'Business Console'}
            </p>
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8C7A8A]">
          Console
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#E28555] text-[#1C111B] font-bold shadow-soft'
                  : 'text-[#C5B5C3] hover:text-white hover:bg-[#281827]'
              }`
            }
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}

        <div className="pt-6 px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8C7A8A]">
          Customer View
        </div>

        <Link
          to={`/business/${user?._id}`}
          target="_blank"
          className="flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-medium text-[#C5B5C3] hover:text-white hover:bg-[#281827] transition-colors"
        >
          <span className="flex items-center gap-3.5">
            <Store className="h-4 w-4 text-[#8FA88D]" />
            Public Page
          </span>
          <ExternalLink className="h-3 w-3 text-[#8C7A8A]" />
        </Link>
      </nav>

      {/* Profile & Footer Sign Out */}
      <div className="p-4 border-t border-[#2C1929] space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="h-9 w-9 rounded-full bg-[#E28555] text-[#1C111B] flex items-center justify-center font-bold text-xs">
            {(user?.name || 'A').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs font-semibold text-white truncate">
              {user?.name || 'Operator'}
            </p>
            <p className="text-[10px] text-[#A594A3] truncate">
              Admin
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/business/login');
          }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#D87D50] hover:bg-[#2C1720] transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Exit Console</span>
        </button>
      </div>
    </aside>
  );
};

export default BusinessSidebar;
