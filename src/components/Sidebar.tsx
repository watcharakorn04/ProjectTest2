import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Terminal, 
  Trophy, 
  PlusCircle, 
  User as UserIcon, 
  Settings as SettingsIcon, 
  LogOut,
  Award,
  BookOpen
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, currentView, changeView, logout, settings } = useApp();

  if (!user) return null;

  // Render XP bar
  const xpInCurrentLevel = user.xp % 1000;
  const xpPercentage = Math.min(100, (xpInCurrentLevel / 1000) * 100);

  const navItems = [
    { view: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { view: 'browse', label: 'Challenges', icon: BookOpen },
    { view: 'create-challenge', label: 'Create', icon: PlusCircle },
    { view: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { view: 'profile', label: 'My Profile', icon: UserIcon },
    { view: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside 
      className={`
        w-80 border-r border-slate-800 bg-slate-900 flex flex-col h-screen overflow-y-auto text-slate-100 shrink-0
        ${settings.theme === 'cyberpunk' ? 'bg-[#120E16] border-pink-500/20' : ''}
        ${settings.theme === 'classic-terminal' ? 'bg-[#050505] border-green-500/20 font-mono' : ''}
        ${settings.theme === 'nord' ? 'bg-[#2E3440] border-[#434C5E]' : ''}
      `}
      id="sidebar-container"
    >
      {/* Brand Header */}
      <div 
        className={`p-6 border-b border-slate-800 flex items-center gap-3
          ${settings.theme === 'cyberpunk' ? 'border-pink-500/10' : ''}
          ${settings.theme === 'classic-terminal' ? 'border-green-500/10' : ''}
          ${settings.theme === 'nord' ? 'border-[#434C5E]' : ''}
        `}
      >
        <div className={`p-2 rounded-lg bg-blue-600/10 text-blue-400 flex items-center justify-center
          ${settings.theme === 'cyberpunk' ? 'bg-pink-500/10 text-pink-400' : ''}
          ${settings.theme === 'classic-terminal' ? 'bg-green-500/10 text-green-400' : ''}
          ${settings.theme === 'nord' ? 'bg-[#88C0D0]/10 text-[#88C0D0]' : ''}
        `}>
          <Terminal size={24} />
        </div>
        <div>
          <h1 className="font-bold tracking-tight text-lg text-white font-sans flex items-center gap-1.5">
            NetConfig <span className="text-blue-500 font-mono text-xs border border-blue-500/30 px-1.5 py-0.5 rounded
              ${settings.theme === 'cyberpunk' ? 'text-pink-500 border-pink-500/30' : ''}
              ${settings.theme === 'classic-terminal' ? 'text-green-500 border-green-500/30' : ''}
              ${settings.theme === 'nord' ? 'text-[#88C0D0] border-[#88C0D0]/30' : ''}
            ">ARENA</span>
          </h1>
          <p className="text-xs text-slate-400">Network configuration training</p>
        </div>
      </div>

      {/* User Information Profile Card */}
      <div className={`p-6 border-b border-slate-800
        ${settings.theme === 'cyberpunk' ? 'border-pink-500/10' : ''}
        ${settings.theme === 'classic-terminal' ? 'border-green-500/10' : ''}
        ${settings.theme === 'nord' ? 'border-[#434C5E]' : ''}
      `}>
        <div className="flex items-center gap-3 mb-4">
          <img 
            src={user.avatar} 
            alt={user.username} 
            className="w-12 h-12 rounded-full border-2 border-slate-700 bg-slate-800"
            referrerPolicy="no-referrer"
          />
          <div className="overflow-hidden">
            <h3 className="font-semibold text-white truncate text-sm" title={user.username}>{user.username}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs bg-slate-800 px-1.5 py-0.5 rounded text-blue-400 border border-slate-700 font-medium flex items-center gap-0.5">
                LV {user.level}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-0.5">
                Rank #{user.rank}
              </span>
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">XP Progress</span>
            <span className="text-white font-medium">{xpInCurrentLevel}/1000</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500`}
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentView === item.view || 
            (item.view === 'browse' && currentView === 'challenge-detail') ||
            (item.view === 'browse' && currentView === 'play-challenge');

          return (
            <button
              key={item.view}
              id={`nav-item-${item.view}`}
              onClick={() => changeView(item.view)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left
                ${isActive 
                  ? 'bg-blue-600/10 text-blue-400 border-l-4 border-blue-500' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }
                ${settings.theme === 'cyberpunk' && isActive 
                  ? 'bg-pink-600/10 text-pink-400 border-l-4 border-pink-500' 
                  : ''
                }
                ${settings.theme === 'classic-terminal' && isActive 
                  ? 'bg-green-600/10 text-green-400 border-l-4 border-green-500 font-mono' 
                  : ''
                }
                ${settings.theme === 'nord' && isActive 
                  ? 'bg-[#81A1C1]/10 text-[#88C0D0] border-l-4 border-[#88C0D0]' 
                  : ''
                }
              `}
            >
              <IconComponent size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Footer */}
      <div className="p-4 mt-auto border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800/80 hover:text-white transition-colors text-left"
          id="logout-button"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
