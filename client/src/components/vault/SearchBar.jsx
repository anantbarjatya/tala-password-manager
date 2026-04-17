export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search credentials..."
        className="w-full bg-gray-900 border border-gray-800 text-white rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs"
        >
          ✕
        </button>
      )}
    </div>
  );
}