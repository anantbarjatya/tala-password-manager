import mongoose from 'mongoose';

const credentialSchema = new mongoose.Schema(
  {
    // Ye credential kis user ka hai
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['social', 'banking', 'work', 'email', 'api_key', 'other'],
      default: 'other',
    },
    username: {
      type: String,
      trim: true,
    },
    // Password KABHI plain text mein store nahi hoga
    encryptedPassword: {
      type: String,
      required: true,
    },
    // AES-GCM ko decrypt ke liye IV chahiye hota hai (explain below)
    iv: {
      type: String,
      required: true,
    },
    // AES-GCM authentication tag
    authTag: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Credential = mongoose.model('Credential', credentialSchema);
export default Credential;