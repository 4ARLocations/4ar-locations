/**
 * Auth admin simple — token HMAC signé stocké dans un cookie httpOnly
 * Variables d'environnement :
 *   ADMIN_PASSWORD  — mot de passe de connexion
 *   ADMIN_SECRET    — clé de signature (générer avec: openssl rand -hex 32)
 *                     Si absent, dérivé du mot de passe (moins sécurisé)
 */
import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = '4ar-admin-token';
const TOKEN_TTL = 30 * 24 * 60 * 60 * 1000; // 30 jours

function secret(): string {
  return process.env.ADMIN_SECRET ?? process.env.ADMIN_PASSWORD ?? 'dev-secret-change-me';
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('hex');
}

export function createToken(): string {
  const ts = Date.now().toString();
  return `${ts}.${sign(ts)}`;
}

export function verifyToken(token: string): boolean {
  if (!token) return false;
  const dotIdx = token.lastIndexOf('.');
  if (dotIdx === -1) return false;
  const payload = token.slice(0, dotIdx);
  const sig = token.slice(dotIdx + 1);
  const expected = sign(payload);
  // Comparaison en temps constant pour éviter timing attacks
  try {
    const valid = timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'));
    if (!valid) return false;
  } catch {
    return false;
  }
  // Vérifier l'expiration
  const age = Date.now() - parseInt(payload, 10);
  return age > 0 && age < TOKEN_TTL;
}

export function checkPassword(input: string): boolean {
  const stored = process.env.ADMIN_PASSWORD;
  if (!stored) return false;
  try {
    return timingSafeEqual(Buffer.from(input), Buffer.from(stored));
  } catch {
    return false;
  }
}

/** Vérifier si la requête courante est authentifiée (Server Component / Route Handler) */
export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return token ? verifyToken(token) : false;
}

export { COOKIE_NAME };
