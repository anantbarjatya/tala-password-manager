import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// JWT token banao aur cookie mein set karo
const sendTokenCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('token', token, {
    httpOnly: true,   // JS se access nahi ho sakta
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 din
  });
};

// @POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, masterPassword } = req.body;

    if (!name || !email || !password || !masterPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Master password bhi bcrypt se hash karo
    const masterPasswordHash = await bcrypt.hash(masterPassword, 12);

    const user = await User.create({
      name,
      email,
      password,
      masterPasswordHash,
    });

    sendTokenCookie(res, user._id);

    res.status(201).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

// @POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Password field select karo (schema mein select:false tha)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    sendTokenCookie(res, user._id);

    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

// @POST /api/auth/logout
export const logout = (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.json({ success: true, message: 'Logged out successfully' });
};

// @GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({
    success: true,
    user: { id: req.user._id, name: req.user.name, email: req.user.email },
  });
};

// @POST /api/auth/verify-master
export const verifyMasterPassword = async (req, res, next) => {
  try {
    const { masterPassword } = req.body;
    const user = await User.findById(req.user._id).select('+masterPasswordHash');

    const isMatch = await user.compareMasterPassword(masterPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Wrong master password' });
    }

    res.json({ success: true, message: 'Vault unlocked' });
  } catch (error) {
    next(error);
  }
};