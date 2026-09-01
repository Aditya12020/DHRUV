import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, Globe } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4 py-12 text-ink">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded bg-forest-600 flex items-center justify-center text-white shadow-sm">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-xl font-serif font-bold text-ink">DHRUV</span>
          </Link>
          <h1 className="text-xl font-serif font-bold text-ink">Reset Account Password</h1>
          <p className="text-xs text-ink-light mt-1">
            Enter your registered email address to receive password reset instructions.
          </p>
        </div>

        <div className="bg-white border border-line rounded p-7 shadow-card">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="block w-full pl-9 pr-3 py-2 bg-canvas-subtle border border-line rounded text-xs text-ink placeholder:text-ink-faint focus:border-forest-600 outline-none"
                    placeholder="name@ncpor.res.in"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="btn-primary w-full text-xs py-2 mt-2"
              >
                {isLoading ? 'Sending Instructions...' : 'Send Password Reset Link'}
              </button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-3">
              <div className="w-10 h-10 bg-forest-50 border border-forest-200 text-forest-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h2 className="text-base font-serif font-bold text-ink">Check Your Email</h2>
              <p className="text-xs text-ink-light leading-relaxed">
                Password recovery instructions have been dispatched to{' '}
                <span className="font-semibold text-ink">{email}</span>.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail('');
                }}
                className="text-xs text-forest-700 hover:underline font-medium"
              >
                Did not receive? Resend request
              </button>
            </div>
          )}

          <div className="mt-5 pt-4 border-t border-line text-center">
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-1 text-xs text-ink-light hover:text-ink"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
