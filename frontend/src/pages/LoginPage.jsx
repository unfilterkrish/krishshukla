import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bookmark, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import Input from '../components/Input';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await login(formData.email, formData.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed. Please check credentials.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f0e8] text-[#252720] flex flex-col justify-center py-10 px-4 sm:px-6">
      <main className="w-full max-w-5xl mx-auto grid md:grid-cols-[1fr_0.9fr] gap-10 md:gap-16 items-center">
        <section className="max-w-md mx-auto md:mx-0">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <span className="w-10 h-10 rounded-lg bg-[#2c332b] flex items-center justify-center text-[#f4f0e8]">
              <Bookmark className="w-5 h-5" />
            </span>
            <span className="text-xl font-bold tracking-tight">
              PromptVault <span className="text-[#ad5539]">AI</span>
            </span>
          </Link>
          <p className="mt-14 text-xs font-semibold uppercase tracking-[0.18em] text-[#ad5539]">
            Your working library
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.08]">
            Good prompts are worth keeping.
          </h1>
          <p className="mt-5 max-w-sm text-base leading-7 text-[#62665d]">
            Pick up where you left off. Your saved prompts, notes and favourites are waiting in your vault.
          </p>
          <div className="mt-10 border-l-2 border-[#ad5539] pl-4 text-sm leading-6 text-[#62665d]">
            A quieter place to collect the instructions that work for you.
          </div>
        </section>

        <section className="w-full max-w-md mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
            <p className="mt-2 text-sm text-[#62665d]">
          Or{' '}
          <Link
            to="/register"
            className="font-semibold text-[#ad5539] hover:text-[#8d422d] underline underline-offset-4"
          >
            create an account
          </Link>
            </p>
          </div>

        <div className="bg-[#fffdfa] border border-[#e1dbcf] py-8 px-6 sm:px-9 shadow-[0_12px_36px_rgba(45,48,39,0.07)] rounded-xl">
          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <Input
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@domain.com"
              icon={Mail}
              labelClassName="!text-[#555a50]"
              className="!bg-white !border-[#d8d3c8] !text-[#252720] placeholder:!text-[#96988f] focus:!border-[#ad5539] focus:!ring-[#ad5539]/20"
              value={formData.email}
              onChange={handleChange}
            />

            {/* Password */}
            <Input
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              placeholder="••••••••"
              icon={Lock}
              labelClassName="!text-[#555a50]"
              className="!bg-white !border-[#d8d3c8] !text-[#252720] placeholder:!text-[#96988f] focus:!border-[#ad5539] focus:!ring-[#ad5539]/20"
              value={formData.password}
              onChange={handleChange}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#777b72] hover:text-[#252720]"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
            />

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </form>

        </div>
        </section>
      </main>
    </div>
  );
};

export default LoginPage;
