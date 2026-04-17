import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
            Secure Credential Manager
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 md:p-10">

          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome Back
          </h2>

          <p className="text-gray-400 text-sm mb-6">
            Sign in to access your secure vault
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-2xl mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

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
                placeholder="Enter your password"
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-500 text-white font-semibold hover:scale-[1.02] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-lg"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="text-violet-400 hover:text-violet-300 font-medium transition"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}