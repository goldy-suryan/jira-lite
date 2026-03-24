'use client';

import { GET_USER_PROJECTS } from '@/app/graphql/queries/board.query';
import { IGetUserProjects } from '@/app/graphql/types/interfaces';
import { useAuthCheck } from '@/app/hooks/useAuthCheck';
import { useAppSelector } from '@/app/state/hooks';
import { headerColors } from '@/app/utils/constants';
import { formatDate } from '@/app/utils/helperFunc';
import { useQuery } from '@apollo/client/react';
import { useEffect, useState } from 'react';
import { CraeteProjectCard } from './components/createProjectCard';
import { CreateProjectModal } from './components/createProjectModal';
import { ProjectCard } from './components/projectCard';

export default function DashboardLayout() {
  useAuthCheck();
  const userSelector = useAppSelector((state) => state.user);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const { data, loading } = useQuery<IGetUserProjects>(GET_USER_PROJECTS, {
    variables: { userId: userSelector?.user?.id },
  });
  const [myProjects, setMyProjects] = useState(data?.getUserProjects);

  useEffect(() => {
    setMyProjects((prev) => data?.getUserProjects);
  }, [data]);

  return (
    <div className="flex-grow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold mb-2">Your Projects</h2>
        {/* <CreateButton btnText={'Create Project'} open="project" /> */}
        {projectModalOpen && (
          <CreateProjectModal
            isOpen={projectModalOpen}
            onClose={() => setProjectModalOpen(false)}
          />
        )}
      </div>

      {(myProjects?.projects ?? []).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-xxl mb-4">
          <CraeteProjectCard onClick={() => setProjectModalOpen(true)} />
          {myProjects?.projects?.map((proj: any, index: number) => {
            return (
              <ProjectCard
                key={proj?.id}
                {...{
                  id: proj.id,
                  title: proj.name,
                  tag: proj.key,
                  description: proj.description,
                  members: proj.users,
                  tasks: proj?.tasks?.length,
                  time: formatDate(proj.createdAt),
                  lead: proj.owner.name,
                  colorClass: headerColors[index % headerColors.length],
                }}
              />
            );
          })}
        </div>
      )}
      {!loading && (
        <div className="flex justify-center items-center min-h-full">
          {!(myProjects?.projects ?? []).length && (
            <CraeteProjectCard onClick={() => setProjectModalOpen(true)} />
          )}
        </div>
      )}
    </div>
  );
}
