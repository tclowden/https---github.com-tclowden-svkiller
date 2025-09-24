'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  ColumnOrderState,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, Eye, EyeOff, GripVertical } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Props<T extends object> = {
  columns: ColumnDef<T, any>[];
  data: T[];
  storageKey?: string;
  initialHidden?: string[];
};

export function DataTable<T extends object>({
  columns,
  data,
  storageKey,
  initialHidden = [],
}: Props<T>) {
  const pathname = usePathname();
  const keyBase = storageKey ?? `table:${pathname}`;
  const keyVis = `${keyBase}:visibility`;
  const keyOrder = `${keyBase}:order`;

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>([]);

  // 👇 NEW: mount guard to avoid hydration mismatch with dnd-kit
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter, columnVisibility, columnOrder },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Initial column order
  React.useEffect(() => {
    const ids = table.getAllLeafColumns().map((c) => c.id);
    try {
      const saved = localStorage.getItem(keyOrder);
      if (saved) {
        const parsed = JSON.parse(saved) as string[];
        const cleaned = parsed.filter((id) => ids.includes(id));
        const full = [...cleaned, ...ids.filter((id) => !cleaned.includes(id))];
        setColumnOrder(full);
        return;
      }
    } catch {}
    setColumnOrder(ids);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getAllLeafColumns().length]);

  // Initial visibility
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(keyVis);
      if (saved) setColumnVisibility(JSON.parse(saved));
      else if (initialHidden.length) {
        const vis: VisibilityState = {};
        initialHidden.forEach((id) => (vis[id] = false));
        setColumnVisibility(vis);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist visibility & order
  React.useEffect(() => {
    try { localStorage.setItem(keyVis, JSON.stringify(columnVisibility)); } catch {}
  }, [columnVisibility, keyVis]);
  React.useEffect(() => {
    try { localStorage.setItem(keyOrder, JSON.stringify(columnOrder)); } catch {}
  }, [columnOrder, keyOrder]);

  // DnD header handler
  function onDragEnd(evt: DragEndEvent) {
    const { active, over } = evt;
    if (!over || active.id === over.id) return;
    const oldIndex = columnOrder.indexOf(String(active.id));
    const newIndex = columnOrder.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;
    setColumnOrder((prev) => arrayMove(prev, oldIndex, newIndex));
  }

  // --- Render ---
  return (
  <div className="space-y-3">
    {/* Controls ... unchanged */}

    {/* 👇 Wrap OUTSIDE the table */}
    <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <div className="overflow-auto border border-gray-200 rounded-2xl bg-white">
        <table className="min-w-full text-sm">
          {/* Header: static on server, DnD after mount to avoid hydration mismatch */}
          {mounted ? (
            // SortableContext can stay inside thead, it's within DndContext now
            <SortableContext items={columnOrder} strategy={verticalListSortingStrategy}>
              <thead className="bg-gray-100">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((h) => {
                      const canSort = h.column.getCanSort();
                      const sorted = h.column.getIsSorted() as false | 'asc' | 'desc';
                      const id = h.column.id;
                      return (
                        <SortableTh key={h.id} id={id}>
                          <div
                            className={canSort ? 'inline-flex items-center gap-1 cursor-pointer' : 'inline-flex items-center gap-1'}
                            onClick={canSort ? h.column.getToggleSortingHandler() : undefined}
                          >
                            <GripVertical className="h-3.5 w-3.5 text-gray-500 mr-1" />
                            {flexRender(h.column.columnDef.header, h.getContext())}
                            {sorted === 'asc' ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : sorted === 'desc' ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : null}
                          </div>
                        </SortableTh>
                      );
                    })}
                  </tr>
                ))}
              </thead>
            </SortableContext>
          ) : (
            <thead className="bg-gray-100">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th key={h.id} className="text-left font-semibold text-gray-900 px-3 py-2 select-none">
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
          )}

          {/* tbody unchanged */}
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t border-gray-200 hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-2 text-gray-900">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-3 py-6 text-center text-gray-700">
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DndContext>
  </div>
);
}

function SortableTh({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition };
  return (
    <th
      ref={setNodeRef}
      style={style}
      className="text-left font-semibold text-gray-900 px-3 py-2 select-none"
      {...attributes}
      {...listeners}
    >
      {children}
    </th>
  );
}
