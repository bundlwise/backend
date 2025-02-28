import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { config } from '../config/index.js';
import { ApiError } from './api-error.js';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePasswords(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: { userId: number; email: string }): string {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw new ApiError('Invalid token', 401);
  }
} 