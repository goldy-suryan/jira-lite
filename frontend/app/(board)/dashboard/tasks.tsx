'use client';

import { GET_USER_TASKS } from '@/app/graphql/queries/dashboard.query';
import { useAppSelector } from '@/app/state/hooks';
import { useQuery } from '@apollo/client/react';
import { TaskDetailModal } from '../projects/components/taskDetailModal';
import { useState } from 'react';
import { getPriorityIcon } from '../projects/components/taskCard';

const UsersTask = () => {
  const [taskDetailDialogOpen, setTaskDetailDialogOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

  const userSelector = useAppSelector((state) => state.user.user);
  const { data, loading } = useQuery<any>(GET_USER_TASKS, {
    variables: {
      userId: userSelector?.id,
    },
  });

  return (
    <section className="light:shadow-xl dark:shadow-md dark:shadow-[#212124] rounded p-4 border-t-4 border-cyan-500 overflow-hidden">
      <div className=" mb-3 pb-1 font-semibold">My Tasks</div>
      <div className="text-sm">
        {!loading && (
          <div>
            {/* <p className="font-semibold uppercase mb-1">list of few tasks</p> */}
            <ul className="space-y-1">
              {data.getUserTasks.map((task) => (
                <li key={task.id}>
                  <div
                    onClick={() => {
                      setActiveTask(task);
                      setTaskDetailDialogOpen(true);
                    }}
                    className="underline cursor-pointer line-clamp-1"
                  >
                    {task.title}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {taskDetailDialogOpen && (
        <TaskDetailModal
          isOpen={taskDetailDialogOpen}
          onClose={(e) => {
            e?.stopPropagation();
            setActiveTask(null);
            setTaskDetailDialogOpen(false);
          }}
          task={activeTask}
          priorityIcon={getPriorityIcon}
        />
      )}
    </section>
  );
};

export default UsersTask;
