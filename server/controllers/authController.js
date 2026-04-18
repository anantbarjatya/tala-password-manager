import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import admin from '../config/firebase.js';

// JWT token banao aur cookie mein set karo
const sendTokenCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// ─── GOOGLE LOGIN ───────────────────────────────────────────
export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'ID token required' });
    }

    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decoded;

    let user = await User.findOne({ email });

    if (user && user.authProvider === 'local') {
      return res.status(400).json({
        message:
          'This email is registered with password login. Please use email & password.',
      });
    }

    let isNewUser = false;

    if (!user) {
      isNewUser = true;

      user = await User.create({
        name,
        email,
        googleId: uid,
        authProvider: 'google',
        avatar: picture,
        masterPasswordSet: false,
      });
    }

    sendTokenCookie(res, user._id);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        authProvider: user.authProvider,
        masterPasswordSet: !!user.masterPasswordHash,
      },
      isNewUser,
    });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(401).json({ message: 'Google authentication failed' });
  }
};

// ─── SETUP MASTER PASSWORD ──────────────────────────────────
export const setupMasterPassword = async (req, res) => {
  try {
    const { masterPassword } = req.body;

    if (!masterPassword || masterPassword.length < 6) {
      return res.status(400).json({
        message: 'Master password must be at least 6 characters',
      });
    }

    const user = await User.findById(req.user._id).select('+masterPasswordHash');

    if (user.masterPasswordHash) {
      return res.status(400).json({
        message: 'Master password already set',
      });
    }

    user.masterPasswordHash = await bcrypt.hash(masterPassword, 12);
    await user.save();

    res.json({
      success: true,
      message: 'Master password set successfully',
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── REGISTER ───────────────────────────────────────────────
export const register = async (req, res, next) => {
  try {
    const { name, email, password, masterPassword } = req.body;

    if (!name || !email || !password || !masterPassword) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: 'Email already registered',
      });
    }

    const masterPasswordHash = await bcrypt.hash(masterPassword, 12);

    const user = await User.create({
      name,
      email,
      password,
      masterPasswordHash,
      masterPasswordSet: true,
      authProvider: 'local',
    });

    sendTokenCookie(res, user._id);

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        masterPasswordSet: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── LOGIN ──────────────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password required',
      });
    }

    const user = await User.findOne({ email }).select('+password +masterPasswordHash');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    if (user.authProvider === 'google') {
      return res.status(400).json({
        message: 'Use Google Sign-In for this account',
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    sendTokenCookie(res, user._id);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        masterPasswordSet: !!user.masterPasswordHash,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── LOGOUT ─────────────────────────────────────────────────
export const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    expires: new Date(0),
  });

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
};

// ─── GET ME ────────────────────────────────────────────────
export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('+masterPasswordHash');

  res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      authProvider: user.authProvider,
      masterPasswordSet: !!user.masterPasswordHash,
    },
  });
};

// ─── VERIFY MASTER PASSWORD ───────────────────────────────
export const verifyMasterPassword = async (req, res, next) => {
  try {
    const { masterPassword } = req.body;

    const user = await User.findById(req.user._id).select('+masterPasswordHash');

    const isMatch = await user.compareMasterPassword(masterPassword);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Wrong master password',
      });
    }

    res.json({
      success: true,
      message: 'Vault unlocked',
    });
  } catch (error) {
    next(error);
  }
};