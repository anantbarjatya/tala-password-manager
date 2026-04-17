import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    masterPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Password Strength Meter
  const passwordStrength = useMemo(() => {
    const password = form.password;

    if (!password) {
      return {
        score: 0,
        label: '',
        color: 'bg-gray-700',
        textColor: 'text-gray-400',
      };
    }

    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
      { label: 'Very Weak', color: 'bg-red-500', textColor: 'text-red-400' },
      { label: 'Weak', color: 'bg-orange-500', textColor: 'text-orange-400' },
      { label: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-400' },
      { label: 'Good', color: 'bg-blue-500', textColor: 'text-blue-400' },
      { label: 'Strong', color: 'bg-green-500', textColor: 'text-green-400' },
      {
        label: 'Very Strong',
        color: 'bg-emerald-500',
        textColor: 'text-emerald-400',
      },
    ];

    return { score, ...levels[score] };
  }, [form.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 8) {
      return setError('Password must be at least 8 characters');
    }

    if (form.masterPassword.length < 6) {
      return setError('Master password must be at least 6 characters');
    }

    setLoading(true);

    try {
      await register(
        form.name,
        form.email,
        form.password,
        form.masterPassword
      );

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 relative flex items-center justify-center px-4 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 blur-[140px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-500/10 blur-[120px] rounded-full"></div>

      <div className="relative w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-cyan-400/20 blur-3xl rounded-full"></div>

            <img
              src={logo}
              alt="TALA Logo"
              className="relative w-40 h-40 object-cover mx-auto scale-200"
            />
          </div>

         <p className="text-gray-400 text-lg mt-2 tracking-wide">
            Create Your Secure Vault
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 md:p-10">
          <h2 className="text-3xl font-bold text-white mb-2">
            Create Account
          </h2>

          <p className="text-gray-400 text-sm mb-6">
            Start managing your credentials securely
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-2xl mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Full Name
              </label>

              <input
                type="text"
                required
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Enter your full name"
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Email Address
              </label>

              <input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                placeholder="Enter your email"
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Password
              </label>

              <input
                type="password"
                required
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                placeholder="Minimum 8 characters"
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />

              {/* Strength Meter */}
              {form.password && (
                <div className="mt-3">
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all ${
                          i < passwordStrength.score
                            ? passwordStrength.color
                            : 'bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>

                  <p
                    className={`text-xs font-medium ${passwordStrength.textColor}`}
                  >
                    {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Master Password */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Master Password
              </label>

              <input
                type="password"
                required
                value={form.masterPassword}
                onChange={(e) =>
                  setForm({
                    ...form,
                    masterPassword: e.target.value,
                  })
                }
                placeholder="Create a strong master password"
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />

              <p className="text-xs text-amber-400 mt-2">
                ⚠ Keep this safe. Without it, your vault cannot be recovered.
              </p>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-500 text-white font-semibold hover:scale-[1.02] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-lg"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-violet-400 hover:text-violet-300 font-medium transition"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}