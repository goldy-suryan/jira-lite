'use client';

import { GET_USER_ASSIGNED_TASKS } from '@/app/graphql/queries/dashboard.query';
import { useAppSelector } from '@/app/state/hooks';
import { formatDate } from '@/app/utils/helperFunc';
import { useQuery } from '@apollo/client/react';
import { getPriorityIcon } from '../projects/components/taskCard';
import { useState } from 'react';
import { TaskDetailModal } from '../projects/components/taskDetailModal';

const UserAssignedTasks = () => {
  const [taskDetailDialogOpen, setTaskDetailDialogOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

  const userSelector = useAppSelector((state) => state.user.user);
  const { data, loading } = useQuery<any>(GET_USER_ASSIGNED_TASKS, {
    variables: {
      userId: userSelector?.id,
    },
  });

  return (
    <section className="light:shadow-xl dark:shadow-md dark:shadow-[#212124] rounded p-4 border-t-4 border-cyan-500 ">
      <div className=" mb-3 pb-1 font-semibold">Assigned to Me</div>
      {!loading && (
        <div className="space-y-3">
          {data.getUserAssignedTasks.map((task) => (
            <div
              onClick={() => {
                setActiveTask(task);
                setTaskDetailDialogOpen(true);
              }}
              key={task.id}
              className="p-4 shadow shadow-md dark:border dark:border-gray-700 hover:shadow-md cursor-pointer"
            >
              <div className="font-semibold">{task.title}</div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                Due: {formatDate(task.dueDate)}{' '}
                {getPriorityIcon(task?.priority?.toLowerCase())}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* <div className="mt-2 text-xs text-gray-500">1-5 of 7</div> */}
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

export default UserAssignedTasks;
