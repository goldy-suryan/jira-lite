// LeftNav.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const LeftNav = () => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col justify-between h-full w-[15%] p-2 pt-6 border-r light:border-gray-400 dark:border-white/20 hidden md:flex">
      {/* Top section grows to fill space */}
      <div className="flex flex-col flex-1">
        <h1 className="text-2xl font-bold text-cyan-600 mb-8 pl-2">JiraLite</h1>

        <Link
          href="/dashboard"
          className={`flex items-center gap-1 px-3 py-2 rounded-md font-medium my-2 ${
            pathname.includes('/dashboard')
              ? 'text-blue-100 bg-cyan-600'
              : 'hover:bg-cyan-700 hover:text-cyan-100'
          } transition-colors`}
        >
          Dashboard
        </Link>

        <Link
          href="/projects"
          className={`flex items-center gap-1 px-3 py-2 rounded-md font-medium my-2 ${
            pathname.includes('/projects')
              ? 'text-blue-100 bg-cyan-600'
              : 'hover:bg-cyan-700 hover:text-cyan-100'
          } transition-colors`}
        >
          Projects
        </Link>

        <Link
          href="/tasks"
          className={`flex items-center gap-1 px-3 py-2 rounded-md font-medium my-2 ${
            pathname.includes('/tasks')
              ? 'text-blue-100 bg-cyan-600'
              : 'hover:bg-cyan-700 hover:text-cyan-100'
          }`}
        >
          My Tasks
        </Link>
      </div>

      {/* Bottom section sticks to bottom */}
      <div className="flex flex-col gap-2 mb-4">
        <Link
          href="/settings"
          className={`flex items-center gap-1 px-3 py-2 rounded-md font-medium ${
            pathname.includes('/settings')
              ? 'text-cyan-100 bg-cyan-600'
              : 'hover:bg-cyan-700 hover:text-cyan-100'
          } transition-colors`}
        >
          Settings
        </Link>
        <Link
          href="/help"
          className={`flex items-center gap-1 px-3 py-2 rounded-md font-medium ${
            pathname.includes('/help')
              ? 'text-cyan-100 bg-cyan-600'
              : 'hover:bg-cyan-700 hover:text-cyan-100'
          } transition-colors`}
        >
          Help
        </Link>
      </div>
    </nav>
  );
};

export default LeftNav;
