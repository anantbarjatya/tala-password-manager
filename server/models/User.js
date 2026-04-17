import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false, // queries mein password auto-hide rahega
    },
    // Master password ka hash — vault lock/unlock ke liye
    masterPasswordHash: {
      type: String,
      required: [true, 'Master password is required'],
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Login ke time password compare karne ka method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Master password compare karne ka method
userSchema.methods.compareMasterPassword = async function (enteredMaster) {
  return await bcrypt.compare(enteredMaster, this.masterPasswordHash);
};

const User = mongoose.model('User', userSchema);
export default User;