export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative group">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm group-focus-within:text-violet-400 transition">
        🔍
      </span>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search credentials..."
        className="w-full bg-white/[0.03] border border-white/10 text-white rounded-2xl pl-11 pr-11 py-3 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
      />

      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs transition"
        >
          ✕
        </button>
      )}
    </div>
  );
}