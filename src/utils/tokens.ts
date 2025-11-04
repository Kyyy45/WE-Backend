import crypto from 'crypto';
import { promisify } from 'util';
const randomBytes = promisify(crypto.randomBytes);

export const generateToken = async (length = 32): Promise<string> => {
  const buf = await randomBytes(length);
  return buf.toString('hex');
};

export const hashToken = (token: string): string =>
  crypto.createHash('sha256').update(token).digest('hex');
