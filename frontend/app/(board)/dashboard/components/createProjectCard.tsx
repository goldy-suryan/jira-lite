import { FaPlus } from 'react-icons/fa6';

type NewProjectCardProps = {
  onClick?: () => void;
};

export const CraeteProjectCard = ({ onClick }: NewProjectCardProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg light:bg-white border-2 border-dashed light:border-gray-300 dark:border-white/20 dark:bg-white/5 p-6 text-center dark:text-gray-300 hover:bg-white/10 shadow-md transition">
      <div
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-md border light:border-gray-200 light:bg-gray-100 dark:border-white/20 dark:bg-white/10 transition group-hover:bg-white/20 cursor-pointer"
        onClick={onClick}
      >
        <FaPlus size={28} />
      </div>
      <h3 className="text-lg font-semibold">New Project</h3>
      <p className="mt-1 text-sm text-gray-400">Initialize a clean Project</p>
    </div>
  );
};
