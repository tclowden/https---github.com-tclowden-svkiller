'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // 👈 important
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({} as any));
      setErr(data?.error || 'Invalid credentials');
      return;
    }
    window.location.href = '/dashboard';
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 border rounded-2xl p-6 shadow">
        <h1 className="text-2xl font-semibold">Login</h1>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <input
          className="w-full border p-2 rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          autoComplete="username"
        />
        <input
          className="w-full border p-2 rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          autoComplete="current-password"
        />
        <button className="w-full rounded-2xl border p-2" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
