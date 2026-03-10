'use client';

import { CREATE_TASK } from '@/app/graphql/mutations/board.mutation';
import {
  GET_ALL_USERS,
  GET_PROJECT_BY_ID,
} from '@/app/graphql/queries/project.query';
import { useAppSelector } from '@/app/state/hooks';
import { useMutation, useQuery } from '@apollo/client/react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { ConfirmDialog } from './confirmDialog';

const formInitialValue = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'low',
  projectId: '',
  createdBy: '',
  assigneeId: '',
  dueDate: '',
  position: 0,
};

export default function CreateTaskModal({ isOpen, onClose }: any) {
  const params = useParams();

  const [formValue, setFormValue] = useState(formInitialValue);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const userSelector = useAppSelector((state) => state?.user?.user);
  const currentProjectSelector = useAppSelector(
    (state) => state.project.currentProject,
  );

  const { data: userList } = useQuery<{ getAllUsers: any }>(GET_ALL_USERS);
  const [createTask] = useMutation(CREATE_TASK, {
    refetchQueries: [
      {
        query: GET_PROJECT_BY_ID,
        variables: { projectId: params.projectId },
      },
    ],
  });

  const addTask = async () => {
    try {
      if (!formValue.title || !formValue.status || !formValue.priority) {
        return setError('Project name and key are required');
      }
      await createTask({
        variables: {
          input: {
            title: formValue.title,
            description: formValue.description ?? '',
            status: formValue.status.toUpperCase(),
            priority: formValue.priority.toUpperCase(),
            projectId: params?.projectId,
            createdBy: userSelector?.id,
            assigneeId: formValue.assigneeId,
            dueDate: formValue.dueDate,
            position: formValue.position,
          },
        },
      });
    } catch (e) {
      console.log(e, 'error while creating project');
    } finally {
      setFormValue(formInitialValue);
      onClose();
    }
  };

  const getOwner = (user) => {
    if (user?.id == (currentProjectSelector as any)?.owner?.id) {
      return '(Owner)';
    } else if (
      (currentProjectSelector as any).users.some((item) => item.id == user?.id)
    ) {
      return '';
    } else {
      return 'Invite';
    }
  };

  const sendInvitation = () => {
    // need to send invitation/email to user
    console.log(formValue.assigneeId, 'send invitation/email to this user');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white/10 rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold mb-4 text-white">Create Task</h2>
        <form className="text-sm">
          {/* Title */}
          <label htmlFor="taskTitle" className="block text-white/80">
            Title
          </label>
          <input
            id="taskTitle"
            type="text"
            value={formValue.title}
            onChange={(e) =>
              setFormValue((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full rounded-md bg-zinc-800 border border-white/20 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            placeholder="Enter task title"
            autoFocus
          />
          {/* Description */}
          <label htmlFor="description" className="block text-white/80">
            Description
          </label>
          <textarea
            id="description"
            value={formValue.description}
            onChange={(e) =>
              setFormValue((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full rounded-md bg-zinc-800 border border-white/20 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 h-32"
            placeholder="Enter description"
            autoFocus
          />
          {/* Status */}
          <label htmlFor="status" className="block text-white/80">
            Status
          </label>
          <select
            id="status"
            value={formValue.status}
            onChange={(e) =>
              setFormValue((prev) => ({ ...prev, status: e.target.value }))
            }
            className="w-full rounded-md bg-zinc-800 border border-white/20 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          >
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
            <option value="ready_for_review">Ready for review</option>
          </select>

          {/* Priority */}
          <label htmlFor="priority" className="block text-white/80">
            Priority
          </label>
          <select
            id="priority"
            className="w-full rounded-md bg-zinc-800 border border-white/20 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            value={formValue.priority}
            onChange={(e) =>
              setFormValue((prev) => ({ ...prev, priority: e.target.value }))
            }
          >
            <option value="low">LOW</option>
            <option value="medium">MEDIUM</option>
            <option value="high">HIGH</option>
          </select>

          {/* Assign */}
          <label htmlFor="assign" className="block text-white/80">
            Assign to
          </label>
          <select
            id="assign"
            className="w-full rounded-md bg-zinc-800 border border-white/20 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 pr-[10rem]"
            value={formValue.assigneeId}
            onChange={(e) => {
              setFormValue((prev) => ({ ...prev, assigneeId: e.target.value }));
              console.log(
                e.target.value,
                (currentProjectSelector as any).users,
              );
              if (
                !(currentProjectSelector as any).users.some(
                  (item) => item.id == e.target.value,
                )
              ) {
                setOpenDialog(true);
              }
            }}
          >
            <option value="">Select</option>
            {userList?.getAllUsers?.map((user: any) => {
              return (
                <option key={user?.id} value={user?.id}>
                  {user?.name} &nbsp;&nbsp;{getOwner(user)}
                </option>
              );
            })}
          </select>

          <label htmlFor="date" className="block text-white/80">
            Due Date
          </label>
          <input
            type="date"
            id="date"
            className="w-full rounded-md bg-zinc-800 border border-white/20 px-3 py-2 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={formValue.dueDate}
            onChange={(e) =>
              setFormValue((prev) => ({ ...prev, dueDate: e.target.value }))
            }
          ></input>

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                setFormValue(formInitialValue);
                onClose();
              }}
              className="px-4 py-2 rounded-md bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={addTask}
              className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition cursor-pointer"
            >
              Create
            </button>
          </div>
        </form>
        <ConfirmDialog
          heading="Confirm Invite"
          isOpen={openDialog}
          onConfirm={sendInvitation}
          onCancel={() => {
            setOpenDialog(false);
            setFormValue((prev) => ({ ...prev, assigneeId: '' }));
          }}
          message="User is not the member of project. Send Invitation?"
          btnText='Invite'
        />
      </div>
    </div>
  );
}
