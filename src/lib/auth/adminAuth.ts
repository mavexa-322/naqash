import { cookies } from 'next/headers';
import crypto from 'crypto';
import { createClient } from '@/utils/supabase/server';

const COOKIE_NAME = 'naqash_admin_session';
const DEFAULT_SECRET = 'naqash_default_secret_key_change_in_production_2026';

function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || DEFAULT_SECRET;
}

function getAllowedAdminEmails(): string[] {
  const envEmails = process.env.ADMIN_EMAILS || 'abdulmoeez5846@gmail.com,admin@naqashcarpets.com';
  return envEmails
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAuthorizedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const allowed = getAllowedAdminEmails();
  return allowed.includes(email.trim().toLowerCase());
}

/**
 * Sign an admin payload with HMAC-SHA256
 */
export function createSignedToken(email: string): string {
  const payload = {
    email: email.trim().toLowerCase(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getSessionSecret())
    .update(payloadB64)
    .digest('base64url');

  return `${payloadB64}.${signature}`;
}

/**
 * Verify a signed admin token
 */
export function verifySignedToken(token: string): { valid: boolean; email?: string } {
  try {
    const [payloadB64, signature] = token.split('.');
    if (!payloadB64 || !signature) return { valid: false };

    const expectedSig = crypto
      .createHmac('sha256', getSessionSecret())
      .update(payloadB64)
      .digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return { valid: false };
    }

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (!payload.exp || Date.now() > payload.exp) {
      return { valid: false };
    }

    return { valid: true, email: payload.email };
  } catch {
    return { valid: false };
  }
}

/**
 * Set admin session cookie
 */
export async function setAdminSession(email: string) {
  const cookieStore = await cookies();
  const token = createSignedToken(email);

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

/**
 * Clear admin session cookie
 */
export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export interface AdminSessionResult {
  isAuthenticated: boolean;
  email: string | null;
}

/**
 * Verify if the incoming request has valid admin credentials
 * Checks both signed cookie session and active Supabase auth session
 */
export async function verifyAdminSession(): Promise<AdminSessionResult> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(COOKIE_NAME)?.value;

  // 1. Check signed cookie
  if (sessionToken) {
    const verified = verifySignedToken(sessionToken);
    if (verified.valid && verified.email) {
      return { isAuthenticated: true, email: verified.email };
    }
  }

  // 2. Check Supabase Auth user
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (!error && user && user.email) {
      const email = user.email.toLowerCase();
      const isRoleAdmin = user.user_metadata?.role === 'admin' || user.app_metadata?.role === 'admin';
      const isEmailAllowed = isAuthorizedAdminEmail(email);

      if (isRoleAdmin || isEmailAllowed) {
        return { isAuthenticated: true, email };
      }
    }
  } catch (err) {
    console.error('Error verifying Supabase user in admin session:', err);
  }

  return { isAuthenticated: false, email: null };
}
