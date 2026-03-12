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
        position: Float!
    }

    input taskStatusPositionInput {
        status: StatusType!
        position: Float!
    }

    type Mutation {
        createProject(input: createProjectInput): Project!
        createTask(input: taskInput): Task!
        updateTask(id: ID!, input: taskInput): Boolean!
        deleteTask(taskId: ID!): Boolean!
        updateTaskStatusPosition(id: ID!, input: taskStatusPositionInput): Boolean!
        sendProjectInvitation(projectId: ID!, email: String!): Boolean!
        invitationResponse(userId: ID!, token: String!, status: String): Boolean!
    }
`;
