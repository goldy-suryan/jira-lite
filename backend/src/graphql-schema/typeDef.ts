export const typeDefs = `#graphql
    scalar Date

    type User {
        id: ID!
        name: String
        email: String!
        role: String!
        projects: [Project]
    }

    type Project {
        id: ID!
        name: String!
        key: String!
        description: String
        owner: User
        tasks: [Task]
    }

    enum StatusType {
        TODO
        IN_PROGRESS
        DONE
    }

    enum PriorityType {
        LOW
        MEDIUM
        HIGH
    }

    type Task {
        id: ID!
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
`;
