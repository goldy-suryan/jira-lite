import UserDropdown from '@/app/dashboard/components/userDropdown';

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
    <div className="min-h-screen bg-zinc-950">
      <section className="flex flex-col gap-8 bg-zinc-950 p-7">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-500">JiraLite</h1>
          <div className="flex items-center gap-4">
            <input
              type="search"
              placeholder="Search"
              className="rounded-lg bg-white/5 border border-white/10 px-4 py-1 mr-8 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <UserDropdown />
          </div>
        </header>
      </section>
      <hr className="border-t border-white/20" />
      {/* Horizontal scroll container */}
      <div className="flex space-x-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 bg-zinc-950 p-4 rounded-lg fixed top-30 bottom-0 left-0 right-0 overflow-y-auto">
        {columnsData.map((col) => (
          <div
            key={col.id}
            className="flex-shrink-0 w-80 rounded-lg bg-white/5 flex flex-col max-h-[80vh]"
          >
            <div
              className={`${col.color} text-white font-semibold px-4 py-3 rounded-t-lg`}
            >
              {col.title}
            </div>

            {/* Cards container with vertical scroll */}
            <div className="p-4 overflow-y-auto flex-grow space-y-4 my-4">
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
                        key={`${card.id} ${idx}`}
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
    </div>
  );
}
