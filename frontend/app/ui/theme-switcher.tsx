'use client';

import { useTheme } from 'next-themes';
import DarkLightToggle from '../components/darkLightToggle';

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <section className="flex items-center gap-2">
      <DarkLightToggle themeTo={setTheme} theme={theme} />
    </section>
  );
};
