import { ReactNode } from 'react';
import { ThemeSwitcher } from '../ui/theme-switcher';
import { LeftNav } from './components/leftNav';
import Notification from './components/notification';
import { UserDropdown } from './components/userDropdown';

const BoardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="h-screen w-screen pt-8 flex md:pl-4 overflow-hidden">
      <LeftNav />
      <section
        className="flex flex-col gap-6 overflow-auto w-full"
      >
        <header className="align-hor px-4">
          <div className="text-xl flex-grow md:max-w-[50%]">
            <input
              type="search"
              placeholder="Coming Soon..."
              name="search"
              id="search"
              disabled={true}
              className="rounded-lg light:bg-gray-200 dark:bg-white/5 border light:border-gray-200 dark:border-white/10 px-4 py-1 w-full"
            />
          </div>
          <div className="align-hor gap-8 hidden md:block md:min-w-[15%]">
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
