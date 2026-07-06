import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { RegistrationPage } from './components/RegistrationPage';
import { Dashboard } from './components/Dashboard';
import { ChallengeBrowser } from './components/ChallengeBrowser';
import { ChallengeDetail } from './components/ChallengeDetail';
import { PlayChallenge } from './components/PlayChallenge';
import { ResultScreen } from './components/ResultScreen';
import { CreateChallenge } from './components/CreateChallenge';
import { LeaderboardPage } from './components/LeaderboardPage';
import { ProfilePage } from './components/ProfilePage';
import { SettingsPage } from './components/SettingsPage';
import { Menu, X, Terminal } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, currentView, settings, changeView } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Map theme background/font color variables
  const themeClasses = {
    slate: 'bg-slate-950 text-slate-100 font-sans',
    cyberpunk: 'bg-[#0f0a14] text-[#d8cbd4] font-sans',
    'classic-terminal': 'bg-[#010301] text-[#22c55e] font-mono',
    nord: 'bg-[#242933] text-[#ECEFF4] font-sans'
  };

  const currentThemeClass = themeClasses[settings.theme] || themeClasses.slate;

  // Map custom font size utility
  const fontSizeClasses = {
    sm: 'text-xs [&_input]:text-xs [&_textarea]:text-xs [&_button]:text-xs [&_table]:text-xs [&_h2]:text-lg [&_h3]:text-sm',
    base: 'text-sm',
    lg: 'text-base [&_input]:text-base [&_textarea]:text-base [&_button]:text-base [&_h2]:text-3xl [&_h3]:text-lg',
    xl: 'text-lg [&_input]:text-lg [&_textarea]:text-lg [&_button]:text-lg [&_h2]:text-4xl [&_h3]:text-xl'
  };

  const currentFontSizeClass = fontSizeClasses[settings.fontSize] || fontSizeClasses.base;

  // Non-logged in routing
  if (!user) {
    if (currentView === 'login') return <LoginPage />;
    if (currentView === 'register') return <RegistrationPage />;
    return <LandingPage />;
  }

  // Active view content mapper
  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'browse':
        return <ChallengeBrowser />;
      case 'challenge-detail':
        return <ChallengeDetail />;
      case 'play-challenge':
        return <PlayChallenge />;
      case 'results':
        return <ResultScreen />;
      case 'create-challenge':
        return <CreateChallenge />;
      case 'leaderboard':
        return <LeaderboardPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen flex ${currentThemeClass} ${currentFontSizeClass}`} id="app-root-shell">
      
      {/* Responsive Hamburger Toggle for Mobile */}
      <div className="lg:hidden absolute top-4 left-4 z-40">
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:text-white transition-all cursor-pointer shadow-md"
          id="mobile-sidebar-toggle"
        >
          {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Desktop Sidebar Layout */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile drawer Sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-30 flex lg:hidden" id="mobile-sidebar-overlay">
          {/* Black blur backdrop overlay */}
          <div 
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity" 
          />
          <div className="relative flex w-80 max-w-xs flex-col">
            {/* Slide-in sidebar */}
            <div className="flex-1 flex flex-col h-full" onClick={() => setMobileSidebarOpen(false)}>
              <Sidebar />
            </div>
          </div>
        </div>
      )}

      {/* Main Screen Layout content section */}
      <main 
        className={`
          flex-1 min-w-0 h-screen overflow-y-auto px-6 py-8 pt-20 lg:pt-8 transition-colors duration-300
          ${settings.theme === 'slate' ? 'bg-[#0f172a]' : ''}
          ${settings.theme === 'cyberpunk' ? 'bg-[#0a0510]' : ''}
          ${settings.theme === 'classic-terminal' ? 'bg-[#030603]' : ''}
          ${settings.theme === 'nord' ? 'bg-[#2E3440]' : ''}
        `}
        id="main-app-content-container"
      >
        <div className="max-w-7xl mx-auto">
          {renderActiveView()}
        </div>
      </main>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
