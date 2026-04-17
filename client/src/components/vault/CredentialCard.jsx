import { useState } from 'react';
import { useVault } from '../../context/VaultContext';

const CATEGORY_ICONS = {
  social: '💬', banking: '🏦', work: '💼',
  email: '📧', api_key: '🔑', other: '📁',
};

export default function CredentialCard({ credential, onEdit, onDelete }) {
  const { revealPassword } = useVault();
  const [revealed, setRevealed] = useState(false);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReveal = async () => {
    if (revealed) {
      setRevealed(false);
      setPassword('');
      return;
    }
    setLoading(true);
    try {
      const plain = await revealPassword(credential._id);
      setPassword(plain);
      setRevealed(true);
    } catch {
      alert('Could not reveal password');
    } finally {
      setLoading(false);
    }
  };

  const copyText = async (text, field) => {
    await navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-5 transition">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center text-lg">
            {CATEGORY_ICONS[credential.category] || '📁'}
          </div>
          <div>
            <p className="font-medium text-white">{credential.title}</p>
            {credential.website && (
                <a
                href={credential.website}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-violet-400 hover:underline"
              >
                {credential.website}
              </a>
            )}
          </div>
        </div>
        <span className="text-xs bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded-full capitalize">
          {credential.category === 'api_key' ? 'API Key' : credential.category}
        </span>
      </div>

      {/* Username */}
      {credential.username && (
        <div className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2 mb-2">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Username</p>
            <p className="text-sm text-white">{credential.username}</p>
          </div>
          <button
            onClick={() => copyText(credential.username, 'username')}
            className="text-gray-500 hover:text-white text-xs transition"
          >
            {copied === 'username' ? '✅' : '📋'}
          </button>
        </div>
      )}

      {/* Password */}
      <div className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2 mb-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 mb-0.5">Password</p>
          <p className="text-sm text-white font-mono truncate">
            {revealed ? password : '••••••••••••'}
          </p>
        </div>
        <div className="flex gap-2 ml-2 shrink-0">
          <button
            onClick={handleReveal}
            disabled={loading}
            className="text-gray-500 hover:text-white text-xs transition"
          >
            {loading ? '⏳' : revealed ? '🙈' : '👁️'}
          </button>
          {revealed && (
            <button
              onClick={() => copyText(password, 'password')}
              className="text-gray-500 hover:text-white text-xs transition"
            >
              {copied === 'password' ? '✅' : '📋'}
            </button>
          )}
        </div>
      </div>

      {/* Notes */}
      {credential.notes && (
        <p className="text-xs text-gray-500 mb-4 bg-gray-800 rounded-lg px-3 py-2">
          📝 {credential.notes}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(credential)}
          className="flex-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg transition"
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => onDelete(credential._id)}
          className="flex-1 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 rounded-lg transition"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}