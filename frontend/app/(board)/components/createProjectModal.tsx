'use client';

import { CREATE_PROJECT } from '@/app/graphql/mutations/board.mutation';
import { useMutation } from '@apollo/client/react';
import { useState } from 'react';

const formInitialValue = {
  name: '',
  description: '',
  key: '',
};

export default function CreateProjectModal({ isOpen, onClose }: any) {
  const [formValue, setFormValue] = useState(formInitialValue);
  const [error, setError] = useState('');
  const [createProject] = useMutation(CREATE_PROJECT, {
    refetchQueries: ['GetUserProjects'],
  });

  const addProject = () => {
    try {
      if (!formValue.name || !formValue.key) {
        return setError('Project name and key are required');
      }
      createProject({
        variables: {
          input: {
            name: formValue.name,
            key: formValue.key,
            description: formValue.description ?? '',
          },
        },
      });
      setFormValue(formInitialValue);
      onClose();
    } catch (e) {
      console.log(e, 'error while creating project');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-lg flex items-center justify-center z-50">
      <div className="bg-white/8 rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Create Project
        </h2>
        <form>
          <label htmlFor="projectName" className="block mb-2 text-white/80">
            Project Name
          </label>
          <input
            id="projectName"
            type="text"
            value={formValue.name}
            onChange={(e) =>
              setFormValue((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full rounded-md bg-zinc-800 border border-white/20 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
            placeholder="Enter project name"
            autoFocus
          />
          <label htmlFor="key" className="block mb-2 text-white/80">
            Key
          </label>
          <input
            id="key"
            type="text"
            value={formValue.key}
            onChange={(e) =>
              setFormValue((prev) => ({ ...prev, key: e.target.value }))
            }
            className="w-full rounded-md bg-zinc-800 border border-white/20 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
            placeholder="Enter key"
            autoFocus
          />
          <label htmlFor="description" className="block mb-2 text-white/80">
            Description
          </label>
          <textarea
            id="description"
            value={formValue.description}
            onChange={(e) =>
              setFormValue((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full rounded-md bg-zinc-800 border border-white/20 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
            placeholder="Enter description"
            autoFocus
          />
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                setFormValue(formInitialValue);
                onClose();
              }}
              className="px-4 py-2 rounded-md bg-white/10 text-white hover:bg-white/20 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={addProject}
              className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
