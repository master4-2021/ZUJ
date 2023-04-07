/* eslint-disable @typescript-eslint/no-var-requires */
// turn import to require
const {
  createCipheriv,
  randomBytes,
  scrypt,
  createDecipheriv,
} = require('crypto');
const { promisify } = require('util');

async function run() {
  const iv = randomBytes(16);
  const password = 'Password used to generate key';

  // The key length is dependent on the algorithm.
  // In this case for aes256, it is 32 bytes.
  const key = await promisify(scrypt)(password, 'salt', 32);
  const cipher = createCipheriv('aes-256-ctr', key, iv);

  const textToEncrypt = 'Nest';
  const encryptedText = Buffer.concat([
    cipher.update(textToEncrypt),
    cipher.final(),
  ]);

  const encryptedString = encryptedText.toString('base64');

  // Convert the encrypted string back to a Buffer object using the same encoding method
  const encryptedBuffer = Buffer.from(encryptedString, 'base64');

  const decipher = createDecipheriv('aes-256-ctr', key, iv);
  const decryptedText = Buffer.concat([
    decipher.update(encryptedBuffer),
    decipher.final(),
  ]);

  // decrypted encrypt text should be equal to original text
  console.log(encryptedText.toString('base64'));

  console.log(decryptedText.toString());
}

run();
