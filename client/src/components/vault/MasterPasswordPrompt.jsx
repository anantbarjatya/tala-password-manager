import { useState } from 'react';
import { useVault } from '../../context/VaultContext';

export default function MasterPasswordPrompt() {
  const [masterPassword, setMasterPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { unlockVault } = useVault();

  const handleUnlock = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await unlockVault(masterPassword);
      setMasterPassword('');
    } catch {
      setError('Wrong master password!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-xl font-semibold text-white mb-2">Vault is Locked</h2>
        <p className="text-gray-400 text-sm mb-6">
          Enter your master password to access credentials
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleUnlock} className="space-y-4">
          <input
            type="password"
            required
            value={masterPassword}
            onChange={e => setMasterPassword(e.target.value)}
            placeholder="Master password"
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition text-sm"
          >
            {loading ? 'Unlocking...' : '🔓 Unlock Vault'}
          </button>
        </form>
      </div>
    </div>
  );
}