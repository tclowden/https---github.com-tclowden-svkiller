import { cookies } from 'next/headers';

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME ?? 'svkiller_session';

export async function setSessionCookie(value: string) {
  const jar = await cookies(); // 👈 await
  jar.set(SESSION_COOKIE, value, {
    httpOnly: true,
    path: '/',
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSessionCookie() {
  const jar = await cookies(); // 👈 await
  jar.delete(SESSION_COOKIE);
}
