import { useState } from 'react';

export default function PasswordGenerator({ onUse }) {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const nums = '0123456789';
    const syms = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = '';
    if (options.uppercase) chars += upper;
    if (options.lowercase) chars += lower;
    if (options.numbers) chars += nums;
    if (options.symbols) chars += syms;

    if (!chars) return;

    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    setPassword(result);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrength = () => {
    const active = Object.values(options).filter(Boolean).length;
    if (length >= 16 && active === 4) return { label: 'Strong', color: 'text-green-400' };
    if (length >= 12 && active >= 3) return { label: 'Medium', color: 'text-yellow-400' };
    return { label: 'Weak', color: 'text-red-400' };
  };

  const strength = password ? getStrength() : null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-semibold text-gray-300">🎲 Password Generator</h3>

      {/* Generated password display */}
      <div className="bg-gray-800 rounded-lg px-4 py-3 flex items-center justify-between gap-3 min-h-[44px]">
        <span className="text-sm font-mono text-violet-300 break-all">
          {password || <span className="text-gray-600">Click generate...</span>}
        </span>
        {password && (
          <button
            onClick={copyToClipboard}
            className="text-xs text-gray-400 hover:text-white shrink-0 transition"
          >
            {copied ? '✅' : '📋'}
          </button>
        )}
      </div>

      {strength && (
        <p className={`text-xs ${strength.color}`}>Strength: {strength.label}</p>
      )}

      {/* Length slider */}
      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>Length</span>
          <span className="text-white font-medium">{length}</span>
        </div>
        <input
          type="range"
          min="8" max="32"
          value={length}
          onChange={e => setLength(Number(e.target.value))}
          className="w-full accent-violet-500"
        />
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(options).map(([key, val]) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={val}
              onChange={() => setOptions(prev => ({ ...prev, [key]: !prev[key] }))}
              className="accent-violet-500"
            />
            <span className="text-xs text-gray-400 capitalize">{key}</span>
          </label>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={generate}
          className="flex-1 bg-violet-600 hover:bg-violet-700 text-white text-xs py-2 rounded-lg transition"
        >
          Generate
        </button>
        {password && onUse && (
          <button
            onClick={() => onUse(password)}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs py-2 rounded-lg transition"
          >
            Use This
          </button>
        )}
      </div>
    </div>
  );
}