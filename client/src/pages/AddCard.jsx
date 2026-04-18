import { useState } from "react";
import { useCards } from "../context/CardContext";

export default function AddCard({ onClose }) {
  const { addCard } = useCards();
  const [form, setForm] = useState({
    cardholderName: "",
    bankName: "",
    cardType: "credit",
    cardNumber: "",
    cvv: "",
    expiryMonth: "",
    expiryYear: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^\d{13,19}$/.test(form.cardNumber.replace(/\s/g, ""))) {
      return setError("Enter a valid card number (13–19 digits).");
    }
    if (!/^\d{3,4}$/.test(form.cvv)) {
      return setError("CVV must be 3 or 4 digits.");
    }

    try {
      setLoading(true);
      await addCard({ ...form, cardNumber: form.cardNumber.replace(/\s/g, "") });
      onClose();
    } catch {
      setError("Failed to save card. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="font-semibold text-white">💳 Add New Card</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl transition">✕</button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Cardholder Name *</label>
              <input name="cardholderName" required value={form.cardholderName} onChange={handleChange} placeholder="John Doe" className={inputClass} />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Bank Name *</label>
              <input name="bankName" required value={form.bankName} onChange={handleChange} placeholder="HDFC / SBI / Axis" className={inputClass} />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Card Type</label>
              <select name="cardType" value={form.cardType} onChange={handleChange} className={inputClass}>
                <option value="credit">Credit Card</option>
                <option value="debit">Debit Card</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Card Number *</label>
              <input
                name="cardNumber"
                required
                value={form.cardNumber}
                onChange={(e) => setForm((p) => ({ ...p, cardNumber: formatCardNumber(e.target.value) }))}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className={inputClass + " font-mono tracking-widest"}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">CVV *</label>
                <input name="cvv" required value={form.cvv} onChange={handleChange} placeholder="•••" maxLength={4} type="password" className={inputClass + " font-mono"} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Month *</label>
                <input name="expiryMonth" required value={form.expiryMonth} onChange={handleChange} placeholder="MM" maxLength={2} className={inputClass + " font-mono"} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Year *</label>
                <input name="expiryYear" required value={form.expiryYear} onChange={handleChange} placeholder="YY" maxLength={2} className={inputClass + " font-mono"} />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Notes (optional)</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="e.g. Primary savings card" rows={2} className={inputClass + " resize-none"} />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2.5 rounded-lg text-sm transition">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm transition">
                {loading ? "Saving..." : "💾 Save Card"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}