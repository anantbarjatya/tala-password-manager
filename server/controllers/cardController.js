import Card from "../models/Card.js";
import { encrypt, decrypt } from "../utils/encryption.js";

// GET /api/cards
export const getCards = async (req, res) => {
  try {
    const cards = await Card.find({ userId: req.user._id }).select(
      "-encryptedCardNumber -cardNumberIv -cardNumberAuthTag -encryptedCVV -cvvIv -cvvAuthTag"
    );
    res.json(cards);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/cards
export const addCard = async (req, res) => {
  try {
    const { cardholderName, bankName, cardType, cardNumber, cvv, expiryMonth, expiryYear, notes } = req.body;

    if (!cardNumber || !cvv) {
      return res.status(400).json({ message: "Card number and CVV are required" });
    }

    // ✅ encrypt() returns: { encryptedPassword, iv, authTag }
    const encCardNumber = encrypt(cardNumber);
    const encCVV        = encrypt(cvv);

    const card = await Card.create({
      userId:              req.user._id,
      cardholderName,
      bankName,
      cardType,
      last4:               cardNumber.slice(-4),
      encryptedCardNumber: encCardNumber.encryptedPassword,  // ✅ fix
      cardNumberIv:        encCardNumber.iv,
      cardNumberAuthTag:   encCardNumber.authTag,
      encryptedCVV:        encCVV.encryptedPassword,         // ✅ fix
      cvvIv:               encCVV.iv,
      cvvAuthTag:          encCVV.authTag,
      expiryMonth,
      expiryYear,
      notes,
    });

    res.status(201).json({
      _id:            card._id,
      cardholderName: card.cardholderName,
      bankName:       card.bankName,
      cardType:       card.cardType,
      last4:          card.last4,
      expiryMonth:    card.expiryMonth,
      expiryYear:     card.expiryYear,
      notes:          card.notes,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/cards/:id/reveal
export const revealCard = async (req, res) => {
  try {
    const card = await Card.findOne({ _id: req.params.id, userId: req.user._id });
    if (!card) return res.status(404).json({ message: "Card not found" });

    // ✅ decrypt(encryptedPassword, iv, authTag) — 3 separate args
    const cardNumber = decrypt(card.encryptedCardNumber, card.cardNumberIv, card.cardNumberAuthTag);
    const cvv        = decrypt(card.encryptedCVV, card.cvvIv, card.cvvAuthTag);

    res.json({ cardNumber, cvv });
  } catch (err) {
    res.status(500).json({ message: "Decryption failed: " + err.message });
  }
};

// DELETE /api/cards/:id
export const deleteCard = async (req, res) => {
  try {
    const card = await Card.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!card) return res.status(404).json({ message: "Card not found" });
    res.json({ message: "Card deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};