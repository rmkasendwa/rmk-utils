import { AES, MD5, PBKDF2, enc, lib, mode, pad } from 'crypto-js';

const { Hex, Utf8 } = enc;
const { Pkcs7 } = pad;
const { CBC } = mode;
const { WordArray } = lib;

// Key size for AES encryption
const KEY_SIZE = 256;
// Number of iterations for key derivation
const iterations = 100;

/**
 * Decrypts a transit message using AES encryption.
 *
 * @param transitmessage - The message to decrypt.
 * @param password - The password used for decryption.
 * @returns The decrypted message.
 */
export const decrypt = (transitmessage: string, password: string): string => {
  transitmessage = transitmessage.replace(/@xZ/gm, '/');

  // Extract the salt and IV from the transit message
  const saltLength = 128 / 4;
  const salt = Hex.parse(transitmessage.substr(0, saltLength));
  const iv = Hex.parse(transitmessage.substr(saltLength, saltLength));

  // Derive the encryption key from the password and salt
  const key = PBKDF2(password, salt, { keySize: KEY_SIZE / 32, iterations });

  // Decrypt the message using AES with CBC mode and PKCS7 padding
  const decrypted = AES.decrypt(transitmessage.substring(saltLength * 2), key, {
    iv,
    padding: Pkcs7,
    mode: CBC,
  });

  try {
    return decrypted.toString(Utf8);
  } catch (exception) {
    return transitmessage;
  }
};

/**
 * Encrypts a message using AES encryption.
 *
 * @param message - The message to encrypt.
 * @param password - The password used for encryption.
 * @param random - Whether to use random salt and IV for encryption. Default is true.
 * @returns The encrypted message.
 */
export const encrypt = (
  message: string,
  password: string,
  random = true
): string => {
  const encrypted = (() => {
    if (random === false) {
      // Generate a salt and derive the encryption key from the password and salt
      const salt = MD5(password);
      const key = PBKDF2(password, salt, {
        keySize: KEY_SIZE / 32,
        iterations,
      });

      // Generate an IV from the message and encrypt the message using AES with CBC mode and PKCS7 padding
      const iv = MD5(message);

      return (
        salt.toString() +
        iv.toString() +
        AES.encrypt(message, key, { iv, padding: Pkcs7, mode: CBC }).toString()
      );
    }

    // Generate a random salt, IV, and derive the encryption key from the password and salt
    const localIVSize = 128;
    const salt = WordArray.random(localIVSize / 8);
    const key = PBKDF2(password, salt, { keySize: KEY_SIZE / 32, iterations });
    const iv = WordArray.random(localIVSize / 8);

    // Encrypt the message using AES with CBC mode and PKCS7 padding
    return (
      salt.toString() +
      iv.toString() +
      AES.encrypt(message, key, { iv, padding: Pkcs7, mode: CBC }).toString()
    );
  })();

  try {
    // Check if the encrypted message can be successfully decrypted
    if (decrypt(encrypted, password) === message) {
      return encrypted.replace(/\//gm, '@xZ');
    } else {
      // Retry encryption if decryption fails
      return encrypt(message, password);
    }
  } catch (exception) {
    // Retry encryption if an exception occurs during decryption
    return encrypt(message, password);
  }
};
