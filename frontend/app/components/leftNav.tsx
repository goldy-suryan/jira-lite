import MainNav from './mainNav';

export const LeftNav = () => {
  return (
    <nav className="flex flex-col justify-between h-full w-[15%] p-2 pt-6 border-r light:border-gray-400 dark:border-white/20 hidden md:flex">
      <MainNav />
    </nav>
  );
};

export default LeftNav;
