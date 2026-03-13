'use client';

import { useState } from 'react';
import { CreateProjectModal } from './createProjectModal';
import { InviteMembersModal } from './addMembersDialog';

export const CreateButton = ({ btnText, open }) => {
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [projectMemberOpen, setProjectMemberOpen] = useState(false);

  return (
    <>
      <button
        className="mb-6 rounded-md bg-blue-600 px-3 py-1 font-semibold hover:bg-blue-700 transition cursor-pointer"
        onClick={() => {
          open == 'project'
            ? setProjectModalOpen(true)
            : setProjectMemberOpen(true);
        }}
      >
        + {btnText}
      </button>
      {projectModalOpen && open == 'project' && (
        <CreateProjectModal
          isOpen={projectModalOpen}
          onClose={() => setProjectModalOpen(false)}
        />
      )}
      {projectMemberOpen && open == 'member' && (
        <InviteMembersModal
          isOpen={projectMemberOpen}
          onClose={() => setProjectMemberOpen(false)}
        />
      )}
    </>
  );
};
