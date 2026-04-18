import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cardholderName:      { type: String, required: true, trim: true },
    bankName:            { type: String, required: true, trim: true },
    cardType:            { type: String, enum: ["credit", "debit"], default: "credit" },
    last4:               { type: String, required: true },
    encryptedCardNumber: { type: String, required: true },
    cardNumberIv:        { type: String, required: true },
    cardNumberAuthTag:   { type: String, required: true },
    encryptedCVV:        { type: String, required: true },
    cvvIv:               { type: String, required: true },
    cvvAuthTag:          { type: String, required: true },
    expiryMonth:         { type: String, required: true },
    expiryYear:          { type: String, required: true },
    notes:               { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Card", cardSchema);