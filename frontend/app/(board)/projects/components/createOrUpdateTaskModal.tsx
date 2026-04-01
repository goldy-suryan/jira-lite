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
import { isPartialDeepEqual } from '@/app/utils/helperFunc';
import { useMutation, useQuery } from '@apollo/client/react';
import dayjs from 'dayjs';
import { useTheme } from 'next-themes';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaX } from 'react-icons/fa6';
import { ConfirmDialog } from './confirmDialog';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { instance } from '@/app/utils/interceptors';

const formInitialValue = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'low',
  projectId: '',
  createdBy: '',
  assigneeId: '',
  dueDate: new Date().toISOString().split('T')[0],
  position: 0,
};

export const CreateOrUpdateTaskModal = ({
  isOpen,
  onClose,
  task = null,
}: any) => {
  const params = useParams();
  const { theme } = useTheme();
  const [formValue, setFormValue] = useState(formInitialValue);
  const [toUpdate, setToUpdate] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [taskGen, setTaskGen] = useState('');

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
      setFormValue((prev) => ({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority?.toLowerCase(),
        projectId: task.projectId,
        createdBy: task.createdBy,
        assigneeId: task.assigneeId,
        dueDate: dayjs(task.dueDate).format('YYYY-MM-DD'),
        position: task.position,
      }));
    }
  }, [task]);

  useEffect(() => {
    if (!task) return;

    const normalizedTask = {
      ...task,
      priority: task.priority?.toLowerCase(),
      dueDate: dayjs(task.dueDate).format('YYYY-MM-DD'),
    };

    setToUpdate(isPartialDeepEqual(formValue, normalizedTask));
  }, [formValue, task]);

  const addOrEditTask = async () => {
    try {
      if (!formValue.assigneeId) {
        return toast.error('Please enter to whom this assign to');
      }
      if (
        !formValue.title ||
        !formValue.status ||
        !formValue.priority ||
        !formValue.assigneeId
      ) {
        return toast.error(
          'Enter valid values for title, status, and priority',
        );
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
      onClose();
    } catch (e) {
      console.log(e, 'error while creating/updating task');
    } finally {
      setFormValue(formInitialValue);
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
    } catch (e: any) {
      toast.error(e.message);
      console.log(e, 'error while sending invitation');
    }
  };

  const generateTask = async (e) => {
    try {
      e.preventDefault();
      const generatedTask = await instance.post('/ai/generate-task', {
        body: taskGen,
      });
      const data = generatedTask.data.data;
      if (data.invalid) {
        return toast.error(
          "That doesn't look like a task. Try something like: 'Create task to fix login bug'",
        );
      }
      setFormValue((prev) => ({
        ...prev,
        title: data.title,
        description: data.description,
        status: data.status.toLowerCase() || 'todo',
        priority: data.priority?.toLowerCase() || 'low',
        dueDate: data.dueDate
          ? dayjs(data.dueDate).format('YYYY-MM-DD')
          : dayjs().format('YYYY-MM-DD'),
      }));
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center light:bg-white dark:bg-black bg-opacity-70 backdrop-blur-sm mb-0"
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="dark:bg-[#121212] light:shadow-lg light:border light:border-gray-200 rounded-lg p-6 w-full max-w-lg mx-4"
      >
        <header className="flex justify-between items-start border-b border-gray-700">
          <h2 className="text-xl font-semibold mb-4">
            {task ? 'Edit' : 'Create'} Task
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="transition cursor-pointer"
          >
            <FaX />
          </button>
        </header>
        <form className="text-sm mt-4">
          <div className="mb-4">
            <label htmlFor="ai" className="text-sm text-gray-500">
              ✨{' '}
              {task ? 'Improve / update existing task' : 'Describe your task'}{' '}
              (AI will assist you)
            </label>
            <div className="flex gap-2 mt-1">
              <input
                id="ai"
                value={taskGen}
                onChange={(e) => setTaskGen(e.target.value)}
                placeholder={
                  task
                    ? 'Improve description or update priority'
                    : 'e.g. Users cannot login after OAuth update'
                }
                className="flex-1 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={generateTask}
                // disabled={loading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium text-white"
              >
                {task ? 'Update with AI' : 'Generate'}
              </button>
            </div>
          </div>
          {/* Title */}
          <label htmlFor="taskTitle" className="text-sm text-gray-500">
            Title
          </label>
          <input
            id="taskTitle"
            type="text"
            value={formValue.title}
            onChange={(e) =>
              setFormValue((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full rounded-md dark:bg-white/5 px-3 py-2 mb-4 mt-1"
            placeholder="Enter task title"
          />
          {/* Description */}
          <label htmlFor="description" className="text-sm text-gray-500">
            Description
          </label>
          <textarea
            id="description"
            value={formValue.description}
            rows={4}
            onChange={(e) =>
              setFormValue((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full rounded-md dark:bg-white/5 px-3 py-2 mb-4 mt-1"
            placeholder="Enter description"
          />
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* Status */}
            <div>
              <label htmlFor="status" className="text-sm text-gray-500">
                Status
              </label>
              <select
                id="status"
                value={formValue.status}
                onChange={(e) =>
                  setFormValue((prev) => ({ ...prev, status: e.target.value }))
                }
                className={`w-full rounded-md dark:bg-zinc-800 px-3 py-2 mb-4 mt-1 ${theme == 'light' ? 'light_theme' : ''}`}
              >
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="ready_for_review">Ready for review</option>
                <option value="in_review">In review</option>
                <option value="done">Done</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="priority" className="text-sm text-gray-500">
                Priority
              </label>
              <select
                id="priority"
                className={`w-full rounded-md dark:bg-zinc-800 px-3 py-2 mb-4 mt-1 ${theme == 'light' ? 'light_theme' : ''}`}
                value={formValue.priority}
                onChange={(e) =>
                  setFormValue((prev) => ({
                    ...prev,
                    priority: e.target.value,
                  }))
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              {/* Assign */}
              <label htmlFor="assign" className="text-sm text-gray-500">
                Assign to
              </label>
              <select
                id="assign"
                className={`w-full rounded-md dark:bg-zinc-800 px-3 py-2 mb-4 mt-1 ${theme == 'light' ? 'light_theme' : ''}`}
                value={formValue.assigneeId}
                onChange={(e) => {
                  setFormValue((prev) => ({
                    ...prev,
                    assigneeId: e.target.value,
                  }));
                  if (
                    !(currentProjectSelector as any).users.some(
                      (item) => item.id == e.target.value,
                    ) &&
                    e.target.value
                  ) {
                    setOpenDialog(true);
                  }
                }}
              >
                <option value="">Select</option>
                {projectUsers?.getProjectUsers?.users?.map((user: any) => {
                  return (
                    <option key={user?.id} value={user?.id}>
                      {user?.name}&nbsp;&nbsp;{getOwner(user)}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label htmlFor="date" className="text-sm text-gray-500">
                Due Date
              </label>
              <input
                type="date"
                id="date"
                min={new Date().toISOString().split('T')[0]}
                className="w-full rounded-md dark:bg-zinc-800 px-3 py-2 mb-4 mt-1"
                value={formValue.dueDate}
                onClick={(e) => {
                  e.preventDefault();
                  (e.currentTarget as HTMLInputElement).showPicker();
                }}
                onChange={(e) => {
                  e.preventDefault();
                  setFormValue((prev) => ({
                    ...prev,
                    dueDate: e.target.value,
                  }));
                }}
              ></input>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                setFormValue(formInitialValue);
                onClose();
              }}
              className="rounded-md border border-gray-700 px-6 py-2 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={addOrEditTask}
              disabled={
                task
                  ? toUpdate
                  : !formValue.title || !formValue.status || !formValue.priority
              }
              className="px-4 py-2 rounded-md light:text-white bg-cyan-600 font-semibold hover:bg-cyan-700 transition cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
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
      </motion.div>
    </div>
  );
};
