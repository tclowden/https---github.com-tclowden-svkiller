// src/app/(app)/layout.tsx
import type { ReactNode } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import {
  LayoutDashboard,
  Users,
  Building2,
  Tags,
  Shield,
  Waypoints,
  Receipt,
  Quote,
  FileText,
  Briefcase,
  ClipboardList,
  Boxes,
} from 'lucide-react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r">
        {/* Brand */}
        <div className="px-4 py-4 border-b">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-lg font-semibold text-gray-900"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>SVKiller</span>
          </Link>
        </div>

        {/* Sections */}
        <nav className="p-3 space-y-6 text-sm">
          <div>
            <div className="px-2 text-xs font-semibold text-gray-900 uppercase tracking-wide">
              Admin
            </div>
            <ul className="mt-2 space-y-1">
              <NavItem href="/admin/users" icon={<Users className="h-4 w-4" />}>
                Users
              </NavItem>
              <NavItem href="/admin/custom-fields" icon={<Tags className="h-4 w-4" />}>
                Custom Fields
              </NavItem>
              <NavItem href="/customers" icon={<Building2 className="h-4 w-4" />}>
                Customers
              </NavItem>
              <NavItem href="/vendors" icon={<Briefcase className="h-4 w-4" />}>
                Vendors
              </NavItem>
              <NavItem href="/admin/roles" icon={<Shield className="h-4 w-4" />}>
                Roles
              </NavItem>
              <NavItem href="/admin/transaction-types" icon={<Waypoints className="h-4 w-4" />}>
                Transaction Types
              </NavItem>
            </ul>
          </div>

          <div>
            <div className="px-2 text-xs font-semibold text-gray-900 uppercase tracking-wide">
              Transactions
            </div>
            <ul className="mt-2 space-y-1">
              <NavItem href="/opportunities" icon={<Waypoints className="h-4 w-4" />}>
                Opportunities
              </NavItem>
              <NavItem href="/quotes" icon={<Quote className="h-4 w-4" />}>
                Quotes
              </NavItem>
              <NavItem href="/sales-orders" icon={<Receipt className="h-4 w-4" />}>
                Sales Orders
              </NavItem>
              <NavItem href="/jobs" icon={<FileText className="h-4 w-4" />}>
                Jobs
              </NavItem>
              <NavItem href="/purchase-orders" icon={<ClipboardList className="h-4 w-4" />}>
                Purchase Orders
              </NavItem>
              <NavItem href="/tasks" icon={<ClipboardList className="h-4 w-4" />}>
                Tasks
              </NavItem>
            </ul>
          </div>

          <div>
            <div className="px-2 text-xs font-semibold text-gray-900 uppercase tracking-wide">
              Products
            </div>
            <ul className="mt-2 space-y-1">
              <NavItem href="/products" icon={<Boxes className="h-4 w-4" />}>
                Products
              </NavItem>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1">
        <header className="bg-white border-b px-6 py-4">
          {/* Keep this simple and dark for contrast; per-page titles live inside pages */}
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        </header>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

function NavItem({
  href,
  icon,
  children,
}: {
  href: string;
  icon?: React.ReactNode;
  children: ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className={clsx(
          'flex items-center gap-2 px-2 py-2 rounded-lg',
          'text-gray-900 hover:bg-gray-100'
        )}
      >
        {icon}
        <span>{children}</span>
      </Link>
    </li>
  );
}
