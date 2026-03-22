import { FaPlus } from "react-icons/fa6";

type NewProjectCardProps = {
  onClick?: () => void;
};

export const CraeteProjectCard = ({ onClick }: NewProjectCardProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/20 bg-white/5 p-6 text-center text-gray-300 hover:bg-white/10 transition">
      <div
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-md border border-white/20 bg-white/10 text-white transition group-hover:bg-white/20 cursor-pointer"
        onClick={onClick}
      >
        <FaPlus size={28}/>
      </div>
      <h3 className="text-lg font-semibold text-white">New Project</h3>
      <p className="mt-1 text-sm text-gray-400">Initialize a clean Project</p>
    </div>
  );
};
