export const RootQuery = `#graphql
    type Query {
        getAllUsers: [User!]!
        getProjects: [Project]!
        getProjectByName(name: String!): Project!
        getProjectById(id: ID!): Project!
        getTaskDetail(id: ID!): Task!
        getUserProjects(id: ID!): User
        getProjectUsers(projectId: ID!): Project!
        getInvitation(token: String): Invitation
        getAllTaskComments(taskId: ID!): [Comment]
        getAllTaskActivity(taskId: ID!): [Activity]
    }
`;
