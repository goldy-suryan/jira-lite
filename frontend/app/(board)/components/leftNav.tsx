import Link from 'next/link';

export const LeftNav = () => {
  return (
    <nav className="flex flex-col gap-3 border-r border-white/10 pr-6">
      <h1 className="text-2xl font-bold text-blue-500 mb-8">JiraLite</h1>
      <Link
        href="/dashboard"
        className="text-white/80 hover:text-white hover:bg-white/10 rounded-md px-3 py-2 transition font-medium"
      >
        Dashboard
      </Link>
      <Link
        href="/projects"
        className="text-white/80 hover:text-white hover:bg-white/10 rounded-md px-3 py-2 transition font-medium"
      >
        Projects
      </Link>
      <Link
        href="/tasks"
        className="text-white/80 hover:text-white hover:bg-white/10 rounded-md px-3 py-2 transition font-medium"
      >
        My Tasks
      </Link>
      <Link
        href="/settings"
        className="text-white/80 hover:text-white hover:bg-white/10 rounded-md px-3 py-2 transition font-medium"
      >
        Settings
      </Link>
    </nav>
  );
};
