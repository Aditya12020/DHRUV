import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Building, AlertCircle, Globe, Eye, EyeOff } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institution: '',
    role: 'PUBLIC',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const user = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.institution,
        formData.role
      );

      const userRole = (user?.role || formData.role || '').toUpperCase();
      if (userRole === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else if (userRole === 'RESEARCHER') {
        navigate('/researcher', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please verify your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4 py-12 text-ink">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded bg-forest-600 flex items-center justify-center text-white shadow-sm">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-xl font-serif font-bold text-ink">DHRUV</span>
          </Link>
          <h1 className="text-xl font-serif font-bold text-ink">Create Polar Archive Account</h1>
          <p className="text-xs text-ink-light mt-1">
            Join the Indian Polar Science Research &amp; Knowledge Community
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
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Full Name <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-3.5 w-3.5 text-ink-faint" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  className="block w-full pl-9 pr-3 py-2 bg-canvas-subtle border border-line rounded text-xs text-ink placeholder:text-ink-faint focus:border-forest-600 outline-none"
                  placeholder="Dr. Rajesh Kumar"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Institutional Email Address <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-3.5 w-3.5 text-ink-faint" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="block w-full pl-9 pr-3 py-2 bg-canvas-subtle border border-line rounded text-xs text-ink placeholder:text-ink-faint focus:border-forest-600 outline-none"
                  placeholder="name@ncpor.res.in"
                />
              </div>
            </div>

            {/* Institution */}
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Institution / University <span className="text-ink-faint font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-3.5 w-3.5 text-ink-faint" />
                </div>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  className="block w-full pl-9 pr-3 py-2 bg-canvas-subtle border border-line rounded text-xs text-ink placeholder:text-ink-faint focus:border-forest-600 outline-none"
                  placeholder="e.g. NCPOR Goa / IIT Delhi / CSIR"
                />
              </div>
            </div>

            {/* Account Type */}
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Account Type <span className="text-red-600">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full px-3 py-2 bg-canvas-subtle border border-line rounded text-xs text-ink focus:border-forest-600 outline-none"
              >
                <option value="PUBLIC">Public User / Enthusiast</option>
                <option value="RESEARCHER">Researcher / Scientist (Upload &amp; Publish)</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-3.5 w-3.5 text-ink-faint" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className="block w-full pl-9 pr-9 py-2 bg-canvas-subtle border border-line rounded text-xs text-ink placeholder:text-ink-faint focus:border-forest-600 outline-none"
                  placeholder="Minimum 8 characters"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Confirm Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-3.5 w-3.5 text-ink-faint" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className="block w-full pl-9 pr-9 py-2 bg-canvas-subtle border border-line rounded text-xs text-ink placeholder:text-ink-faint focus:border-forest-600 outline-none"
                  placeholder="Repeat password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink-faint hover:text-ink"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full text-xs py-2 mt-2"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-ink-light">
            Already have an account?{' '}
            <Link to="/auth/login" className="font-semibold text-forest-700 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
