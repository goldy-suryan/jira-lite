export const typeDefs = `#graphql
    scalar Date
    scalar JSON

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
        users: [User]
        createdAt: Date
    }

    enum StatusType {
        TODO
        IN_PROGRESS
        DONE
        IN_REVIEW
        READY_FOR_REVIEW
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
        position: Float!
        createdAt: String
        assignee: User
        reporter: User
        project: Project
        activities: [Activity]!
        attachments: [Attachment]
        comments: [Comment]
        attachmentsCount: Int!
        commentsCount: Int!
    }

    enum InvitationStatus {
        PENDING
        ACCEPTED
        DECLINED
    }

    type Invitation {
        email: String
        status: InvitationStatus
        projectId: ID
        project: Project
        invitedByUser: User
    }

    type Comment {
        id: ID!
        taskId: ID!
        message: String!
        user: User!
        createdAt: Date!
    }

    type Activity {
        id: ID!
        taskId: ID!
        action: String!
    }

    type SignedUrl {
        url: String!
    }

    type Attachment {
        id: ID!
        fileName: String!
        fileUrl: String!
    }

    type Notification {
        id: ID!
        user: User!
        type: String!
        title: String!
        message: String!
        isRead: Boolean!
        metadata: JSON
        createdAt: Date!
    }

    input FiltersInput {
        searchTerm: String
        due: Date
        member: [ID]
        priority: [String]
        status: [String]
    }
`;
