'use client';
import { useState, useRef, useEffect } from 'react';
import { instance } from '../../utils/interceptors';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../../state/hooks';

export default function UserDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const userSelector = useAppSelector((state: any) => state.user);

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
      router.refresh();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-white/80 hover:text-white transition cursor-pointer"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span className="text-sm">
          {userSelector?.user?.name} <code>&#9660;</code>
        </span>
      </button>

      {open && (
        <ul className="absolute right-0 mt-2 w-40 rounded-md bg-zinc-900 border border-white/20 shadow-lg py-2 text-white text-sm z-50">
          <li>
            <a
              href="/profile"
              className="block px-4 py-2 hover:bg-white/10 transition"
              onClick={() => setOpen(false)}
            >
              Profile
            </a>
          </li>
          <li>
            <a
              href="/settings"
              className="block px-4 py-2 hover:bg-white/10 transition"
              onClick={() => setOpen(false)}
            >
              Settings
            </a>
          </li>
          <li>
            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 hover:bg-white/10 transition"
            >
              Logout
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
