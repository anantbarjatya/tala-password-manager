import { useState } from "react";
import { useCards } from "../../context/CardContext";

export default function CardCard({ card }) {
  const { deleteCard, revealCard } = useCards();
  const [revealed, setRevealed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");

  const handleReveal = async () => {
    if (revealed) return setRevealed(null);
    try {
      setLoading(true);
      const data = await revealCard(card._id);
      setRevealed(data);
    } catch {
      alert("Failed to reveal card details.");
    } finally {
      setLoading(false);
    }
  };

  const copy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  const gradient = card.cardType === "credit"
    ? "from-violet-900/60 to-fuchsia-900/60"
    : "from-gray-800/60 to-gray-900/60";

  return (
    <div className={`rounded-3xl border border-white/10 bg-gradient-to-br ${gradient} backdrop-blur-xl p-5 space-y-4 transition hover:border-white/20`}>

      {/* Top */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-[11px] uppercase tracking-widest">
            {card.cardType} card
          </p>
          <p className="text-white font-bold text-lg mt-0.5">{card.bankName}</p>
        </div>
        <span className="text-3xl">💳</span>
      </div>

      {/* Card Number */}
      <div className="rounded-2xl bg-black/20 border border-white/5 px-4 py-3">
        <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Card Number</p>
        <div className="flex items-center justify-between gap-2">
          <p className="font-mono text-white tracking-widest text-sm">
            {revealed
              ? revealed.cardNumber.replace(/(.{4})/g, "$1 ").trim()
              : `•••• •••• •••• ${card.last4}`}
          </p>
          {revealed && (
            <button onClick={() => copy(revealed.cardNumber, "card")} className="text-gray-400 hover:text-white text-xs transition">
              {copied === "card" ? "✅" : "📋"}
            </button>
          )}
        </div>
      </div>

      {/* Cardholder + Expiry + CVV */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-1">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Expires</p>
          <p className="text-white text-sm font-mono">{card.expiryMonth}/{card.expiryYear}</p>
        </div>

        <div className="col-span-1">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">CVV</p>
          <div className="flex items-center gap-1">
            <p className="text-white text-sm font-mono">
              {revealed ? revealed.cvv : "•••"}
            </p>
            {revealed && (
              <button onClick={() => copy(revealed.cvv, "cvv")} className="text-gray-400 hover:text-white text-xs transition">
                {copied === "cvv" ? "✅" : "📋"}
              </button>
            )}
          </div>
        </div>

        <div className="col-span-1">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Holder</p>
          <p className="text-white text-xs truncate">{card.cardholderName}</p>
        </div>
      </div>

      {card.notes && (
        <p className="text-gray-500 text-xs italic px-1">{card.notes}</p>
      )}

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleReveal}
          disabled={loading}
          className="py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-sm text-gray-200 hover:bg-white/[0.06] transition"
        >
          {loading ? "⏳" : revealed ? "🙈 Hide" : "👁️ Reveal"}
        </button>
        <button
          onClick={() => { if (window.confirm("Delete this card?")) deleteCard(card._id); }}
          className="py-2.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 hover:bg-red-500/20 transition"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}