import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

// Generate a 32-byte key for AES-256 and store it in .env
// For production, you should use a proper secrets manager.
// Example: crypto.randomBytes(32).toString('hex')
const getSecretKey = () => {
  const secret = process.env.ENCRYPTION_KEY;
  if (!secret) {
    throw new Error('ENCRYPTION_KEY is not defined in environment variables.');
  }
  return Buffer.from(secret, 'hex');
};

/**
 * Encrypts plain text using AES-256-GCM
 * @param {string} text - The plain text to encrypt
 * @returns {string} - The encrypted text in the format iv:authTag:encryptedData
 */
export const encrypt = (text) => {
  if (!text) return text;
  
  const iv = crypto.randomBytes(12); // 96-bit IV is recommended for GCM
  const cipher = crypto.createCipheriv(ALGORITHM, getSecretKey(), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
};

/**
 * Decrypts text encrypted by the encrypt function
 * @param {string} encryptedText - The encrypted text format iv:authTag:encryptedData
 * @returns {string} - The decrypted plain text
 */
export const decrypt = (encryptedText) => {
  if (!encryptedText) return encryptedText;
  
  const parts = encryptedText.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted text format');
  }
  
  const [ivHex, authTagHex, encryptedDataHex] = parts;
  
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, getSecretKey(), iv);
  
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedDataHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};
