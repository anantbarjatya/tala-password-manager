const CATEGORIES = [
  'all',
  'social',
  'banking',
  'work',
  'email',
  'api_key',
  'other',
];

const ICONS = {
  all: '🗂️',
  social: '💬',
  banking: '🏦',
  work: '💼',
  email: '📧',
  api_key: '🔑',
  other: '📁',
};

export default function CategoryFilter({ active, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {CATEGORIES.map((cat) => {
        const isActive = active === cat;

        return (
          <button
  key={cat}
  onClick={() => onChange(cat)}
  className={`px-4 py-2 rounded-2xl border text-sm transition-all capitalize flex items-center gap-2 min-w-fit ${
    isActive
      ? 'bg-violet-600/20 border-violet-500/30 text-white'
      : 'bg-white/[0.03] border-white/10 text-gray-400 hover:text-white hover:border-white/20'
  }`}
>
  <span className="text-2xl leading-none">{ICONS[cat]}</span>
  <span className="whitespace-nowrap">
    {cat === 'api_key' ? 'API Key' : cat}
  </span>
</button>
        );
      })}
    </div>
  );
}