import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import { User } from '@prisma/client';

// Function to generate a JWT token
export function generateToken(user: User): string {
  return jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
  );
}

// Function to hash a password
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

// Function to verify a password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
