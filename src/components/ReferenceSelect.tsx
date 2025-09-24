'use client';

import * as React from 'react';
import { debounce } from 'lodash-es';

type Option = { id: string; label: string };

const cache = new Map<string, Option[]>(); // simple in-mem cache

export function ReferenceSelect({
  resource,                   // e.g., "customers", "vendors"
  value,                      // current id (optional)
  onChange,                   // (id, label) => void
  placeholder = 'Search…',
  allowCreate = true,
}: {
  resource: string;
  value?: string | null;
  onChange: (id: string | null, label?: string | null) => void;
  placeholder?: string;
  allowCreate?: boolean;
}) {
  const [q, setQ] = React.useState('');
  const [opts, setOpts] = React.useState<Option[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Option | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  const fetcher = React.useMemo(
    () =>
      debounce(async (term: string) => {
        const key = `${resource}:${term.toLowerCase()}`;
        if (cache.has(key)) {
          setOpts(cache.get(key)!);
          return;
        }
        try {
          setErr(null);
          setLoading(true);
          const res = await fetch(`/api/ref/${resource}?q=${encodeURIComponent(term)}`);
          if (!res.ok) throw new Error('Search failed');
          const data: Option[] = await res.json();
          cache.set(key, data);
          setOpts(data);
        } catch (e: any) {
          setErr(e.message || 'Search failed');
          setOpts([]);
        } finally {
          setLoading(false);
        }
      }, 250),
    [resource]
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
    (async () => {
      if (!value) { setSelected(null); return; }
      try {
        // Load label of current value once
        const res = await fetch(`/api/ref/${resource}?q=`);
        if (res.ok) {
          const data: Option[] = await res.json();
          const found = data.find((o) => o.id === value);
          if (found) setSelected(found);
        }
      } catch {}
    })();
  }, [value, resource]);

  function choose(o: Option) {
    setSelected(o);
    setQ('');
    setOpen(false);
    onChange(o.id, o.label);
  }

  async function createNew(name: string) {
    try {
      setErr(null);
      setLoading(true);
      const res = await fetch(`/api/ref/${resource}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: name, name, company_name: name }), // API normalizes via createMap
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Create failed');
      }
      const opt: Option = await res.json();
      choose(opt);
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
        placeholder={selected?.label ?? placeholder}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => { if (opts.length) setOpen(true); }}
      />
      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow">
          {loading && <div className="px-3 py-2 text-sm text-gray-600">Loading…</div>}
          {!loading && err && <div className="px-3 py-2 text-sm text-red-600">{err}</div>}
          {!loading && opts.map((o) => (
            <button
              key={o.id}
              onClick={() => choose(o)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
            >
              {o.label}
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
