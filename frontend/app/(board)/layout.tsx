'use client';

import { ReactNode } from 'react';
import { useAuthCheck } from '../hooks/useAuthCheck';
import { ThemeSwitcher } from '../ui/theme-switcher';
import { LeftNav } from './components/leftNav';
import MobileHamburger from './components/mobileHamburger';
import Notification from './components/notification';
import { UserDropdown } from './components/userDropdown';

const BoardLayout = ({ children }: { children: ReactNode }) => {
  useAuthCheck();

  return (
    <main className="h-screen w-screen flex overflow-hidden">
      <LeftNav />
      <section className="flex flex-col gap-6 overflow-auto w-full pt-4">
        <header className="align-hor px-4">
          <div className="text-xl flex-grow md:max-w-[50%]">
            <MobileHamburger />
          </div>
          <div className="hidden sm:flex sm:justify-between sm:items-center gap-8 hidden mt-1">
            <Notification />
            <ThemeSwitcher />
            <UserDropdown />
          </div>
        </header>
        <hr className="border-t light:border-gray-400 dark:border-white/20" />
        <div className="flex-1 overflow-auto">{children}</div>
      </section>
    </main>
  );
};

export default BoardLayout;
