'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const LeftNav = () => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col justify-between h-full pr-6 border-r light:border-gray-400 dark:border-white/20">
      {/* Top section */}
      <div>
        <h1 className="text-2xl font-bold text-blue-600 mb-8">JiraLite</h1>

        <Link
          href="/dashboard"
          className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium my-3 ${pathname.includes('/dashboard') ? 'text-blue-100 bg-blue-500' : 'hover:bg-blue-500 hover:text-blue-100'} transition-colors`}
        >
          {/* Add icon here if needed */}
          Dashboard
        </Link>

        <Link
          href="/projects"
          className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium my-3 ${pathname.includes('/projects') ? 'text-blue-100 bg-blue-500' : 'hover:bg-blue-500 hover:text-blue-100'} transition-colors`}
        >
          Projects
        </Link>

        <Link
          href="/tasks"
          className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium my-3 ${pathname.includes('/tasks') ? 'text-blue-100 bg-blue-500' : 'hover:bg-blue-500 hover:text-blue-100'}`}
        >
          My Tasks
        </Link>
      </div>

      {/* Bottom section */}
      <div className="flex flex-col gap-2 mb-4">
        <Link
          href="/settings"
          className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium ${pathname.includes('/settings') ? 'text-blue-100 bg-blue-500' : 'hover:bg-blue-500 hover:text-blue-100'} transition-colors`}
        >
          Settings
        </Link>
        <Link
          href="/help"
          className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium ${pathname.includes('/help') ? 'text-blue-100 bg-blue-500' : 'hover:bg-blue-500 hover:text-blue-100'} transition-colors`}
        >
          Help
        </Link>
      </div>
    </nav>
  );
};
