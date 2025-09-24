'use client';

import * as React from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Option = { id: string; label: string; value: string };

const TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'decimal', label: 'Decimal' },
  { value: 'currency', label: 'Currency (USD)' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'date', label: 'Date' },
  { value: 'datetime', label: 'Date/Time' },
  { value: 'formula', label: 'Formula' },
] as const;

export function CustomFieldEditor({
  mode, // 'new'|'edit'
  fieldId,
  initial,
}: {
  mode: 'new' | 'edit';
  fieldId?: string;
  initial?: {
    name?: string;
    type?: string;
    formula?: string;
    options?: Option[];
  };
}) {
  const router = useRouter();
  const [name, setName] = React.useState(initial?.name ?? '');
  const [type, setType] = React.useState<string>(initial?.type ?? 'text');
  const [formula, setFormula] = React.useState(initial?.formula ?? '');
  const [options, setOptions] = React.useState<Option[]>(initial?.options ?? []);
  const [saving, setSaving] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  function addOption() {
    setOptions((prev) => [...prev, { id: crypto.randomUUID(), label: '', value: '' }]);
  }
  function removeOption(id: string) {
    setOptions((prev) => prev.filter((o) => o.id !== id));
  }
  function updateOption(id: string, patch: Partial<Option>) {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = options.findIndex((o) => o.id === active.id);
    const newIndex = options.findIndex((o) => o.id === over.id);
    setOptions((prev) => arrayMove(prev, oldIndex, newIndex));
  }

  async function save() {
    setErr(null);
    setSaving(true);
    try {
      const payload: any = { name, type };
      if (type === 'dropdown') {
        payload.options = options.map((o) => ({ label: o.label, value: o.value }));
      }
      if (type === 'formula') {
        payload.formula = formula;
      }

      const res = await fetch(
        mode === 'new' ? '/api/custom-fields' : `/api/custom-fields/${fieldId}`,
        { method: mode === 'new' ? 'POST' : 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
      );
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Save failed');

      if (mode === 'edit' && type === 'dropdown' && fieldId) {
        // sync order to server
        await fetch(`/api/custom-fields/${fieldId}/options/reorder`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(options.map((o, i) => ({ id: o.id, sort_order: i }))),
        });
      }

      router.push('/admin/custom-fields');
      router.refresh();
    } catch (e: any) {
      setErr(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  const isDropdown = type === 'dropdown';
  const isFormula = type === 'formula';

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-900">Field Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Priority"
            />
          </div>

          <div>
            <label className="text-sm text-gray-900">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {isFormula && (
          <div>
            <label className="text-sm text-gray-900">Formula</label>
            <input
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., {qty} * {price}"
            />
            <p className="text-xs text-gray-600 mt-1">Tip: We can wire a parser later—this just stores the expression for now.</p>
          </div>
        )}

        {isDropdown && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-900">Options</label>
              <button onClick={addOption} className="inline-flex items-center gap-1 text-sm rounded-lg px-2 py-1 border border-gray-300 text-gray-900 hover:bg-gray-100">
                <Plus className="h-4 w-4" /> Add option
              </button>
            </div>

            <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={options.map((o) => o.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {options.map((opt, idx) => (
                    <SortableRow key={opt.id} id={opt.id}>
                      <div className="grid grid-cols-[auto,1fr,1fr,auto] items-center gap-2">
                        <Grip />
                        <input
                          value={opt.label}
                          onChange={(e) => updateOption(opt.id, { label: e.target.value })}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          placeholder={`Label ${idx + 1}`}
                        />
                        <input
                          value={opt.value}
                          onChange={(e) => updateOption(opt.id, { value: e.target.value })}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          placeholder={`Value ${idx + 1}`}
                        />
                        <button onClick={() => removeOption(opt.id)} className="p-2 text-gray-600 hover:text-red-600" title="Remove">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </SortableRow>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        {err && <p className="text-sm text-red-600">{err}</p>}

        <div className="flex items-center justify-end gap-2">
          <button onClick={() => router.back()} className="px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-900 hover:bg-gray-100">Cancel</button>
          <button onClick={save} disabled={saving || !name} className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Field'}
          </button>
        </div>
      </div>
    </div>
  );
}

function SortableRow({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} className="rounded-xl border border-gray-200 bg-white p-2">
      <div {...attributes} {...listeners}>{children}</div>
    </div>
  );
}

function Grip() {
  return <GripVertical className="h-4 w-4 text-gray-500" />;
}
