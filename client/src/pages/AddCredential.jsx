import { useState } from 'react';
import { useVault } from '../context/VaultContext';
import PasswordGenerator from '../components/vault/PasswordGenerator';

const CATEGORIES = ['social', 'banking', 'work', 'email', 'api_key', 'other'];

export default function AddCredential({ onClose, editData }) {
  const { addCredential, updateCredential } = useVault();
  const isEdit = !!editData;

  const [form, setForm] = useState({
    title: editData?.title || '',
    category: editData?.category || 'other',
    username: editData?.username || '',
    password: '',
    website: editData?.website || '',
    notes: editData?.notes || '',
  });
  const [showGenerator, setShowGenerator] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isEdit && !form.password) {
      return setError('Password is required');
    }

    setLoading(true);
    try {
      if (isEdit) {
        await updateCredential(editData._id, form);
      } else {
        await addCredential(form);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="font-semibold text-white">
            {isEdit ? '✏️ Edit Credential' : '➕ Add Credential'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition text-xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Gmail, Netflix"
                className={inputClass}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className={inputClass}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'api_key' ? 'API Key' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Username / Email</label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="anant@gmail.com"
                className={inputClass}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-gray-400">
                  Password {!isEdit && '*'}
                </label>
                <button
                  type="button"
                  onClick={() => setShowGenerator(!showGenerator)}
                  className="text-xs text-violet-400 hover:text-violet-300 transition"
                >
                  🎲 {showGenerator ? 'Hide' : 'Generate'}
                </button>
              </div>
              <input
                type="password"
                required={!isEdit}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder={isEdit ? 'Leave blank to keep current' : 'Enter password'}
                className={inputClass}
              />
            </div>

            {/* Password Generator */}
            {showGenerator && (
              <PasswordGenerator
                onUse={(pwd) => {
                  setForm({ ...form, password: pwd });
                  setShowGenerator(false);
                }}
              />
            )}

            {/* Website */}
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Website (optional)</label>
              <input
                type="url"
                value={form.website}
                onChange={e => setForm({ ...form, website: e.target.value })}
                placeholder="https://gmail.com"
                className={inputClass}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Notes (optional)</label>
              <textarea
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                placeholder="Any extra info..."
                rows={3}
                className={inputClass + ' resize-none'}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2.5 rounded-lg text-sm transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm transition"
              >
                {loading ? 'Saving...' : isEdit ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}