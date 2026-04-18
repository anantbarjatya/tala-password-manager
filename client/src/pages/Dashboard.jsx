import { useState, useMemo } from 'react';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import { useVault } from '../context/VaultContext';
import { useCards } from '../context/CardContext';
import MasterPasswordPrompt from '../components/vault/MasterPasswordPrompt';
import CredentialList from '../components/vault/CredentialList';
import SearchBar from '../components/vault/SearchBar';
import CategoryFilter from '../components/vault/CategoryFilter';
import AddCredential from './AddCredential';
import AddCard from './AddCard';
import CardCard from '../components/vault/CardCard';
import SetupMasterPassword from './SetupMasterPassword';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { credentials, vaultUnlocked, lockVault, deleteCredential, loading } =
    useVault();
  const { cards} = useCards();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [editData, setEditData] = useState(null);
  const [activeTab, setActiveTab] = useState('passwords'); // 'passwords' | 'cards'
  const [showAddCard, setShowAddCard] = useState(false);

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

  const filtered = useMemo(() => {
    return credentials.filter((c) => {
      const matchSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.username?.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'all' || c.category === category;
      return matchSearch && matchCategory;
    });
  }, [credentials, search, category]);

  return (
    <div className="min-h-screen bg-[#030712] text-white">
   {!vaultUnlocked ? (
  user?.masterPasswordSet === false ? (
    <SetupMasterPassword />
  ) : (
    <MasterPasswordPrompt />
  )
) : (
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-[260px] border-r border-white/10 bg-white/[0.02] backdrop-blur-xl hidden lg:flex flex-col px-6 py-6">
            <div className="mb-8">
              <img
                src={logo}
                alt="TALA Logo"
                className="w-22 h-22 object-cover scale-150 mt-3"
              />
            </div>

            {/* Sidebar shows category filter only on passwords tab */}
            {activeTab === 'passwords' && (
              <div className="space-y-3">
                <button
                  onClick={() => setCategory('all')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition border ${
                    category === 'all'
                      ? 'bg-violet-600/20 text-white border-violet-500/30'
                      : 'bg-white/[0.02] text-gray-400 border-white/10 hover:text-white hover:border-white/20'
                  }`}
                >
                  🗂️ All
                </button>

                {[
                  ['social', '💬 Social'],
                  ['banking', '🏦 Banking'],
                  ['work', '💼 Work'],
                  ['email', '📧 Email'],
                  ['api_key', '🔑 API Key'],
                  ['other', '📁 Other'],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setCategory(key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition border ${
                      category === key
                        ? 'bg-violet-600/20 text-white border-violet-500/30'
                        : 'bg-white/[0.02] text-gray-400 border-white/10 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'cards' && (
              <div className="text-gray-500 text-sm px-2">
                <p className="text-gray-400 font-medium mb-2">💳 Card Vault</p>
                <p className="text-xs leading-relaxed">
                  Card numbers and CVVs are encrypted with AES-256-GCM — same
                  military-grade encryption as your passwords.
                </p>
              </div>
            )}
          </aside>

          {/* Main */}
          <main className="flex-1">
            {/* Topbar */}
            <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <div className="w-full max-w-xl">
                {activeTab === 'passwords' && (
                  <SearchBar value={search} onChange={setSearch} />
                )}
              </div>

              <div className="flex items-center gap-3 ml-4">
                <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="leading-tight">
                    <p className="text-xs text-gray-400">Welcome back</p>
                    <p className="text-sm font-medium">{user?.name}</p>
                  </div>
                </div>

                <button
                  onClick={lockVault}
                  className="px-4 py-2 rounded-xl border border-yellow-500/20 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition"
                >
                  🔒 Lock
                </button>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-gray-300 hover:text-red-400 transition"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-6 py-8">

              {/* Tab Switcher */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setActiveTab('passwords')}
                  className={`px-5 py-2.5 rounded-2xl text-sm font-medium transition border ${
                    activeTab === 'passwords'
                      ? 'bg-violet-600/20 text-white border-violet-500/30'
                      : 'bg-white/[0.02] text-gray-400 border-white/10 hover:text-white'
                  }`}
                >
                  🔑 Passwords ({credentials.length})
                </button>
                <button
                  onClick={() => setActiveTab('cards')}
                  className={`px-5 py-2.5 rounded-2xl text-sm font-medium transition border ${
                    activeTab === 'cards'
                      ? 'bg-violet-600/20 text-white border-violet-500/30'
                      : 'bg-white/[0.02] text-gray-400 border-white/10 hover:text-white'
                  }`}
                >
                  💳 Cards ({cards.length})
                </button>
              </div>

              {/* ── PASSWORDS TAB ── */}
              {activeTab === 'passwords' && (
                <>
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <h1 className="text-4xl font-bold tracking-tight">
                        Your Vault
                      </h1>
                      <p className="text-gray-400 mt-2">
                        Securely storing all your credentials.
                      </p>
                      <p className="text-gray-500 text-sm mt-4">
                        {credentials.length} credential
                        {credentials.length !== 1 ? 's' : ''} stored
                      </p>
                    </div>

                    <button
                      onClick={() => setShowAdd(true)}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 transition shadow-lg shadow-violet-900/30"
                    >
                      + Add New
                    </button>
                  </div>

                  {/* Mobile categories */}
                  <div className="lg:hidden mb-5">
                    <CategoryFilter active={category} onChange={setCategory} />
                  </div>

                  {loading ? (
                    <div className="flex justify-center py-24">
                      <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
                    </div>
                  ) : (
                    <CredentialList
                      credentials={filtered}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onAdd={() => setShowAdd(true)}
                    />
                  )}
                </>
              )}

              {/* ── CARDS TAB ── */}
              {activeTab === 'cards' && (
                <>
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <h1 className="text-4xl font-bold tracking-tight">
                        Card Vault
                      </h1>
                      <p className="text-gray-400 mt-2">
                        Credit & debit cards — encrypted end to end.
                      </p>
                      <p className="text-gray-500 text-sm mt-4">
                        {cards.length} card{cards.length !== 1 ? 's' : ''} stored
                      </p>
                    </div>

                    <button
                      onClick={() => setShowAddCard(true)}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 transition shadow-lg shadow-violet-900/30"
                    >
                      + Add Card
                    </button>
                  </div>

                  {cards.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                      <p className="text-5xl mb-4">💳</p>
                      <p className="text-gray-400 text-lg font-medium">
                        No cards saved yet
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        Add your first card to store it securely
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cards.map((card) => (
                        <CardCard key={card._id} card={card} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      )}

      {/* Modals */}
      {showAdd && (
        <AddCredential onClose={handleCloseModal} editData={editData} />
      )}
      {showAddCard && (
        <AddCard onClose={() => setShowAddCard(false)} />
      )}
    </div>
  );
}