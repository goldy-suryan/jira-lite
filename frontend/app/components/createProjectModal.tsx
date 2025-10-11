'use client';

import { useState } from 'react';

export default function CreateProjectModal({ isOpen, onClose, onCreate }: any) {
  const [projectName, setProjectName] = useState('');

  if (!isOpen) return null;

  function handleSubmit(e: any) {
    e.preventDefault();
    if (projectName.trim() === '') return;
    onCreate(projectName.trim());
    setProjectName('');
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-lg flex items-center justify-center z-50">
      <div className="bg-white/8 rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Create Project
        </h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="projectName" className="block mb-2 text-white/80">
            Project Name
          </label>
          <input
            id="projectName"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full rounded-md bg-zinc-800 border border-white/20 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter project name"
            autoFocus
          />
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                setProjectName('');
                onClose();
              }}
              className="px-4 py-2 rounded-md bg-white/10 text-white hover:bg-white/20 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
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
