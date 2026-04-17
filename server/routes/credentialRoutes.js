 import express from 'express';
import {
  getCredentials,
  createCredential,
  revealPassword,
  updateCredential,
  deleteCredential,
} from '../controllers/credentialController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Sab routes protected hain — bina login ke access nahi
router.use(protect);

router.get('/', getCredentials);
router.post('/', createCredential);
router.get('/:id/reveal', revealPassword);
router.put('/:id', updateCredential);
router.delete('/:id', deleteCredential);

export default router;