import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

// ✅ FIX: KEY ab function ke andar hai
const getKey = () => {
  const secret = process.env.ENCRYPTION_SECRET;
  if (!secret) throw new Error('ENCRYPTION_SECRET is not defined in .env');
  return Buffer.from(secret, 'utf8').slice(0, 32);
};

// Encrypt karo
export const encrypt = (plainText) => {
  const iv = crypto.randomBytes(16); // har baar naya random IV
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv); // KEY → getKey()

  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex'); // tamper-proof tag

  return {
    encryptedPassword: encrypted,
    iv: iv.toString('hex'),
    authTag,
  };
};

// Decrypt karo
export const decrypt = (encryptedPassword, ivHex, authTagHex) => {
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv); // KEY → getKey()
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedPassword, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};