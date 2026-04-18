import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

export default function SetupMasterPassword() {
  const [masterPassword, setMasterPassword] = useState('');
  const [confirm, setConfirm]               = useState('');
  const [error, setError]                   = useState('');
  const [loading, setLoading]               = useState(false);
  const { setupMasterPassword }             = useAuth();
  const navigate                            = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (masterPassword.length < 6) {
      return setError('Master password must be at least 6 characters');
    }
    if (masterPassword !== confirm) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      await setupMasterPassword(masterPassword);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 relative flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 blur-[140px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-500/10 blur-[120px] rounded-full" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logo} alt="TALA" className="w-40 h-40 object-cover mx-auto scale-150" />
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
          <div className="text-4xl mb-4 text-center">🔐</div>
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            Set Master Password
          </h2>
          <p className="text-gray-400 text-sm mb-6 text-center">
            This protects your vault even if your Google account is compromised.
            <span className="block mt-2 text-amber-400 text-xs">
              ⚠️ This cannot be recovered. Store it safely.
            </span>
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-2xl mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Master Password</label>
              <input
                type="password"
                required
                value={masterPassword}
                onChange={e => setMasterPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Confirm Master Password</label>
              <input
                type="password"
                required
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Re-enter master password"
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-500 text-white font-semibold hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-lg"
            >
              {loading ? 'Setting up...' : '🔐 Set Master Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}