import { useState, useCallback } from 'react';

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
  const [pwnedStatus, setPwnedStatus] = useState(null);

  const generate = useCallback(() => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const nums  = '0123456789';
    const syms  = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = '';
    if (options.uppercase) chars += upper;
    if (options.lowercase) chars += lower;
    if (options.numbers)   chars += nums;
    if (options.symbols)   chars += syms;
    if (!chars) return;

    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    setPassword(result);
    setPwnedStatus(null); // reset on new generate
    setCopied(false);
  }, [length, options]);

  const copyToClipboard = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const checkPwned = async () => {
    if (!password) return;
    setPwnedStatus('checking');
    try {
      // k-anonymity: sirf first 5 chars of SHA-1 hash API ko jaate hain
      // Full password kabhi bhi network pe nahi jaata
      const msgBuffer  = new TextEncoder().encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
      const hashArray  = Array.from(new Uint8Array(hashBuffer));
      const hash       = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();

      const prefix = hash.slice(0, 5);
      const suffix = hash.slice(5);

      const res  = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      const text = await res.text();

      const match = text.split('\n').find((line) => line.startsWith(suffix));

      if (match) {
        const count = parseInt(match.split(':')[1].trim(), 10);
        setPwnedStatus({ breached: true, count });
      } else {
        setPwnedStatus({ breached: false });
      }
    } catch {
      setPwnedStatus('error');
    }
  };

  const getStrength = () => {
    const active = Object.values(options).filter(Boolean).length;
    if (length >= 16 && active === 4) return { label: 'Strong', color: 'text-green-400' };
    if (length >= 12 && active >= 3)  return { label: 'Medium', color: 'text-yellow-400' };
    return { label: 'Weak', color: 'text-red-400' };
  };

  const strength = password ? getStrength() : null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-semibold text-gray-300">🎲 Password Generator</h3>

      {/* Password display */}
      <div className="bg-gray-800 rounded-lg px-4 py-3 flex items-center justify-between gap-3 min-h-[44px]">
        <span className="text-sm font-mono text-violet-300 break-all">
          {password || <span className="text-gray-600">Click generate...</span>}
        </span>
        {password && (
          <button onClick={copyToClipboard} className="text-xs text-gray-400 hover:text-white shrink-0 transition">
            {copied ? '✅' : '📋'}
          </button>
        )}
      </div>

      {strength && (
        <p className={`text-xs ${strength.color}`}>Strength: {strength.label}</p>
      )}

      {/* Length */}
      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>Length</span>
          <span className="text-white font-medium">{length}</span>
        </div>
        <input
          type="range" min="8" max="32"
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
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={generate}
          className="flex-1 bg-violet-600 hover:bg-violet-700 text-white text-xs py-2 rounded-lg transition"
        >
          ⚡ Generate
        </button>

        <button
          onClick={checkPwned}
          disabled={!password || pwnedStatus === 'checking'}
          className="flex-1 bg-gray-700 hover:bg-gray-600 border border-white/10 disabled:opacity-40 text-white text-xs py-2 rounded-lg transition"
        >
          {pwnedStatus === 'checking' ? '🔍 Checking...' : '🛡️ Check Breach'}
        </button>

        {password && onUse && (
          <button
            onClick={() => onUse(password)}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs py-2 rounded-lg transition"
          >
            ✅ Use This
          </button>
        )}
      </div>

      {/* Pwned Result */}
      {pwnedStatus && pwnedStatus !== 'checking' && (
        <div className={`rounded-lg px-4 py-3 text-xs font-medium ${
          pwnedStatus === 'error'
            ? 'bg-gray-700/50 border border-white/10 text-gray-300'
            : pwnedStatus.breached
            ? 'bg-red-900/40 border border-red-500/40 text-red-300'
            : 'bg-green-900/40 border border-green-500/40 text-green-300'
        }`}>
          {pwnedStatus === 'error' && '⚠️ Could not reach breach database. Check your connection.'}
          {pwnedStatus.breached && (
            <>🚨 <strong>Compromised!</strong> Found in <strong>{pwnedStatus.count.toLocaleString()}</strong> data breaches. Do not use this.</>
          )}
          {pwnedStatus.breached === false && '✅ Safe! Not found in any known data breach.'}
        </div>
      )}
    </div>
  );
}