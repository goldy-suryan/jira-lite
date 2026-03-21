import Link from 'next/link';
import { BsClockFill, BsFillPersonFill } from 'react-icons/bs';
import { FaEllipsis } from 'react-icons/fa6';

export const ProjectCard = ({
  id,
  title,
  tag,
  description,
  members,
  tasks,
  time,
  lead,
  colorClass,
}) => {
  return (
    <Link
      href={`/projects/${id}`}
      className="glass-card overflow-hidden border border-white/20 rounded-lg bg-white/5 shadow-md cursor-pointer"
    >
      <div className={`h-30 ${colorClass} p-4 flex items-end`}>
        <span className="text-[10px] font-bold text-white uppercase bg-white/20 px-2 py-1 rounded">
          {tag}
        </span>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{title}</h3>
          <button
            className="text-gray-200 cursor-pointer"
            onClick={(e) => e.preventDefault()}
          >
            <FaEllipsis size={20} />
          </button>
        </div>
        <p className="text-sm text-gray-200 line-clamp-2 mb-6">{description}</p>

        <div className="flex items-center justify-between mt-4">
          <div className="flex -space-x-2">
            {members.map((mem) => (
              <div
                key={mem.id}
                className="w-8 h-8 rounded-full border-2 border-white/20 bg-gray-700 text-gray-100 flex items-center justify-center"
              >
                {mem.name[0]}
              </div>
            ))}
          </div>
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium bg-blue-500 text-white`}
          >
            Tasks: {tasks}
          </span>
        </div>

        <hr className="my-6 border-t border-white/15" />

        <div className="flex justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-2">
            <BsClockFill size={15} color="white"/> {time}
          </span>
          <span className="flex items-center gap-2">
            <BsFillPersonFill size={15} color="white"/> {lead}
          </span>
        </div>
      </div>
    </Link>
  );
};
