import { cookies } from 'next/headers';
import { SESSION_COOKIE } from '@/lib/cookies';
import { verifySession } from '@/lib/auth';


export function requireAuth() {
const token = cookies().get(SESSION_COOKIE)?.value;
if (!token) throw new Error('UNAUTHENTICATED');
try {
return verifySession(token);
} catch {
throw new Error('UNAUTHENTICATED');
}
}