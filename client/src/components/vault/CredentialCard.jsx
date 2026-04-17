import { useState } from 'react';
import { useVault } from '../../context/VaultContext';

const CATEGORY_ICONS = {
  social: '💬',
  banking: '🏦',
  work: '💼',
  email: '📧',
  api_key: '🔑',
  other: '📁',
};

export default function CredentialCard({
  credential,
  onEdit,
  onDelete,
}) {
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

    setTimeout(() => {
      setCopied('');
    }, 2000);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 transition-all hover:border-white/20 hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-lg shrink-0">
            {CATEGORY_ICONS[credential.category] || '📁'}
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-white truncate">
              {credential.title}
            </h3>

            {credential.website && (
              <a
                href={credential.website}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-violet-400 hover:text-violet-300 truncate block mt-1"
              >
                {credential.website}
              </a>
            )}
          </div>
        </div>

        <span className="text-[11px] px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 capitalize shrink-0">
          {credential.category === 'api_key'
            ? 'API Key'
            : credential.category}
        </span>
      </div>

      {/* Username */}
      {credential.username && (
        <div className="rounded-2xl bg-black/20 border border-white/5 px-4 py-3 mb-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">
              Username
            </p>

            <p className="text-sm text-white truncate">
              {credential.username}
            </p>
          </div>

          <button
            onClick={() =>
              copyText(credential.username, 'username')
            }
            className="text-xs px-2 py-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition shrink-0"
          >
            {copied === 'username' ? '✅' : '📋'}
          </button>
        </div>
      )}

      {/* Password */}
      <div className="rounded-2xl bg-black/20 border border-white/5 px-4 py-3 mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">
            Password
          </p>

          <p className="text-sm text-white font-mono truncate">
            {revealed ? password : '••••••••••••'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleReveal}
            disabled={loading}
            className="text-xs px-2 py-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition"
          >
            {loading ? '⏳' : revealed ? '🙈' : '👁️'}
          </button>

          {revealed && (
            <button
              onClick={() => copyText(password, 'password')}
              className="text-xs px-2 py-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition"
            >
              {copied === 'password' ? '✅' : '📋'}
            </button>
          )}
        </div>
      </div>

      {/* Notes */}
      {credential.notes && (
        <div className="rounded-2xl bg-black/20 border border-white/5 px-4 py-3 mb-4">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">
            Notes
          </p>

          <p className="text-sm text-gray-300 line-clamp-3">
            {credential.notes}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onEdit(credential)}
          className="py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-sm text-gray-200 hover:bg-white/[0.06] transition"
        >
           Edit
        </button>

        <button
          onClick={() => onDelete(credential._id)}
          className="py-2.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 hover:bg-red-500/20 transition"
        >
           Delete
        </button>
      </div>
    </div>
  );
}