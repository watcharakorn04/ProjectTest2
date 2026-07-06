import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Terminal, Key, User, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, changeView } = useApp();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Validation errors
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('Username is required.');
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate delay for realism
    setTimeout(() => {
      const success = login(username.trim());
      setIsSubmitting(false);
      if (!success) {
        setError('Failed to sign in. Please try again.');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative font-sans">
      
      {/* Back button */}
      <button 
        onClick={() => changeView('landing')}
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors cursor-pointer"
        id="back-to-landing-btn"
      >
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </button>

      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Logo and header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-xl bg-blue-600/10 text-blue-400 mb-2">
            <Terminal size={28} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Sign In to NetConfig Arena</h2>
          <p className="text-sm text-slate-400">Continue perfecting your router commands</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl shadow-xl backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5" id="login-form">
            
            {/* Display validation error */}
            {error && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 font-medium leading-relaxed">
                {error}
              </div>
            )}

            {/* Username Input */}
            <div className="space-y-1.5">
              <label htmlFor="username-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User size={16} />
                </div>
                <input 
                  type="text" 
                  id="username-input"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g. NetMaster"
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <button 
                  type="button"
                  onClick={() => alert('Forgot password functionality is currently UI-only. Tip: You can type any username and an 8+ character password to enter.')}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Key size={16} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password-input"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Min 8 characters"
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isSubmitting || !username.trim() || !password}
              className={`w-full py-3 px-4 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/10 flex items-center justify-center gap-2
                ${(isSubmitting || !username.trim() || !password) ? 'opacity-50 cursor-not-allowed hover:bg-blue-600' : 'hover:-translate-y-0.5'}
              `}
              id="submit-login-btn"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>

          </form>

          {/* Quick instructions for sandbox testing */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-[11px] text-slate-500 space-y-1">
            <span className="font-bold text-slate-400">Sandbox Fast-Pass:</span>
            <p>You can enter with any mock username (e.g. <code className="text-blue-400/80 font-mono">NetMaster</code> or <code className="text-blue-400/80 font-mono font-bold">CiscoFan</code>) and password <code className="text-blue-400/80 font-mono font-bold">password123</code> to test persistent profile state immediately!</p>
          </div>
        </div>

        {/* Footer link to register */}
        <p className="text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <button 
            onClick={() => changeView('register')}
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Sign up for free
          </button>
        </p>

      </div>
    </div>
  );
};
