import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'techpulse_super_secret_jwt_key_change_in_production_32chars'
);

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'EDITOR' | 'WRITER';
  [key: string]: unknown;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY);
}

export async function verifySessionToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function getAuthSession(): Promise<JWTPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('techpulse_session')?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function setAuthCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set('techpulse_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function removeAuthCookie() {
  const cookieStore = cookies();
  cookieStore.delete('techpulse_session');
}
