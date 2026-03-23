'use client';

import { useEffect, useState } from 'react';

export default function DarkLightToggle({ themeTo, theme }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    theme == 'dark' ? setIsDark(true) : setIsDark(false);
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
    isDark ? themeTo('light') : themeTo('dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex items-center h-4 rounded-full w-12 focus:outline-none cursor-pointer bg-blue-500`}
      aria-label="Toggle dark/light mode"
      role="switch"
      aria-checked={isDark}
    >
      <span
        className={`transform transition-transform duration-300 ease-in-out inline-block w-8 h-8 bg-gray-700 rounded-full shadow-md text-white pt-1 ${
          isDark ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        {isDark && <span className="text-[12px]">OFF</span>}
        {!isDark && <span className="text-[12px]">ON</span>}
      </span>
    </button>
  );
}
