export const RootMutation = `#graphql
    input createProjectInput {
        name: String!
        key: String!
        description: String
    }

    input taskInput {
        title: String!
        description: String
        status: StatusType!
        priority: PriorityType!
        projectId: ID!
        createdBy: ID!
        assigneeId: ID
        dueDate: Date
        position: Int!
    }

    type Mutation {
        createProject(input: createProjectInput!): Project!
        createTask(input: taskInput!): Task!
    }
`;
