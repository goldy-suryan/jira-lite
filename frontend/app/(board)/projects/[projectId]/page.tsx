'use client';

import { UPDATE_TASK_STATUS_POSITION } from '@/app/graphql/mutations/board.mutation';
import { GET_PROJECT_BY_ID } from '@/app/graphql/queries/board.query';
import { Task } from '@/app/graphql/types/interfaces';
import { addTitle } from '@/app/state/features/pageTitle.slice';
import { addCurrentProject } from '@/app/state/features/project.slice';
import { useAppDispatch } from '@/app/state/hooks';
import { columnsData } from '@/app/utils/constants';
import { useMutation, useQuery } from '@apollo/client/react';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaFilter, FaPlus } from 'react-icons/fa6';
import { CreateButton } from '../../components/createButton';
import { CreateOrUpdateTaskModal } from '../components/createOrUpdateTaskModal';
import { DroppableColumn } from '../components/dropableColumn';
import { TaskCard } from '../components/taskCard';
import FilterOverlay from '../components/filterOverlay';

const KanbanBoard = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [taskGroup, setTaskGroup] = useState<Record<string, Task[]>>({});
  const [activeTask, setActiveTask] = useState<null | Task>(null);
  const [taskMap, setTaskMap] = useState<Record<string, Task>>({});
  const [taskToUpdate, setTaskToUpdate] = useState<null | Task>(null);
  const [project, setProject] = useState<any>(null);
  const [openFilters, setOpenFilters] = useState(false);

  const { data, loading } = useQuery<{
    getProjectById: { name: string; tasks: any[] };
  }>(GET_PROJECT_BY_ID, {
    variables: { projectId: params.projectId },
  });
  const [updateTaskStatusPosition] = useMutation(UPDATE_TASK_STATUS_POSITION, {
    refetchQueries: [
      {
        query: GET_PROJECT_BY_ID,
        variables: { projectId: params.projectId },
      },
    ],
  });

  useEffect(() => {
    if (!data?.getProjectById && !loading) {
      router.replace('/dashboard');
      return;
    }
    dispatch(addTitle(data?.getProjectById?.name ?? 'Projects'));
    dispatch(addCurrentProject(data?.getProjectById));
    setProject(data?.getProjectById);
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
  }, [data, dispatch, router]);

  useEffect(() => {
    if (!taskToUpdate) return;
    const updateTaskStatusAndPosition = async () => {
      try {
        await updateTaskStatusPosition({
          variables: {
            id: taskToUpdate.id,
            input: {
              status: taskToUpdate?.status?.toUpperCase(),
              position: taskToUpdate.position,
            },
          },
        });
      } catch (e) {
        console.log(e, 'error while updating task');
      } finally {
        setTaskToUpdate(null);
      }
    };
    updateTaskStatusAndPosition();
  }, [taskToUpdate]);

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
        setTaskToUpdate(draggedTaskNew);
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
        const newPosition = calculateNewPosition(
          targetColumn,
          prev,
          newIndex,
          draggedTaskId,
        );

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
          draggedTaskId,
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
    draggedTaskId: string,
  ): number => {
    const tasks = (taskGroup[newStatus] || []).filter(
      (task) => task.id !== draggedTaskId,
    );

    if (targetIndex === 0) {
      if (tasks.length === 0) return 10000;

      const firstTask = tasks[0];
      return firstTask.position / 2;
    }

    if (targetIndex >= tasks.length) {
      const lastPosition = tasks.at(-1)?.position ?? 0;
      return lastPosition + 10000;
    }

    const prevTask = tasks[targetIndex - 1];
    const nextTask = tasks[targetIndex];

    if (!prevTask || !nextTask) return 10000;

    return (prevTask.position + nextTask.position) / 2;
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
  );

  return (
    <>
      <div className="max-w-full px-6">
        <header className="align-hor text-xl font-semibold light:bg-[#ededed] dark:bg-black h-12 fixed left-0 sm:left-[15%] right-0 px-6 z-20">
          <span className="">{project?.name}</span>
          <span className="align-hor gap-8">
            <button
              className="align-hor gap-2 text-sm font-normal outline px-4 py-2 rounded-md cursor-pointer hover:border hover:border-cyan-500 hover:outline-none"
              onClick={(e) => {
                e.preventDefault();
                setOpenFilters(true);
              }}
            >
              Filter <FaFilter size={18} />
            </button>
            <CreateButton open="member" />
          </span>
        </header>
        <FilterOverlay
          isOpen={openFilters}
          closePanel={() => setOpenFilters(false)}
        />
      </div>
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
        <div className="w-full h-full px-6 mt-[4rem]">
          <div className="flex gap-8 min-w-max pr-[2rem] pb-[1rem]">
            {columnsData.map((col) => (
              <div
                key={col.id}
                className={`w-[320px] rounded-xl flex-shrink-0 flex flex-col bg-white/6 p-4 ${col.shadow} shadow-xl`}
              >
                <div className="font-semibold flex items-center justify-between uppercase">
                  <div>
                    {col.title.replaceAll('_', ' ')}
                    <span
                      className={`ml-2 inline-block h-5 w-5 rounded-sm text-center font-normal text-sm ${col.color}`}
                    >
                      {taskGroup?.[col?.title?.toLowerCase()]?.length ?? 0}
                    </span>
                  </div>
                  <button
                    className="text-cyan-500 text-sm hover:text-cyan-700 cursor-pointer bg-cyan-500 rounded-full p-1"
                    onClick={() => setModalOpen(true)}
                  >
                    <FaPlus size={18} color={'white'} />
                  </button>
                </div>
                <hr className="mt-4 border-t light:border-gray-400 dark:border-white/20" />
                <DroppableColumn id={col.title.toLowerCase()}>
                  <SortableContext
                    items={(taskGroup[col.title.toLowerCase()] || []).map(
                      (t) => t.id,
                    )}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="pt-2 flex-grow space-y-4 my-2 min-h-[600px] max-h-[600px] [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
                      {/* <button
                      className="text-cyan-500 text-sm hover:text-cyan-700 cursor-pointer"
                      onClick={() => setModalOpen(true)}
                    >
                      Add Task
                    </button> */}
                      {modalOpen && (
                        <CreateOrUpdateTaskModal
                          isOpen={modalOpen}
                          onClose={() => setModalOpen(false)}
                        />
                      )}
                      {taskGroup[col?.title?.toLowerCase()]?.length ? (
                        (taskGroup[col?.title?.toLowerCase()] || []).map(
                          (card) => (
                            <TaskCard
                              key={card.id}
                              card={card}
                              owner={project.owner}
                              border={col.border}
                              color={col.color}
                            />
                          ),
                        )
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
        </div>

        <DragOverlay>
          {activeTask ? (
            <TaskCard
              card={activeTask}
              owner={project.owner}
              border={''}
              color={''}
              overlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
};

export default KanbanBoard;
