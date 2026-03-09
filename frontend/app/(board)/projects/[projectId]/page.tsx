import UserDropdown from '../../dashboard/components/userDropdown';

const columnsData = [
  { id: 1, title: 'Todo', color: 'bg-cyan-500' },
  { id: 2, title: 'In-progress', color: 'bg-purple-600' },
  { id: 3, title: 'Done', color: 'bg-green-600' },
  { id: 4, title: 'Offer', color: 'bg-yellow-500' },
];

const cardsData = {
  1: [
    {
      id: 1,
      title: 'UI/UX Designer',
      company: 'Wise',
      tags: ['Figma', 'Design Systems', 'User Research'],
    },
    {
      id: 2,
      title: 'Mobile Developer',
      company: 'I Networks',
      tags: ['Flutter', 'Dart', 'Firebase'],
    },
  ],
  2: [
    {
      id: 3,
      title: 'Front End Developer',
      company: 'Stripe',
      tags: ['TypeScript', 'React', 'Next.js'],
    },
    {
      id: 4,
      title: 'QA Engineer',
      company: 'Nutrish',
      tags: ['CIT', 'Appium', 'CI/CD'],
    },
  ],
  3: [
    {
      id: 5,
      title: 'Software Developer',
      company: 'MU Company',
      tags: ['React', 'Tailwind', 'High Pay'],
    },
  ],
  4: [
    {
      id: 6,
      title: 'Software Developer',
      company: 'Profan',
      tags: ['Node.js', 'PostgreSQL'],
    },
  ],
};

export default function KanbanBoard() {
  return (
    <div className="flex gap-6 min-w-max">
      {columnsData.map((col) => (
        <div
          key={col.id}
          className="w-80 rounded-lg bg-white/5 flex-shrink-0 flex flex-col"
        >
          <div
            className={`${col.color} text-white font-semibold px-4 py-3 rounded-t-lg`}
          >
            {col.title}
          </div>

          {/* Cards container with vertical scroll */}
          <div className="p-4 overflow-y-auto flex-grow space-y-4 my-4 max-h-[600px]">
            {((cardsData as any)[col.id] || []).map((card: any) => (
              <div
                key={card.id}
                className="bg-white/10 rounded-md p-4 cursor-pointer hover:bg-white/20 transition"
              >
                <h3 className="text-white font-bold mb-1">{card.title}</h3>
                <p className="text-white mb-2">{card.company}</p>
                <div className="flex flex-wrap gap-2">
                  {card.tags.map((tag: any, idx: number) => (
                    <span
                      key={`${card.id}-${idx}`}
                      className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            <button className="text-blue-400 text-sm mt-2 hover:underline">
              + Add Task
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
