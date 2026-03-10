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
import { useEffect, useRef, useState } from 'react';
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

  const prevTaskGroupRef = useRef<Record<string, Task[]>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [taskGroup, setTaskGroup] = useState<Record<string, Task[]>>({});
  const [activeTask, setActiveTask] = useState<null | Task>(null);
  const [taskMap, setTaskMap] = useState<Record<string, Task>>({});

  const { data } = useQuery<{ getProjectById: { name: string; tasks: any[] } }>(
    GET_PROJECT_BY_ID,
    {
      variables: { projectId: params.projectId },
    },
  );

  useEffect(() => {
    dispatch(addTitle(data?.getProjectById?.name ?? 'Projects'));
    dispatch(addCurrentProject(data?.getProjectById));

    const tasks = data?.getProjectById?.tasks ?? [];
    const grouped = Object.groupBy(
      tasks.map((task) => ({
        ...task,
        status: task.status.toLowerCase(),
      })),
      (task) => task.status,
    ) as Record<string, Task[]>;
    setTaskGroup(grouped);

    const map: Record<string, Task> = {};
    tasks.forEach((task) => {
      map[task.id] = task;
    });
    setTaskMap(map);
  }, [data]);

  const updateTaskGroup = (
    draggedTaskId: string,
    updater: (prev: Record<string, Task[]>) => Record<string, Task[]>,
  ) => {
    setTaskGroup((prev) => {
      const newTaskGroup = updater(prev);
      const draggedTaskOld = Object.values(prev)
        .flat()
        .find((t) => t.id === draggedTaskId);

      const draggedTaskNew = Object.values(newTaskGroup)
        .flat()
        .find((t) => t.id === draggedTaskId);

      if (
        draggedTaskOld &&
        draggedTaskNew &&
        (draggedTaskOld.status !== draggedTaskNew.status ||
          draggedTaskOld.position !== draggedTaskNew.position)
      ) {
        // Need to update DB here with new status and position based on taskId
        console.log('Dragged task changed:', draggedTaskNew);
      }

      return newTaskGroup;
    });
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;

    const draggedTaskId = active.id;
    const targetId = over.id;

    updateTaskGroup(draggedTaskId, (prev) => {
      let draggedTask: any = null;
      let sourceColumn: string | null = null;

      for (const [status, tasks] of Object.entries(prev)) {
        const foundTask = tasks.find((t) => t.id == draggedTaskId);
        if (foundTask) {
          draggedTask = foundTask;
          sourceColumn = status;
          break;
        }
      }

      if (!draggedTask || !sourceColumn) return prev;

      let targetColumn: any = null;

      if (prev[over.id]) {
        targetColumn = over.id;
      } else {
        for (const [status, tasks] of Object.entries(prev)) {
          if (tasks.some((t) => t.id == targetId)) {
            targetColumn = status;
            break;
          }
        }
      }

      if (!targetColumn) {
        const columnExists = columnsData.find(
          (col) => col.title.toLowerCase() == over.id,
        );
        if (columnExists) {
          targetColumn = over.id;
        } else {
          return prev;
        }
      }

      const newSourceTasks = prev[sourceColumn].filter(
        (t) => t.id != draggedTaskId,
      );
      const newTargetTasks = prev[targetColumn] ? [...prev[targetColumn]] : [];

      if (sourceColumn == targetColumn) {
        const oldIndex = prev[sourceColumn].findIndex(
          (t) => t.id == draggedTaskId,
        );
        const newIndex = prev[targetColumn].findIndex((t) => t.id == targetId);
        if (oldIndex == -1 || newIndex == -1) {
          return prev;
        }
        const newPosition = calculateNewPosition(targetColumn, prev, newIndex);

        const updatedDraggedTask = { ...draggedTask, position: newPosition };
        const reorderedTasks = arrayMove(
          prev[sourceColumn],
          oldIndex,
          newIndex,
        );

        reorderedTasks.splice(newIndex, 1, updatedDraggedTask);

        return {
          ...prev,
          [sourceColumn]: reorderedTasks,
        };
      } else {
        const targetIndex = newTargetTasks.findIndex((t) => t.id == targetId);

        const insertionIndex =
          targetIndex == -1 ? newTargetTasks.length : targetIndex;
        const newPosition = calculateNewPosition(
          targetColumn,
          prev,
          insertionIndex,
        );

        const updatedDraggedTask = {
          ...draggedTask,
          status: targetColumn,
          position: newPosition,
        };

        if (targetIndex == -1) {
          newTargetTasks.push(updatedDraggedTask);
        } else {
          newTargetTasks.splice(targetIndex, 0, updatedDraggedTask);
        }

        return {
          ...prev,
          [sourceColumn]: newSourceTasks,
          [targetColumn]: newTargetTasks,
        };
      }
    });
  };

  const calculateNewPosition = (
    newStatus: string,
    taskGroup: Record<string, Task[]>,
    targetIndex: number,
  ): number => {
    const tasks: any = taskGroup[newStatus] || [];

    if (targetIndex == 0) {
      if (tasks.length == 0) {
        return 10000;
      }
      return tasks[0].position / 2;
    }

    if (targetIndex >= tasks.length) {
      return tasks[tasks.length - 1].position + 10000;
    }

    const prevPosition = tasks[targetIndex - 1].position;
    const nextPosition = tasks[targetIndex].position;

    return (prevPosition + nextPosition) / 2;
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
        const task = taskMap[id];
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
            className="w-90 rounded-lg bg-white/5 flex-shrink-0 flex flex-col"
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
