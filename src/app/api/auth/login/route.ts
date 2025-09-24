export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { validateUser, signSession } from '@/lib/auth';
import { setSessionCookie } from '@/lib/cookies';

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({ email: undefined, password: undefined }));
  console.log('[login] email:', email, 'hasPassword:', !!password);

  const user = await validateUser(email, password);
  console.log('[login] found?', !!user);

  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const token = signSession(user);
  await setSessionCookie(token); // 👈 await
  return NextResponse.json({ ok: true });
}
