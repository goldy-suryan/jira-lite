import { useRouter } from 'next/navigation';

export default function ProjectCard({
  title,
  keyName,
  tasks,
  members,
  id,
}: any) {
  const router = useRouter();
  return (
    <div
      className="border border-white/20 rounded-lg p-4 bg-white/5 shadow-md cursor-pointer"
      onClick={() => router.push(`/projects/${id}`)}
    >
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-white/70 mb-1">
        KEY: <span className="font-mono">{keyName}</span>
      </p>
      <p className="text-white/70 text-sm">
        {tasks} Tasks <span className="mx-2">|</span> {members}{' '}
        {members?.length > 1 ? 'Members' : 'Member'}
      </p>
    </div>
  );
}
