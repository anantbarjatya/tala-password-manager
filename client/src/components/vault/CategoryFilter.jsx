const CATEGORIES = ['all', 'social', 'banking', 'work', 'email', 'api_key', 'other'];

const ICONS = {
  all: '🗂️', social: '💬', banking: '🏦',
  work: '💼', email: '📧', api_key: '🔑', other: '📁',
};

export default function CategoryFilter({ active, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`text-xs px-3 py-1.5 rounded-full border transition capitalize
            ${active === cat
              ? 'bg-violet-600 border-violet-600 text-white'
              : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-violet-500 hover:text-white'
            }`}
        >
          {ICONS[cat]} {cat === 'api_key' ? 'API Key' : cat}
        </button>
      ))}
    </div>
  );
}