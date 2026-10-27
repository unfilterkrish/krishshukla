import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import Input from '../components/Input';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await register(formData.name, formData.email, formData.password);
      toast.success(`Account created! Welcome to Prompt Vault AI, ${user.name}!`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed.';
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
            Start with one good idea
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.08]">
            Make room for better prompts.
          </h1>
          <p className="mt-5 max-w-sm text-base leading-7 text-[#62665d]">
            Create your own vault and keep the prompts, variations and little tweaks you want to use again.
          </p>
          <div className="mt-10 border-l-2 border-[#ad5539] pl-4 text-sm leading-6 text-[#62665d]">
            No demo account needed. Sign up with your own email and password.
          </div>
        </section>

        <section className="w-full max-w-md mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">Create your account</h2>
            <p className="mt-2 text-sm text-[#62665d]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-[#ad5539] hover:text-[#8d422d] underline underline-offset-4"
          >
            Sign in
          </Link>
            </p>
          </div>

        <div className="bg-[#fffdfa] border border-[#e1dbcf] py-8 px-6 sm:px-9 shadow-[0_12px_36px_rgba(45,48,39,0.07)] rounded-xl">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name */}
            <Input
              label="Full Name"
              name="name"
              type="text"
              required
              placeholder="e.g. Alex Mercer"
              icon={User}
              labelClassName="!text-[#555a50]"
              className="!bg-white !border-[#d8d3c8] !text-[#252720] placeholder:!text-[#96988f] focus:!border-[#ad5539] focus:!ring-[#ad5539]/20"
              value={formData.name}
              onChange={handleChange}
            />

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
              label="Password (min 6 characters)"
              name="password"
              type={showPassword ? 'text' : 'password'}
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

            {/* Confirm Password */}
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••"
              icon={Lock}
              labelClassName="!text-[#555a50]"
              className="!bg-white !border-[#d8d3c8] !text-[#252720] placeholder:!text-[#96988f] focus:!border-[#ad5539] focus:!ring-[#ad5539]/20"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full"
              >
                <span>Create Account</span>
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

export default RegisterPage;
