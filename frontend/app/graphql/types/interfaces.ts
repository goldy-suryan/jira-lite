export interface IGetUserProjects {
  getUserProjects: {
    name: string;
    email: string;
    role: string;
    projects: [];
  };
}

export type Task = {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string;
  position?: number;
};
