'use client';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import LeftNav from './components/leftNav';
import ProjectCard from './components/projectCard';
import UserDropdown from './components/userDropdown';
import CreateProjectButton from './components/createProjectButton';
import { useAppSelector } from '../state/hooks';
import { useState } from 'react';

const GET_USER_PROJECTS = gql`
  query GetUserProjects($userId: ID!) {
    getUserProjects(id: $userId) {
      name
      email
      role
      projects {
        id
        name
        key
        description
      }
    }
  }
`;

export interface IGetUserProjects {
  getUserProjects: {
    name: string;
    email: string;
    role: string;
    projects: [];
  };
}

export default function DashboardLayout() {
  const userSelector = useAppSelector((state) => state.user);
  const { data, loading } = useQuery<IGetUserProjects>(GET_USER_PROJECTS, {
    variables: { userId: userSelector?.user?.id },
  });
  const [myProjects, setMyProjects] = useState(data?.getUserProjects ?? null);
  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-8 grid grid-cols-[220px_1fr] gap-8">
      {/* Sidebar */}
      <LeftNav />

      {/* Main content */}
      <section className="flex flex-col gap-8">
        <header className="flex justify-between items-center">
          <div className="text-lg font-semibold">
            <code>&#128075;</code> Welcome back
          </div>
          <div className="flex items-center gap-4">
            <input
              type="search"
              placeholder="Search"
              className="rounded-lg bg-white/5 border border-white/10 px-4 py-1 mr-8 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <UserDropdown />
          </div>
        </header>
        <hr className="border-t border-white/20" />
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
          <CreateProjectButton />

          <div className="grid gap-6 max-w-xl">
            {myProjects?.projects?.map((proj: any) => {
              return (
                <ProjectCard
                  key={proj?.id}
                  title={proj?.name}
                  keyName={proj?.key}
                  tasks={12}
                  members={3}
                />
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
