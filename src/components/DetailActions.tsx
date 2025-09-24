'use client';

import Link from 'next/link';

export function DetailActions({ editHref }: { editHref: string }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={editHref}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700"
      >
        Edit
      </Link>
    </div>
  );
}
