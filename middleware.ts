import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = '4ar-admin-token';
const THREE_HOURS_MS = 3 * 60 * 60 * 1000;
const THREE_HOURS_S  = 3 * 60 * 60;

function getSecret(): string {
  return process.env.ADMIN_SECRET ?? process.env.ADMIN_PASSWORD ?? 'dev-secret-change-me';
}

// HMAC-SHA256 via Web Crypto (Edge Runtime) — identique au Node.js crypto de lib/auth.ts
async function hmacHex(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const buf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyAdminToken(token: string): Promise<boolean> {
  const dot = token.lastIndexOf('.');
  if (dot === -1) return false;
  const payload = token.slice(0, dot);
  const sig     = token.slice(dot + 1);
  const expected = await hmacHex(payload);
  if (sig.length !== expected.length) return false;
  // Comparaison en temps constant
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  if (diff !== 0) return false;
  const age = Date.now() - parseInt(payload, 10);
  return age > 0 && age < THREE_HOURS_MS;
}

async function createAdminToken(): Promise<string> {
  const ts = Date.now().toString();
  return `${ts}.${await hmacHex(ts)}`;
}

const intlMiddleware = createIntlMiddleware({
  locales: ['fr', 'en', 'de'],
  defaultLocale: 'fr',
});

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    // La page de login est toujours accessible
    if (pathname === '/admin/login') return NextResponse.next();

    const token = req.cookies.get(COOKIE_NAME)?.value;

    if (!token || !(await verifyAdminToken(token))) {
      // Session expirée ou absente → redirection login
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    // Token valide → émettre un nouveau token pour réinitialiser le compteur d'inactivité
    const newToken = await createAdminToken();
    const res = NextResponse.next();
    res.cookies.set(COOKIE_NAME, newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: THREE_HOURS_S,
      path: '/',
    });
    return res;
  }

  // Toutes les autres routes → next-intl
  return intlMiddleware(req);
}

export const config = {
  // Inclure /admin dans le middleware (retiré de l'exclusion)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
