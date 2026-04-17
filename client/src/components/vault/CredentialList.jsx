import CredentialCard from './CredentialCard';

export default function CredentialList({ credentials, onEdit, onDelete }) {
  if (credentials.length === 0) {
    return (
      <div className="text-center py-20 text-gray-600">
        <p className="text-4xl mb-3">🗝️</p>
        <p className="text-sm">No credentials found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {credentials.map(cred => (
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