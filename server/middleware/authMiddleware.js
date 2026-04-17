import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  try {
    // Token cookie mein se lo (localStorage nahi!)
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, please login' });
    }

    // Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // User DB se lo (password ke bina)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};

export default protect;
