'use client';

import Image from 'next/image';
import { useState } from 'react';
import { CreateProjectModal } from '../dashboard/components/createProjectModal';
import { InviteMembersModal } from '../projects/components/addMembersDialog';

export const CreateButton = ({ open }) => {
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [projectMemberOpen, setProjectMemberOpen] = useState(false);

  return (
    <>
      <button
        className="rounded-md font-semibold transition cursor-pointer flex items-center gap-2"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          open === 'project'
            ? setProjectModalOpen(true)
            : setProjectMemberOpen(true);
        }}
      >
        <div className="flex items-center justify-center rounded-full bg-cyan-600 transition-transform duration-300 ease-in-out hover:scale-125">
          <Image
            src="/invite-member.png"
            alt="invite member"
            style={{ filter: 'invert(1)' }}
            height={30}
            width={30}
          />
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
