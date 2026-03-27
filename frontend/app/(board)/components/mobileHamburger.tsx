'use client';

import { ThemeSwitcher } from '@/app/ui/theme-switcher';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { FaBars } from 'react-icons/fa6';
import Notification from './notification';
import { UserDropdown } from './userDropdown';

const MobileHamburger = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <nav className="sm:hidden">
      <div className="flex justify-between items-center">
        <button
          onClick={toggleMenu}
          className="align-hor focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        <span className="align-hor gap-4 mt-1">
          <Notification />
          <ThemeSwitcher />
          <UserDropdown />
        </span>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden mt-4 text-sm">
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-1 px-3 py-2 rounded-md font-medium my-2 ${pathname.includes('/dashboard') ? 'text-blue-100 bg-cyan-600' : 'hover:bg-cyan-700 hover:text-cyan-100'} transition-colors`}
          >
            Dashboard
          </Link>

          <Link
            href="/projects"
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-1 px-3 py-2 rounded-md font-medium my-2 ${pathname.includes('/projects') ? 'text-blue-100 bg-cyan-600' : 'hover:bg-cyan-700 hover:text-cyan-100'} transition-colors`}
          >
            Projects
          </Link>

          <Link
            href="/tasks"
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-1 px-3 py-2 rounded-md font-medium my-2 ${pathname.includes('/tasks') ? 'text-blue-100 bg-cyan-600' : 'hover:bg-cyan-700 hover:text-cyan-100'}`}
          >
            My Tasks
          </Link>
          <Link
            href="/settings"
            onClick={() => setIsOpen(!isOpen)}
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
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-1 px-3 py-2 rounded-md font-medium ${
              pathname.includes('/help')
                ? 'text-cyan-100 bg-cyan-600'
                : 'hover:bg-cyan-700 hover:text-cyan-100'
            } transition-colors`}
          >
            Help
          </Link>
        </div>
      )}
    </nav>
  );
};

export default MobileHamburger;
