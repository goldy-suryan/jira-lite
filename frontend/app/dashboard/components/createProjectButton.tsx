'use client';
import { useState } from 'react';
import CreateProjectModal from './createProjectModal';

const CreateProjectButton = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreateProject = () => {};

  return (
    <>
      <button
        className="mb-6 rounded-md bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-700 transition cursor-pointer"
        onClick={() => setModalOpen(true)}
      >
        + Create Project
      </button>
      <CreateProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateProject}
      />
    </>
  );
};

export default CreateProjectButton;
