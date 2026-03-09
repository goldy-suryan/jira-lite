'use client';

import { GET_PROJECT_BY_ID } from '@/app/graphql/queries/project.query';
import { Task } from '@/app/graphql/types/interfaces';
import { addTitle } from '@/app/state/features/pageTitle.slice';
import { addCurrentProject } from '@/app/state/features/project.slice';
import { useAppDispatch } from '@/app/state/hooks';
import { useQuery } from '@apollo/client/react';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import CreateTaskModal from '../../components/createTaskModal';
import { DroppableColumn } from '../../components/dropableColumn';
import TaskCard from '../../components/taskCard';

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
  const [taskGroup, setTaskGroup] = useState<Record<string, Task[]>>({});
  const [activeTask, setActiveTask] = useState(null);

  const { data } = useQuery<{ getProjectById: { name: string; tasks: any[] } }>(
    GET_PROJECT_BY_ID,
    {
      variables: { projectId: params.projectId },
    },
  );

  useEffect(() => {
    dispatch(addTitle(data?.getProjectById?.name ?? 'Projects'));
    dispatch(addCurrentProject(data?.getProjectById));
    const grouped = Object.groupBy(
      data?.getProjectById?.tasks ?? [],
      ({ status }) => status?.toLowerCase(),
    ) as Record<string, Task[]>;
    setTaskGroup(grouped);
  }, [data]);

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;

    const draggedTaskId = active.id;
    const targetId = over.id;

    setTaskGroup((prev) => {
      let draggedTask: any = null;
      let sourceColumn: string | null = null;

      const updated = Object.fromEntries(
        Object.entries(prev).map(([status, tasks]: any) => {
          const filtered = tasks.filter((t) => {
            if (t.id === draggedTaskId) {
              draggedTask = t;
              sourceColumn = status;
              return false;
            }
            return true;
          });

          return [status, filtered];
        }),
      );

      if (!draggedTask || !sourceColumn) return prev;

      let targetColumn: string = targetId;

      if (!updated[targetColumn]) {
        for (const col in updated) {
          if (updated[col].some((t) => t.id === targetId)) {
            targetColumn = col;
            break;
          }
        }
      }

      draggedTask = { ...draggedTask, status: targetColumn };

      if (!updated[targetColumn]) {
        updated[targetColumn] = [];
      }

      if (sourceColumn === targetColumn) {
        const sourceTasks = [...prev[sourceColumn]];
        const oldIndex = sourceTasks.findIndex((t) => t.id === draggedTaskId);
        const newIndex = sourceTasks.findIndex((t) => t.id === targetId);

        if (oldIndex === -1 || newIndex === -1) return prev;

        updated[sourceColumn] = arrayMove(sourceTasks, oldIndex, newIndex);
        return updated;
      }

      const overIndex = updated[targetColumn].findIndex(
        (t) => t.id === targetId,
      );

      if (overIndex === -1) {
        updated[targetColumn].push(draggedTask);
      } else {
        updated[targetColumn].splice(overIndex, 0, draggedTask);
      }

      return updated;
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(event) => {
        const id = event.active.id;
        const task = Object.values<any>(taskGroup)
          .flat()
          .find((t: any) => t.id === id);
        setActiveTask(task);
      }}
      onDragEnd={(event) => {
        handleDragEnd(event);
        setActiveTask(null);
      }}
    >
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

            <DroppableColumn id={col.title.toLowerCase()}>
              <SortableContext
                items={(taskGroup[col.title.toLowerCase()] || []).map(
                  (t) => t.id,
                )}
                strategy={verticalListSortingStrategy}
              >
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
                    (taskGroup[col?.title?.toLowerCase()] || []).map((card) => (
                      <TaskCard key={card.id} card={card} />
                    ))
                  ) : (
                    <div className="flex items-center justify-center min-h-[30rem]">
                      <p className="text-sm text-center align-middle">
                        No Task assigned
                      </p>
                    </div>
                  )}
                </div>
              </SortableContext>
            </DroppableColumn>
          </div>
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard card={activeTask} overlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
