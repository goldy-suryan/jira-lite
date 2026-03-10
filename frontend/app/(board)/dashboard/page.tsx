'use client';

import { GET_USER_PROJECTS } from '@/app/graphql/queries/project.query';
import { IGetUserProjects } from '@/app/graphql/types/interfaces';
import { useAppSelector } from '@/app/state/hooks';
import { useQuery } from '@apollo/client/react';
import { useEffect, useState } from 'react';
import { CreateProjectButton } from '../components/createProjectButton';
import { ProjectCard } from '../components/projectCard';

export default function DashboardLayout() {
  const userSelector = useAppSelector((state) => state.user);
  const { data } = useQuery<IGetUserProjects>(GET_USER_PROJECTS, {
    variables: { userId: userSelector?.user?.id },
  });
  const [myProjects, setMyProjects] = useState(data?.getUserProjects);

  useEffect(() => {
    setMyProjects((prev) => data?.getUserProjects);
  }, [data]);

  return (
    <div className="flex-grow">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
        <CreateProjectButton />
      </div>

      <div className="grid grid-cols-2 gap-8 max-w-xxl">
        {myProjects?.projects?.map((proj: any) => {
          return (
            <ProjectCard
              key={proj?.id}
              title={proj?.name}
              keyName={proj?.key}
              tasks={proj?.tasks?.length}
              members={proj?.users?.length}
              id={proj.id}
            />
          );
        })}
      </div>
    </div>
  );
}
