'use client';

import { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { CreateProjectModal } from '../dashboard/components/createProjectModal';
import { InviteMembersModal } from '../projects/components/addMembersDialog';

export const CreateButton = ({ open }) => {
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [projectMemberOpen, setProjectMemberOpen] = useState(false);

  return (
    <>
      <button
        className="rounded-md font-semibold transition cursor-pointer fixed bottom-15 right-15 flex items-center gap-2"
        onClick={() => {
          open === 'project'
            ? setProjectModalOpen(true)
            : setProjectMemberOpen(true);
        }}
      >
        <div className="flex items-center justify-center w-[38px] h-[38px] rounded-full bg-blue-500 transition-transform duration-300 ease-in-out hover:scale-125">
          <FaPlus className="text-white" size={20} />
        </div>
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
