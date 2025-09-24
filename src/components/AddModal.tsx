'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ReferenceSelect } from '@/components/ReferenceSelect';

type BaseField = {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
};

type Field =
  | (BaseField & { type?: 'text' | 'email' | 'password' | 'number' })
  | (BaseField & { type: 'textarea' })
  | (BaseField & { type: 'checkbox' })
  | (BaseField & { type: 'select'; options: { label: string; value: string }[] })
  | (BaseField & { type: 'date' | 'datetime' })
  | (BaseField & { type: 'currency' })
  | (BaseField & { type: 'reference'; resource: string; create?: boolean });

export function AddModal({
  title,
  actionLabel = 'Create',
  endpoint,
  fields,
  onSuccess,
  transform, // optional: reshape values before POST
}: {
  title: string;
  actionLabel?: string;
  endpoint: string;
  fields: Field[];
  onSuccess?: () => void;
  transform?: (values: Record<string, any>) => Record<string, any>;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, any>>({});
  const router = useRouter();

  function set(field: string, val: any) {
    setValues((s) => ({ ...s, [field]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const payload = transform ? transform(values) : values;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = (await res.json().catch(() => ({} as any)))?.error || 'Failed to create';
        throw new Error(msg);
      }
      setOpen(false);
      onSuccess?.();
      router.refresh();
    } catch (e: any) {
      setErr(e.message || 'Failed to create');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="rounded-lg bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700">
        Add
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <button onClick={() => setOpen(false)} className="text-gray-600 hover:text-gray-800">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              {fields.map((f) => {
                const common = (
                  <label className="text-sm text-gray-900">
                    {f.label}{' '}
                    {('required' in f && f.required) ? <span className="text-red-600">*</span> : null}
                  </label>
                );

                switch (f.type) {
                  case 'textarea':
                    return (
                      <div key={f.name} className="space-y-1">
                        {common}
                        <textarea
                          placeholder={f.placeholder}
                          required={f.required}
                          value={values[f.name] ?? ''}
                          onChange={(e) => set(f.name, e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                      </div>
                    );
                  case 'checkbox':
                    return (
                      <div key={f.name} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!!values[f.name]}
                          onChange={(e) => set(f.name, e.target.checked)}
                          className="h-4 w-4"
                        />
                        {common}
                      </div>
                    );
                  case 'select':
                    return (
                      <div key={f.name} className="space-y-1">
                        {common}
                        <select
                          required={f.required}
                          value={values[f.name] ?? ''}
                          onChange={(e) => set(f.name, e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="" disabled hidden>
                            {f.placeholder ?? 'Select…'}
                          </option>
                          {f.options.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  case 'date':
                  case 'datetime':
                    return (
                      <div key={f.name} className="space-y-1">
                        {common}
                        <input
                          type={f.type === 'date' ? 'date' : 'datetime-local'}
                          required={f.required}
                          value={values[f.name] ?? ''}
                          onChange={(e) => set(f.name, e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    );
                  case 'currency': // very simple; you can upgrade to a mask later
                    return (
                      <div key={f.name} className="space-y-1">
                        {common}
                        <input
                          inputMode="decimal"
                          placeholder={f.placeholder ?? '0.00'}
                          required={f.required}
                          value={values[f.name] ?? ''}
                          onChange={(e) => set(f.name, e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    );
                  case 'reference':
                    return (
                      <div key={f.name} className="space-y-1">
                        {common}
                        <ReferenceSelect
                          resource={f.resource}
                          onChange={(id, label) => {
                            set(f.name, id); // store the FK
                            // also store a label shadow so transform() can copy it if needed
                            set(`${f.name}__label`, label ?? null);
                          }}
                          placeholder={f.placeholder ?? 'Search or create…'}
                          allowCreate={f.create ?? true}
                        />
                      </div>
                    );
                  case 'email':
                  case 'password':
                  case 'number':
                  default:
                    return (
                      <div key={f.name} className="space-y-1">
                        {common}
                        <input
                          type={f.type ?? 'text'}
                          placeholder={f.placeholder}
                          required={f.required}
                          value={values[f.name] ?? ''}
                          onChange={(e) => set(f.name, e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                      </div>
                    );
                }
              })}

              {err && <p className="text-sm text-red-600">{err}</p>}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-900 hover:bg-gray-100">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
                  {loading ? 'Saving…' : actionLabel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
