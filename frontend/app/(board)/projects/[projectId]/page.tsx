'use client';

import { GET_PROJECT_BY_ID } from '@/app/graphql/queries/project.query';
import { addTitle } from '@/app/state/features/pageTitle.slice';
import { addCurrentProject } from '@/app/state/features/project.slice';
import { useAppDispatch } from '@/app/state/hooks';
import { useQuery } from '@apollo/client/react';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

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
    {
      id: 3,
      title: 'Mobile Developer',
      company: 'I Networks',
      tags: ['Flutter', 'Dart', 'Firebase'],
    },
    {
      id: 4,
      title: 'Mobile Developer',
      company: 'I Networks',
      tags: ['Flutter', 'Dart', 'Firebase'],
    },
    {
      id: 5,
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
  5: [
    {
      id: 6,
      title: 'Software Developer',
      company: 'Profan',
      tags: ['Node.js', 'PostgreSQL'],
    },
  ],
};

export default function KanbanBoard() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const { data } = useQuery<{ getProjectById: { name: string } }>(
    GET_PROJECT_BY_ID,
    {
      variables: { projectId: params.projectId },
    },
  );

  useEffect(() => {
    dispatch(addTitle(data?.getProjectById?.name ?? 'Projects'));
    dispatch(addCurrentProject(data?.getProjectById));
  }, [data]);

  return (
    <>
      <h2 className="text-xl mb-6 -mt-1">Tasks</h2>
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
            <div className="p-4 overflow-y-auto flex-grow space-y-4 my-2 min-h-[600px] max-h-[600px]">
              <button className="text-blue-400 text-sm hover:underline cursor-pointer">
                + Add Task
              </button>
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
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
