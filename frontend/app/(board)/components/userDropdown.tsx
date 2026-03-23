'use client';

import { instance } from '@/app/utils/interceptors';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FaRegUser } from 'react-icons/fa6';

export const UserDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const logout = async () => {
    try {
      await instance.post('/auth/logout', {});
      localStorage.removeItem('user');
      router.replace('/');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 transition cursor-pointer"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span className="text-sm flex items-center">
          <FaRegUser className="w-7 h-7 rounded-lg mx-auto block border dark:border-gray-500 mr-2" />{' '}
          {/* <code className='text-lg'>&#9660;</code> */}
        </span>
      </button>

      {open && (
        <ul className="absolute right-0 mt-2 w-40 rounded-md light:bg-white dark:bg-zinc-900 border border-white/20 shadow-lg text-sm z-50">
          <li>
            <Link
              href="/profile"
              className="block px-4 py-2 light:hover:bg-gray-300 dark:hover:bg-white/10 transition"
              onClick={() => setOpen(false)}
            >
              Profile
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              className="block px-4 py-2 light:hover:bg-gray-300 dark:hover:bg-white/10 transition"
              onClick={() => setOpen(false)}
            >
              Settings
            </Link>
          </li>
          <li>
            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 light:hover:bg-gray-300 dark:hover:bg-white/10 transition"
            >
              Logout
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};
