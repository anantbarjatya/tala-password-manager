import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useVault } from '../context/VaultContext';
import MasterPasswordPrompt from '../components/vault/MasterPasswordPrompt';
import CredentialList from '../components/vault/CredentialList';
import SearchBar from '../components/vault/SearchBar';
import CategoryFilter from '../components/vault/CategoryFilter';
import AddCredential from './AddCredential';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { credentials, vaultUnlocked, lockVault, deleteCredential, loading } = useVault();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleLogout = async () => {
    lockVault();
    await logout();
  };

  const handleEdit = (credential) => {
    setEditData(credential);
    setShowAdd(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this credential?')) {
      await deleteCredential(id);
    }
  };

  const handleCloseModal = () => {
    setShowAdd(false);
    setEditData(null);
  };

  // Search + filter
  const filtered = useMemo(() => {
    return credentials.filter(c => {
      const matchSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.username?.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'all' || c.category === category;
      return matchSearch && matchCategory;
    });
  }, [credentials, search, category]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 bg-gray-950 z-10">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔐</span>
          <span className="font-bold text-lg">Tala</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm hidden sm:block">
            Hey, {user?.name} 👋
          </span>
          {vaultUnlocked && (
            <button
              onClick={lockVault}
              className="text-xs text-yellow-400 hover:text-yellow-300 border border-yellow-400/30 px-3 py-1.5 rounded-lg transition"
            >
              🔒 Lock
            </button>
          )}
          <button
            onClick={handleLogout}
            className="text-xs text-gray-400 hover:text-red-400 border border-gray-700 px-3 py-1.5 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Vault Locked */}
        {!vaultUnlocked ? (
          <MasterPasswordPrompt />
        ) : (
          <>
            {/* Top bar */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Your Vault</h2>
                <p className="text-gray-400 text-sm mt-0.5">
                  {credentials.length} credential{credentials.length !== 1 ? 's' : ''} stored
                </p>
              </div>
              <button
                onClick={() => setShowAdd(true)}
                className="bg-violet-600 hover:bg-violet-700 text-white text-sm px-4 py-2.5 rounded-lg transition"
              >
                + Add New
              </button>
            </div>

            {/* Search + Filter */}
            <div className="space-y-3 mb-6">
              <SearchBar value={search} onChange={setSearch} />
              <CategoryFilter active={category} onChange={setCategory} />
            </div>

            {/* Credentials */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <CredentialList
                credentials={filtered}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showAdd && (
        <AddCredential
          onClose={handleCloseModal}
          editData={editData}
        />
      )}
    </div>
  );
}