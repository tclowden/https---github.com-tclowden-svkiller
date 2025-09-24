'use client';

import * as React from 'react';
import { debounce } from 'lodash-es';

type Customer = { id: string; company_name: string | null };

export function CustomerSelect({
  value,
  onChange,
  placeholder = 'Search customers…',
  allowCreate = true,
}: {
  value?: string | null; // customer_id
  onChange: (id: string | null, display?: string | null) => void;
  placeholder?: string;
  allowCreate?: boolean;
}) {
  const [q, setQ] = React.useState('');
  const [opts, setOpts] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Customer | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  const fetcher = React.useMemo(
    () =>
      debounce(async (term: string) => {
        try {
          setErr(null);
          setLoading(true);
          const res = await fetch(`/api/customers?query=${encodeURIComponent(term)}`);
          if (!res.ok) throw new Error('Search failed');
          const data: Customer[] = await res.json();
          setOpts(data);
        } catch (e: any) {
          setErr(e.message || 'Search failed');
          setOpts([]);
        } finally {
          setLoading(false);
        }
      }, 250),
    []
  );

  React.useEffect(() => {
    if (!q) {
      setOpts([]);
      setOpen(false);
      return;
    }
    setOpen(true);
    fetcher(q);
  }, [q, fetcher]);

  React.useEffect(() => {
    // preload selected by id (when editing, etc.)
    (async () => {
      if (!value) { setSelected(null); return; }
      try {
        const res = await fetch(`/api/customers/${value}`);
        if (res.ok) setSelected(await res.json());
      } catch {}
    })();
  }, [value]);

  function choose(c: Customer) {
    setSelected(c);
    setQ('');
    setOpen(false);
    onChange(c.id, c.company_name ?? null);
  }

  async function createNew(name: string) {
    try {
      setErr(null);
      setLoading(true);
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_name: name }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Create failed');
      }
      const c: Customer = await res.json();
      choose(c);
    } catch (e: any) {
      setErr(e.message || 'Create failed');
    } finally {
      setLoading(false);
    }
  }

  const canOfferCreate = allowCreate && q.trim().length > 1 && !loading && opts.length === 0;

  return (
    <div className="relative">
      <input
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={selected?.company_name ?? placeholder}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => { if (opts.length) setOpen(true); }}
      />
      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow">
          {loading && <div className="px-3 py-2 text-sm text-gray-600">Loading…</div>}
          {!loading && err && <div className="px-3 py-2 text-sm text-red-600">{err}</div>}
          {!loading && opts.map((c) => (
            <button
              key={c.id}
              onClick={() => choose(c)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
            >
              {c.company_name}
            </button>
          ))}
          {canOfferCreate && (
            <button
              onClick={() => createNew(q.trim())}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-blue-600"
            >
              Create “{q.trim()}”
            </button>
          )}
        </div>
      )}
    </div>
  );
}
