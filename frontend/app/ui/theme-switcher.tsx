'use client';

import { useTheme } from 'next-themes';
import { FaToggleOff, FaToggleOn } from 'react-icons/fa6';

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  console.log(theme, 'theme');
  return (
    <main className="flex items-center gap-2">
      {theme == 'dark' ? (
        <><span className="text-xs font-medium">Dark</span><FaToggleOn size={25} className='text-blue-500' onClick={() => setTheme('light')} /></>
      ) : (
        <><span className="text-xs font-medium">Light</span><FaToggleOff size={25} className='text-blue-500' onClick={() => setTheme('dark')} /></>
      )}
    </main>
  );
};
