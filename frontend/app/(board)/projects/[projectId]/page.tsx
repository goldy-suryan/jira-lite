'use client';

import { GET_PROJECT_BY_ID } from '@/app/graphql/queries/project.query';
import { addTitle } from '@/app/state/features/pageTitle.slice';
import { addCurrentProject } from '@/app/state/features/project.slice';
import { useAppDispatch, useAppSelector } from '@/app/state/hooks';
import { useQuery } from '@apollo/client/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import CreateTaskModal from '../../components/createTaskModal';

const columnsData = [
  { id: 1, title: 'Todo', color: 'bg-cyan-500' },
  { id: 2, title: 'In_progress', color: 'bg-purple-600' },
  { id: 3, title: 'Done', color: 'bg-green-600' },
  { id: 4, title: 'Ready_for_review', color: 'bg-yellow-500' },
];

export default function KanbanBoard() {
  const params = useParams();
  const dispatch = useAppDispatch();

  const [modalOpen, setModalOpen] = useState(false);
  const [taskGroup, setTaskGroup] = useState({});

  const { data } = useQuery<{ getProjectById: { name: string; tasks: any[] } }>(
    GET_PROJECT_BY_ID,
    {
      variables: { projectId: params.projectId },
    },
  );

  useEffect(() => {
    dispatch(addTitle(data?.getProjectById?.name ?? 'Projects'));
    dispatch(addCurrentProject(data?.getProjectById));
    setTaskGroup(
      Object.groupBy(data?.getProjectById.tasks ?? [], ({ status }) =>
        status?.toLowerCase(),
      ),
    );
  }, [data]);

  const formatDate = (dateString: string) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' } as any;
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const priorityBackground = (priority: string) => {
    let lowerCasePriority = priority?.toLowerCase();
    if (lowerCasePriority == 'low') {
      return 'bg-green-600';
    } else if (lowerCasePriority == 'medium') {
      return 'bg-orange-600';
    } else {
      return 'bg-red-600';
    }
  };

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
              {col.title.replaceAll('_', ' ')}
            </div>

            {/* Cards container with vertical scroll */}
            <div className="p-4 overflow-y-auto flex-grow space-y-4 my-2 min-h-[600px] max-h-[600px]">
              <button
                className="text-blue-400 text-sm hover:underline cursor-pointer"
                onClick={() => setModalOpen(true)}
              >
                + Add Task
              </button>
              {modalOpen && (
                <CreateTaskModal
                  isOpen={modalOpen}
                  onClose={() => setModalOpen(false)}
                />
              )}
              {taskGroup[col?.title?.toLowerCase()]?.length ? (
                (taskGroup[col?.title?.toLowerCase()] || [])
                  .map((card) => (
                    <div
                      key={card.id}
                      className="bg-white/10 rounded-md p-4 cursor-pointer hover:bg-white/20 transition"
                    >
                      <h3 className="text-white mb-4 text-lg">{card?.title}</h3>
                      <p className="text-xs">
                        Priority:{' '}
                        <span
                          className={`${priorityBackground(card?.priority)} text-white text-xs px-1 py-0.5 rounded`}
                        >
                          {card?.priority}
                        </span>
                      </p>
                      <p className="text-white text-xs mt-2">
                        Due Date: {formatDate(card.dueDate)}
                      </p>
                      <div className="flex flex-wrap gap-2"></div>
                    </div>
                  ))
              ) : (
                <div className="flex items-center justify-center min-h-[30rem]">
                  <p className="text-sm text-center align-middle">
                    No Task assigned
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
