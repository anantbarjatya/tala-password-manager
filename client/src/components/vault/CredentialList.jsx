import CredentialCard from './CredentialCard';

export default function CredentialList({
  credentials,
  onEdit,
  onDelete,
  onAdd,
}) {
  if (credentials.length === 0) {
    return (
      <div className="border border-white/10 bg-white/[0.03] rounded-3xl p-10 text-center">
        <div className="text-5xl mb-4">🔐</div>

        <h3 className="text-xl font-semibold text-white mb-2">
          No credentials found
        </h3>

        <p className="text-sm text-gray-400 mb-6">
          Add your first credential to start using your vault.
        </p>

        <button
          onClick={onAdd}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 transition"
        >
          + Add Credential
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {credentials.map((cred) => (
        <CredentialCard
          key={cred._id}
          credential={cred}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}