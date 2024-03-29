import { decrypt, encrypt } from './Cypher';

describe('Cypher', () => {
  describe('decrypt', () => {
    it('should correctly decrypt a transit message', () => {
      const password = 'mysecretpassword';
      const transitMessage = encrypt('Hello, World!', password);
      const decryptedMessage = decrypt(transitMessage, password);
      expect(decryptedMessage).toEqual('Hello, World!');
    });

    it('should return an empty string if decryption fails', () => {
      const transitMessage = 'invalidtransitmessage';
      const password = 'mysecretpassword';
      const decryptedMessage = decrypt(transitMessage, password);
      expect(decryptedMessage).toEqual('');
    });
  });

  describe('encrypt', () => {
    it('should correctly encrypt a message', () => {
      const message = 'Hello, World!';
      const password = 'mysecretpassword';
      const encryptedMessage = encrypt(message, password);
      const decryptedMessage = decrypt(encryptedMessage, password);
      expect(decryptedMessage).toEqual(message);
    });

    it('should return a different encrypted message whenever it is called', () => {
      const message = 'Hello, World!';
      const password = 'mysecretpassword';
      const encryptedMessage1 = encrypt(message, password);
      const encryptedMessage2 = encrypt(message, password);
      expect(encryptedMessage1).not.toEqual(encryptedMessage2);
    });

    it('should return the same encrypted message if called with random flag set to false', () => {
      const message = 'Hello, World!';
      const password = 'mysecretpassword';
      const encryptedMessage1 = encrypt(message, password, false);
      const encryptedMessage2 = encrypt(message, password, false);
      expect(encryptedMessage1).toEqual(encryptedMessage2);
    });
  });
});
