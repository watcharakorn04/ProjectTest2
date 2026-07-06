import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Terminal, Key, User, Mail, ShieldAlert, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export const RegistrationPage: React.FC = () => {
  const { register, changeView } = useApp();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validations:
    if (!username.trim()) {
      setError('Username is required.');
      return;
    }

    if (username.trim().length < 3 || username.trim().length > 20) {
      setError('Username must be between 3 and 20 characters.');
      return;
    }

    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
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

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setIsSubmitting(true);

    // Simulate registration
    setTimeout(() => {
      const success = register(username.trim(), email.trim());
      setIsSubmitting(false);
      if (!success) {
        setError('Registration failed. Username might already exist.');
      }
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative font-sans">
      
      {/* Back button */}
      <button 
        onClick={() => changeView('landing')}
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors cursor-pointer"
        id="back-to-landing-register-btn"
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
          <h2 className="text-2xl font-bold tracking-tight text-white">Create Your Account</h2>
          <p className="text-sm text-slate-400">Join the NetConfig Arena and rank among the best</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl shadow-xl backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-4" id="registration-form">
            
            {/* Display validation error */}
            {error && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 font-medium leading-relaxed flex items-start gap-2">
                <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Username Input */}
            <div className="space-y-1.5">
              <label htmlFor="reg-username" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User size={16} />
                </div>
                <input 
                  type="text" 
                  id="reg-username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="3-20 characters"
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail size={16} />
                </div>
                <input 
                  type="email" 
                  id="reg-email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g. net@domain.com"
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Key size={16} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="reg-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="At least 8 characters"
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

            {/* Confirm Password Input */}
            <div className="space-y-1.5">
              <label htmlFor="reg-confirm-password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Key size={16} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="reg-confirm-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Re-type your password"
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isSubmitting || !username.trim() || !email.trim() || !password || !confirmPassword}
              className={`w-full py-3 px-4 mt-2 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/10 flex items-center justify-center gap-2
                ${(isSubmitting || !username.trim() || !email.trim() || !password || !confirmPassword) ? 'opacity-50 cursor-not-allowed hover:bg-blue-600' : 'hover:-translate-y-0.5'}
              `}
              id="submit-register-btn"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Register Account</span>
              )}
            </button>

          </form>
        </div>

        {/* Footer link to login */}
        <p className="text-center text-sm text-slate-400">
          Already have an account?{' '}
          <button 
            onClick={() => changeView('login')}
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Sign in here
          </button>
        </p>

      </div>
    </div>
  );
};
