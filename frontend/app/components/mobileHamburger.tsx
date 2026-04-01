'use client';

import { ThemeSwitcher } from '@/app/ui/theme-switcher';
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { FaBars } from 'react-icons/fa6';
import MainNav from './mainNav';
import Notification from './notification';
import { UserDropdown } from './userDropdown';

const MobileHamburger = () => {
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
        <span className="align-hor gap-4 mb-3">
          <Notification />
          <ThemeSwitcher />
          <UserDropdown />
        </span>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden mt-4 text-sm">
          <MainNav />
        </div>
      )}
    </nav>
  );
};

export default MobileHamburger;
