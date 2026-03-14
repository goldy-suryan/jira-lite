'use client';

import {
  CREATE_TASK,
  UPDATE_TASK,
} from '@/app/graphql/mutations/board.mutation';
import { SEND_INVITATION } from '@/app/graphql/mutations/invitation.mutation';
import {
  GET_PROJECT_BY_ID,
  GET_PROJECT_USERS,
} from '@/app/graphql/queries/board.query';
import { useAppSelector } from '@/app/state/hooks';
import { useMutation, useQuery } from '@apollo/client/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
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

export const CreateOrUpdateTaskModal = ({
  isOpen,
  onClose,
  task = null,
}: any) => {
  const params = useParams();

  const [formValue, setFormValue] = useState(formInitialValue);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const queryToRefetch = {
    query: GET_PROJECT_BY_ID,
    variables: { projectId: params.projectId },
  };

  const userSelector = useAppSelector((state) => state?.user?.user);
  const currentProjectSelector = useAppSelector(
    (state) => state.project.currentProject,
  );

  const { data: projectUsers } = useQuery<any>(GET_PROJECT_USERS, {
    variables: { projectId: params.projectId },
  });
  const [createTask] = useMutation(CREATE_TASK, {
    refetchQueries: [queryToRefetch],
  });
  const [updateTask] = useMutation(UPDATE_TASK, {
    refetchQueries: [queryToRefetch],
  });
  const [sendProjectInvitation] = useMutation(SEND_INVITATION);

  useEffect(() => {
    if (task) {
      setFormValue({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority?.toLowerCase(),
        projectId: task.projectId,
        createdBy: task.createdBy,
        assigneeId: task.assigneeId,
        dueDate: new Date(task.dueDate).toISOString().slice(0, 10),
        position: task.position,
      });
    }
  }, [task]);

  const addOrEditTask = async () => {
    try {
      if (!formValue.title || !formValue.status || !formValue.priority) {
        return setError('Project name and key are required');
      }
      const inputValues = {
        title: formValue.title,
        description: formValue.description ?? '',
        status: formValue.status.toUpperCase(),
        priority: formValue.priority.toUpperCase(),
        projectId: params?.projectId,
        createdBy: userSelector?.id,
        assigneeId: formValue.assigneeId,
        dueDate: formValue.dueDate,
        position: formValue.position,
      };
      if (task) {
        await updateTask({
          variables: {
            id: task.id,
            input: inputValues,
          },
        });
      } else {
        await createTask({
          variables: {
            input: inputValues,
          },
        });
      }
    } catch (e) {
      console.log(e, 'error while creating/updating task');
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

  const sendInvitation = async () => {
    try {
      const sendEmailTo = projectUsers?.getProjectUsers.users?.find(
        (user) => user.id == formValue.assigneeId,
      );
      await sendProjectInvitation({
        variables: {
          projectId: params.projectId,
          email: sendEmailTo?.email,
        },
      });
      setOpenDialog(false);
    } catch (e) {
      console.log(e, 'error while sending invitation');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4"
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-[#121212] rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold mb-4 text-white">
          {task ? 'Edit' : 'Create'} Task
        </h2>
        <form className="text-sm">
          {/* Title */}
          <label htmlFor="taskTitle" className="block text-white/80 mb-2">
            Title
          </label>
          <input
            id="taskTitle"
            type="text"
            value={formValue.title}
            onChange={(e) =>
              setFormValue((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full rounded-md bg-zinc-800 border border-white/20 px-3 py-2 text-white mb-4"
            placeholder="Enter task title"
            autoFocus
          />
          {/* Description */}
          <label htmlFor="description" className="block text-white/80 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={formValue.description}
            onChange={(e) =>
              setFormValue((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full rounded-md bg-zinc-800 border border-white/20 px-3 py-2 text-white mb-4 h-32"
            placeholder="Enter description"
            autoFocus
          />
          {/* Status */}
          <label htmlFor="status" className="block text-white/80 mb-2">
            Status
          </label>
          <select
            id="status"
            value={formValue.status}
            onChange={(e) =>
              setFormValue((prev) => ({ ...prev, status: e.target.value }))
            }
            className="w-full rounded-md bg-zinc-800 border border-white/20 px-3 py-2 text-white mb-4"
          >
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="ready_for_review">Ready for review</option>
            <option value="in_review">In review</option>
            <option value="done">Done</option>
          </select>

          {/* Priority */}
          <label htmlFor="priority" className="block text-white/80 mb-2">
            Priority
          </label>
          <select
            id="priority"
            className="w-full rounded-md bg-zinc-800 border border-white/20 px-3 py-2 text-white mb-4"
            value={formValue.priority}
            onChange={(e) =>
              setFormValue((prev) => ({ ...prev, priority: e.target.value }))
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          {/* Assign */}
          <label htmlFor="assign" className="block text-white/80 mb-2">
            Assign to
          </label>
          <select
            id="assign"
            className="w-full rounded-md bg-zinc-800 border border-white/20 px-3 py-2 text-white mb-4"
            value={formValue.assigneeId}
            onChange={(e) => {
              setFormValue((prev) => ({ ...prev, assigneeId: e.target.value }));
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
            {projectUsers?.getProjectUsers?.users?.map((user: any) => {
              return (
                <option key={user?.id} value={user?.id}>
                  {user?.name} &nbsp;&nbsp;{getOwner(user)}
                </option>
              );
            })}
          </select>

          <label htmlFor="date" className="block text-white/80 mb-2">
            Due Date
          </label>
          <input
            type="date"
            id="date"
            min={new Date().toISOString().split('T')[0]}
            className="w-full rounded-md bg-zinc-800 border border-white/20 px-3 py-2 text-white mb-4"
            value={formValue.dueDate}
            onClick={(e) => {
              e.preventDefault();
              (e.currentTarget as HTMLInputElement).showPicker();
            }}
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
              className="rounded-md border border-gray-700 px-6 py-2 text-gray-400 hover:text-white hover:border-gray-500 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={addOrEditTask}
              className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition cursor-pointer"
            >
              {task ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
        {openDialog && (
          <ConfirmDialog
            heading="Confirm Invite"
            isOpen={openDialog}
            onConfirm={sendInvitation}
            onCancel={(e) => {
              e.stopPropagation();
              setOpenDialog(false);
              setFormValue((prev) => ({ ...prev, assigneeId: '' }));
            }}
            message="User is not the member of project. Send Invitation?"
            btnText="Invite"
          />
        )}
      </div>
    </div>
  );
};
