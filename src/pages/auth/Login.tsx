import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Lock, Mail, AlertCircle, Globe, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide your email address and password.');
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      const storedUser = JSON.parse(localStorage.getItem('dhruv_user') || '{}');
      const userRole = (storedUser.role || '').toUpperCase();
      
      let redirectTarget = from;
      if (from === '/') {
        if (userRole === 'ADMIN') redirectTarget = '/admin';
        else if (userRole === 'RESEARCHER') redirectTarget = '/researcher';
      }
      
      navigate(redirectTarget, { replace: true });
    } catch (err) {
      setError('Invalid email or password credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4 py-12 text-ink">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded bg-forest-600 flex items-center justify-center text-white shadow-sm">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-xl font-serif font-bold text-ink">DHRUV</span>
          </Link>
          <h1 className="text-xl font-serif font-bold text-ink">Sign in to Knowledge Platform</h1>
          <p className="text-xs text-ink-light mt-1">
            National Centre for Polar and Ocean Research (NCPOR)
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-line rounded p-7 shadow-card">
          {error && (
            <div className="mb-5 p-3 rounded bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p className="leading-snug">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Institutional Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-3.5 w-3.5 text-ink-faint" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="block w-full pl-9 pr-3 py-2 bg-canvas-subtle border border-line rounded text-xs text-ink placeholder:text-ink-faint focus:border-forest-600 outline-none"
                  placeholder="name@ncpor.res.in"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-ink">Password</label>
                <Link
                  to="/auth/forgot-password"
                  className="text-xs text-forest-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-3.5 w-3.5 text-ink-faint" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="block w-full pl-9 pr-9 py-2 bg-canvas-subtle border border-line rounded text-xs text-ink placeholder:text-ink-faint focus:border-forest-600 outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink-faint hover:text-ink"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full text-xs py-2 mt-2"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-ink-light">
            Don't have an account?{' '}
            <Link to="/auth/register" className="font-semibold text-forest-700 hover:underline">
              Register as Researcher or Public Member
            </Link>
          </div>

          {/* Test credentials summary */}
          <div className="mt-5 pt-4 border-t border-line text-xs">
            <p className="text-[11px] font-semibold text-ink-faint uppercase tracking-wider mb-2">Seed Test Accounts</p>
            <div className="bg-canvas-subtle p-2.5 rounded border border-line/60 font-mono text-[11px] text-ink-light space-y-0.5">
              <div>Researcher: <span className="text-ink">researcher@ncpor.res.in</span></div>
              <div>Admin: <span className="text-ink">admin@ncpor.res.in</span></div>
              <div className="text-[10px] text-ink-faint pt-1 border-t border-line/40">Password: dhruv1234</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
