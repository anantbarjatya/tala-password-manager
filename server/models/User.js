import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      select: false,
      default: null,
    },

    masterPasswordHash: {
      type: String,
      select: false,
      default: null,
    },

    masterPasswordSet: {
      type: Boolean,
      default: false,
    },

    googleId: {
      type: String,
      default: null,
    },

    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },

    avatar: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Compare normal password
userSchema.methods.comparePassword = async function (entered) {
  if (!this.password) return false;
  return await bcrypt.compare(entered, this.password);
};

// Compare master password
userSchema.methods.compareMasterPassword = async function (entered) {
  if (!this.masterPasswordHash) return false;
  return await bcrypt.compare(entered, this.masterPasswordHash);
};

// Hash password before save (only login password, NOT masterPasswordHash)
userSchema.pre('save', async function () {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  // masterPasswordHash controller mein already hash hoti hai
  // isliye yahan dobara hash NAHI karenge
});

export default mongoose.model('User', userSchema);