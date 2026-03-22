'use client';

import { CrossBtn } from '@/app/components/icons';
import { CREATE_PROJECT } from '@/app/graphql/mutations/board.mutation';
import { GET_USER_PROJECTS } from '@/app/graphql/queries/board.query';
import { useAppSelector } from '@/app/state/hooks';
import { useMutation } from '@apollo/client/react';
import { useState } from 'react';

const formInitialValue = {
  name: '',
  description: '',
  key: '',
};

export const CreateProjectModal = ({ isOpen, onClose }: any) => {
  const [formValue, setFormValue] = useState(formInitialValue);
  const [error, setError] = useState('');
  const userSelector = useAppSelector((state) => state?.user?.user);
  const [createProject] = useMutation(CREATE_PROJECT, {
    refetchQueries: [
      {
        query: GET_USER_PROJECTS,
        variables: { userId: userSelector?.id },
      },
    ],
  });

  const addProject = async () => {
    try {
      if (!formValue.name || !formValue.key) {
        return setError('Project name and key are required');
      }
      await createProject({
        variables: {
          input: {
            name: formValue.name,
            key: formValue.key,
            description: formValue.description ?? '',
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="bg-[#121212] rounded-lg p-6 w-full max-w-md mx-4">
        <header className="flex justify-between items-start  border-b border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Create Project</h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="transition"
          >
            <CrossBtn />
          </button>
        </header>
        <form className="text-sm mt-6">
          <label htmlFor="projectName" className="block mb-2">
            Project Name
          </label>
          <input
            id="projectName"
            type="text"
            value={formValue.name}
            onChange={(e) =>
              setFormValue((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full rounded-md bg-zinc-800 border border-white/20 px-3 py-2 mb-6"
            placeholder="Enter project name"
            autoFocus
          />
          <label htmlFor="key" className="block mb-2">
            Key
          </label>
          <input
            id="key"
            type="text"
            value={formValue.key}
            onChange={(e) =>
              setFormValue((prev) => ({ ...prev, key: e.target.value }))
            }
            className="w-full rounded-md bg-zinc-800 border border-white/20 px-3 py-2 mb-6"
            placeholder="Enter key"
            autoFocus
          />
          <label htmlFor="description" className="block mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={formValue.description}
            onChange={(e) =>
              setFormValue((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full rounded-md bg-zinc-800 border border-white/20 px-3 py-2 mb-6 h-32"
            placeholder="Enter description"
            autoFocus
          />
          <div className="mt-2 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                setFormValue(formInitialValue);
                onClose();
              }}
              className="rounded-md border border-gray-700 px-6 py-2 hover:border-gray-500 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={addProject}
              className="px-4 py-2 rounded-md bg-blue-600 font-semibold hover:bg-blue-700 transition"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
