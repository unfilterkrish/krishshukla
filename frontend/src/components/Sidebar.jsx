import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderOpen,
  Heart,
  Sparkles,
  Settings,
  LogOut,
  PlusCircle,
  Zap,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Prompts', path: '/prompts', icon: FolderOpen },
    { name: 'Favorites', path: '/favorites', icon: Heart },
    { name: 'AI Prompt Improver', path: '/ai-improver', icon: Sparkles, badge: 'AI' },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0a0e19] border-r border-slate-800/80 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Quick Action Button */}
      <div className="p-4">
        <NavLink to="/prompts/create">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/20 transition-all duration-200 active:scale-95 border border-purple-400/20">
            <PlusCircle className="w-4 h-4" />
            <span>Create New Prompt</span>
          </button>
        </NavLink>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1.5 py-2">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Main Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Pro/AI Feature Pill */}
      <div className="p-4 m-3 rounded-2xl bg-gradient-to-b from-purple-900/20 to-slate-900/80 border border-purple-500/20 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-white">Smart Engine Active</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5">
          Enhance, score, and restructure prompts automatically with AI.
        </p>
        <NavLink
          to="/ai-improver"
          className="text-xs font-semibold text-purple-300 hover:text-purple-200 flex items-center gap-1 group"
        >
          <span>Open AI Studio</span>
          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </NavLink>
      </div>

      {/* User Profile & Logout at Bottom */}
      <div className="p-4 border-t border-slate-800/80 bg-[#080c14]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold uppercase shrink-0 shadow-md">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">
                {user?.name || 'Vault Member'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors shrink-0"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
