import Credential from '../models/Credential.js';
import { encrypt, decrypt } from '../utils/encryption.js';

// @GET /api/credentials
export const getCredentials = async (req, res, next) => {
  try {
    // Sirf is user ki credentials lao, encrypted form mein
    const credentials = await Credential.find({ userId: req.user._id })
      .select('-encryptedPassword -iv -authTag'); // list mein password mat dikhao

    res.json({ success: true, credentials });
  } catch (error) {
    next(error);
  }
};

// @POST /api/credentials
export const createCredential = async (req, res, next) => {
  try {
    const { title, category, username, password, website, notes } = req.body;

    if (!title || !password) {
      return res.status(400).json({ message: 'Title and password required' });
    }

    // Password encrypt karo save karne se pehle
    const { encryptedPassword, iv, authTag } = encrypt(password);

    const credential = await Credential.create({
      userId: req.user._id,
      title,
      category,
      username,
      encryptedPassword,
      iv,
      authTag,
      website,
      notes,
    });

    res.status(201).json({ success: true, credential });
  } catch (error) {
    next(error);
  }
};

// @GET /api/credentials/:id/reveal
// Jab user "show password" kare tab
export const revealPassword = async (req, res, next) => {
  try {
    const credential = await Credential.findOne({
      _id: req.params.id,
      userId: req.user._id, // dusre user ki credential nahi dekh sakta
    });

    if (!credential) {
      return res.status(404).json({ message: 'Credential not found' });
    }

    const plainPassword = decrypt(
      credential.encryptedPassword,
      credential.iv,
      credential.authTag
    );

    res.json({ success: true, password: plainPassword });
  } catch (error) {
    next(error);
  }
};

// @PUT /api/credentials/:id
export const updateCredential = async (req, res, next) => {
  try {
    const { title, category, username, password, website, notes } = req.body;

    const credential = await Credential.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!credential) {
      return res.status(404).json({ message: 'Credential not found' });
    }

    // Agar password badla toh re-encrypt karo
    if (password) {
      const { encryptedPassword, iv, authTag } = encrypt(password);
      credential.encryptedPassword = encryptedPassword;
      credential.iv = iv;
      credential.authTag = authTag;
    }

    credential.title = title || credential.title;
    credential.category = category || credential.category;
    credential.username = username || credential.username;
    credential.website = website || credential.website;
    credential.notes = notes || credential.notes;

    await credential.save();
    res.json({ success: true, credential });
  } catch (error) {
    next(error);
  }
};

// @DELETE /api/credentials/:id
export const deleteCredential = async (req, res, next) => {
  try {
    const credential = await Credential.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!credential) {
      return res.status(404).json({ message: 'Credential not found' });
    }

    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    next(error);
  }
};