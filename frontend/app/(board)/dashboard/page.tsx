'use client';

import { GET_USER_PROJECTS } from '@/app/graphql/queries/board.query';
import { IGetUserProjects } from '@/app/graphql/types/interfaces';
import { useAppSelector } from '@/app/state/hooks';
import { useQuery } from '@apollo/client/react';
import { useEffect, useState } from 'react';
import { CreateButton } from '../components/createButton';
import { ProjectCard } from './components/projectCard';

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
        <h2 className="text-xl font-semibold mb-2">Your Projects</h2>
        <CreateButton btnText={'Create Project'} open="project" />
      </div>

      <div className="flex justify-center mt-[2rem]">
        {!(myProjects?.projects ?? []).length && <span>No Projects yet</span>}
      </div>
      <div className="grid grid-cols-2 gap-8 max-w-xxl">
        {(myProjects?.projects ?? []).length > 0 &&
          myProjects?.projects?.map((proj: any) => {
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
