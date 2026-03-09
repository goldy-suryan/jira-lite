'use client';
import React, { ReactNode } from 'react';
import LeftNav from './components/leftNav';
import UserDropdown from './components/userDropdown';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '../state/hooks';

const BoardLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const titleSelector = useAppSelector((state) => state.title);
  const userSelector = useAppSelector((state) => state?.user?.user);

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 pt-8 grid grid-cols-[180px_1fr] gap-8">
      {/* Sidebar */}
      <LeftNav />

      {/* Main content */}
      <section className="flex flex-col gap-6 overflow-hidden">
        <header className="flex justify-between items-center">
          <div className="text-xl font-semibold">
            {pathname.includes('dashboard') ? (
              <span>
                <code>👋</code> Welcome {userSelector?.name ?? ''}
              </span>
            ) : (
              <span>{titleSelector?.title}</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <input
              type="search"
              placeholder="Search"
              className="rounded-lg bg-white/5 border border-white/10 px-4 py-1 mr-8 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <UserDropdown />
          </div>
        </header>
        <hr className="border-t border-white/20" />

        {/* Children container with horizontal scroll */}
        <div className="flex-1 overflow-x-auto max-w-full">{children}</div>
      </section>
    </main>
  );
};

export default BoardLayout;
