import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MainNav = () => {
  const pathname = usePathname();

  return (
    <>
      {/* Top section grows to fill space */}
      <div className="flex flex-col flex-1">
        <h1 className="text-2xl font-bold text-cyan-600 mb-4 sm:mb-8 pl-2">
          JiraLite
        </h1>

        <Link
          href="/dashboard"
          className={`flex items-center px-3 py-2 rounded-md font-medium mb-1 ${
            pathname.includes('/dashboard')
              ? 'text-blue-100 bg-cyan-600'
              : 'hover:bg-cyan-700 hover:text-cyan-100'
          } transition-colors`}
        >
          Dashboard
        </Link>

        <Link
          href="/projects"
          className={`flex items-center px-3 py-2 rounded-md font-medium mb-1 ${
            pathname.includes('/projects')
              ? 'text-blue-100 bg-cyan-600'
              : 'hover:bg-cyan-700 hover:text-cyan-100'
          } transition-colors`}
        >
          Projects
        </Link>

        <Link
          href="/tasks"
          className={`flex items-center px-3 py-2 rounded-md font-medium mb-1 ${
            pathname.includes('/tasks')
              ? 'text-blue-100 bg-cyan-600'
              : 'hover:bg-cyan-700 hover:text-cyan-100'
          }`}
        >
          My Tasks
        </Link>
        <Link
          href="/board"
          className={`flex items-center px-3 py-2 rounded-md font-medium mb-1 ${
            pathname.includes('/board')
              ? 'text-blue-100 bg-cyan-600'
              : 'hover:bg-cyan-700 hover:text-cyan-100'
          }`}
        >
          Board
        </Link>

        <Link
          href="/backlog"
          className={`flex items-center px-3 py-2 rounded-md font-medium mb-1 ${
            pathname.includes('/backlog')
              ? 'text-blue-100 bg-cyan-600'
              : 'hover:bg-cyan-700 hover:text-cyan-100'
          }`}
        >
          Backlog
        </Link>

        <Link
          href="/sprint"
          className={`flex items-center px-3 py-2 rounded-md font-medium mb-1 ${
            pathname.includes('/sprint')
              ? 'text-blue-100 bg-cyan-600'
              : 'hover:bg-cyan-700 hover:text-cyan-100'
          }`}
        >
          Sprint
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
    </>
  );
};

export default MainNav;
