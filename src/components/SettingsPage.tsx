import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Volume2, 
  VolumeX, 
  Bell, 
  Type, 
  Languages, 
  Terminal, 
  Sparkles,
  Check,
  Award
} from 'lucide-react';
import { AppSettings } from '../types';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, soundEffect } = useApp();

  const themes = [
    { id: 'slate', name: 'Slate Dark (Default)', desc: 'Professional dark indigo theme', color: 'bg-slate-900 border-blue-500' },
    { id: 'cyberpunk', name: 'Cosmic Cyberpunk', desc: 'Futuristic pink & yellow glow', color: 'bg-[#120E16] border-pink-500' },
    { id: 'classic-terminal', name: 'Classic Terminal', desc: 'Monospace green retro style', color: 'bg-[#050505] border-green-500' },
    { id: 'nord', name: 'Nordic Chill', desc: 'Elegant arctic slate & cyan tone', color: 'bg-[#2E3440] border-[#88C0D0]' }
  ] as const;

  const fontSizes = [
    { id: 'sm', name: 'Small (12px)', class: 'text-xs' },
    { id: 'base', name: 'Medium (14px)', class: 'text-sm' },
    { id: 'lg', name: 'Large (16px)', class: 'text-base' },
    { id: 'xl', name: 'Extra Large (18px)', class: 'text-lg' }
  ] as const;

  const handleThemeChange = (themeId: AppSettings['theme']) => {
    updateSettings({ theme: themeId });
    setTimeout(() => {
      soundEffect('success');
    }, 50);
  };

  const handleFontSizeChange = (size: AppSettings['fontSize']) => {
    updateSettings({ fontSize: size });
    soundEffect('click');
  };

  const handleSoundToggle = () => {
    const nextState = !settings.soundEnabled;
    updateSettings({ soundEnabled: nextState });
    // If enabling, play a quick success ring to verify
    if (nextState) {
      setTimeout(() => {
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
          gain.gain.setValueAtTime(0.05, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
          osc.start();
          osc.stop(ctx.currentTime + 0.15);
        } catch (e) {}
      }, 50);
    }
  };

  const handleNotifyToggle = () => {
    updateSettings({ notificationsEnabled: !settings.notificationsEnabled });
    soundEffect('click');
  };

  const handleLangChange = (lang: string) => {
    updateSettings({ language: lang });
    soundEffect('click');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12 font-sans" id="settings-root">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Terminal className="text-blue-500" size={24} />
          Terminal Configurations
        </h2>
        <p className="text-sm text-slate-400">Personalize themes, synthesizer audio settings, font sizes, and workspace localization preferences.</p>
      </div>

      {/* Grid segments */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left: General Settings Form */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Theme card selection */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <Sparkles size={14} className="text-cyan-400" /> Choose Interface Theme
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {themes.map((theme) => {
                const isSelected = settings.theme === theme.id;
                
                return (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`
                      p-4 rounded-xl border-2 text-left transition-all flex flex-col justify-between h-28 relative cursor-pointer group
                      ${theme.color}
                      ${isSelected 
                        ? 'opacity-100 ring-2 ring-blue-500' 
                        : 'opacity-70 hover:opacity-100 border-slate-800 hover:border-slate-700'
                      }
                    `}
                    id={`theme-btn-${theme.id}`}
                  >
                    {isSelected && (
                      <span className="absolute top-3 right-3 bg-blue-600 text-white p-1 rounded-full text-[9px]">
                        <Check size={10} />
                      </span>
                    )}
                    <div className="space-y-0.5">
                      <h4 className="font-extrabold text-xs text-white group-hover:text-blue-400 transition-colors">{theme.name}</h4>
                      <p className="text-[10px] text-slate-400 leading-normal">{theme.desc}</p>
                    </div>

                    <div className="flex gap-1">
                      <span className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="w-3 h-3 rounded-full bg-cyan-400" />
                      <span className="w-3 h-3 rounded-full bg-slate-950" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Typography configuration */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <Type size={14} className="text-indigo-400" /> CLI Terminal Font Size
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {fontSizes.map((size) => {
                const isSelected = settings.fontSize === size.id;
                
                return (
                  <button
                    key={size.id}
                    onClick={() => handleFontSizeChange(size.id)}
                    className={`
                      py-3.5 px-3 rounded-xl border text-center transition-all cursor-pointer
                      ${isSelected 
                        ? 'bg-blue-600/10 border-blue-500 text-blue-400 font-bold' 
                        : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white'
                      }
                    `}
                    id={`fontsize-btn-${size.id}`}
                  >
                    <span className={`block font-mono mb-1 ${size.class}`}>Abc</span>
                    <span className="text-[10px]">{size.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right: Audio and notifications switches */}
        <div className="space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <Volume2 size={14} className="text-yellow-400" /> Preferences
            </h3>

            {/* Synthesizer audio check */}
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs text-white">Synthesizer SFX</h4>
                <p className="text-[10px] text-slate-400">Play nostalgic game sounds on events</p>
              </div>

              <button
                onClick={handleSoundToggle}
                className={`
                  p-2.5 rounded-xl border cursor-pointer transition-all shrink-0
                  ${settings.soundEnabled 
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                    : 'bg-slate-950 text-slate-500 border-slate-800'
                  }
                `}
                id="toggle-sound-btn"
              >
                {settings.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
            </div>

            {/* Push updates mockup toggle */}
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs text-white">Notifications</h4>
                <p className="text-[10px] text-slate-400">Simulate background notifications (UI-only)</p>
              </div>

              <button
                onClick={handleNotifyToggle}
                className={`
                  p-2.5 rounded-xl border cursor-pointer transition-all shrink-0
                  ${settings.notificationsEnabled 
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                    : 'bg-slate-950 text-slate-500 border-slate-800'
                  }
                `}
                id="toggle-notify-btn"
              >
                <Bell size={16} className={settings.notificationsEnabled ? 'animate-bounce' : ''} />
              </button>
            </div>

            {/* Language Selection */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Languages size={14} />
                <span>Language / Locale</span>
              </div>
              <select
                value={settings.language}
                onChange={(e) => handleLangChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg p-2 focus:outline-none cursor-pointer"
                id="select-language"
              >
                <option value="en">English (US)</option>
                <option value="es">Español (ES)</option>
                <option value="fr">Français (FR)</option>
                <option value="th">ไทย (TH)</option>
              </select>
            </div>

          </div>

          {/* About Arena information card */}
          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl text-center space-y-2.5">
            <Award className="text-blue-500 mx-auto" size={24} />
            <h4 className="font-bold text-white text-xs uppercase tracking-wide">NetConfig Arena v1.0</h4>
            <p className="text-[10px] text-slate-500 leading-normal">Developed specifically for simulated Cisco command line training directly in the sandbox browser. Multi-device compatible layout configured.</p>
          </div>

        </div>

      </div>

    </div>
  );
};
