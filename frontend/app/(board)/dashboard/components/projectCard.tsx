import Link from 'next/link';

export const ProjectCard = ({
  title,
  keyName,
  tasks,
  members,
  id,
}: any) => {
  return (
    <Link
      href={`/projects/${id}`}
      className="border border-white/20 rounded-lg p-4 bg-white/5 shadow-md cursor-pointer"
      role="button"
    >
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-white/70 mb-1">
        KEY: <span className="font-mono">{keyName}</span>
      </p>
      <p className="text-white/70 text-sm">
        {tasks} Tasks <span className="mx-2">|</span> {members}{' '}
        {members?.length > 1 ? 'Members' : 'Member'}
      </p>
    </Link>
  );
}
