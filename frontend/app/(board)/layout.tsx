import { ReactNode } from 'react';
import { LeftNav } from './components/leftNav';
import { UserDropdown } from './components/userDropdown';

const BoardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="h-screen pt-8 grid grid-cols-[180px_1fr] pl-4">
      <LeftNav />
      <section
        className="flex flex-col gap-6 h-full"
        style={{ height: 'calc(100vh - 2rem)', width: 'calc(100vw - 12.5rem)' }}
      >
        <header className="flex justify-between items-center mx-4">
          <div className="text-xl">
            <input
              type="search"
              placeholder="Search"
              name="search"
              id="search"
              className="rounded-lg bg-white/10 border border-white/10 px-4 py-1 mr-8 min-w-[35rem]"
            />
          </div>
          <div className="flex items-center gap-5">
            <UserDropdown />
          </div>
        </header>
        <hr className="border-t border-white/20" />
        <div className="flex-1 max-w-full overflow-auto px-6">{children}</div>
      </section>
    </main>
  );
};

export default BoardLayout;
