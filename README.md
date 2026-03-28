# Jira Lite 🚀
#### Node.js | GraphQL | PostgreSQL | Redis | Next.js | AWS (EC2 + S3 + CloudFront)

A lightweight Jira-inspired project management tool built with a modern **Next.js + GraphQL + Node.js + PostgreSQL** stack.
It supports **real-time collaboration, task management, activity tracking, and team-based project workflows.**
Includes **AI-powered** task creation using **LLMs** for natural language input.

This project was built as a **full-stack system design practice**, focusing on scalable architecture, real-time communication, and production-ready backend patterns.

---
## 🌐 Live Demo

🔗 **Frontend**: https://jira-lite-six.vercel.app

---

## ✨ Features

### Project Management

* Create and manage projects
* Invite members to projects
* Accept / decline invitations
* Project-based access control

### Task Management

* Create tasks with title, description, priority and due date
* Assign tasks to project members
* Drag & drop tasks across columns (Kanban board)
* Automatic task positioning algorithm

### AI-Powered Task Creation

* Create tasks using natural language input
* Extracts structured data:
  - title
  - description
  - priority
  - status
  - due date
* Supports relative dates (e.g., "tomorrow", "next Monday")
* Intelligent defaults (status = TODO, due date fallback)
* Handles messy real-world inputs
* Strict rules to prevent invalid or hallucinated data
* Graceful handling of non-task input

### Real-Time Collaboration

* Real-time task comments using **GraphQL Subscriptions**
* Real-time updates for multiple users

### Activity Feed

* Automatic activity logging for:

  * Task creation
  * Task updates
  * Status changes
  * Assignment changes

### Task Filtering & Search

* Filter tasks by:
  * Keyword
  * Status
  * Priority
  * Members
  * Overdue tasks
* Backend-driven filtering for performance
* Near real-time filtering experience

### Attachments (S3 + CloudFront)

* File attachments for tasks
* Secure upload using signed URLs
* Fast delivery via CloudFront CDN

### Authentication

* JWT-based authentication
* API rate limiting (planned)
* Secure login system
* Centralized error handling
* Secure file uploads using signed URLs

---

## 🖼 Screenshots

### Kanban Board

![Kanban Board](screenshots/board.png)

### Task Detail with Comments tab

![Task Detail](screenshots/task-detail.png)

### Activity Feed

![Activity](screenshots/activity.png)

---

## 🏗 Architecture

```
Frontend (Next.js + Apollo Client)
        │
        │ GraphQL
        ▼
Backend (Node.js + Express + Apollo Server)
        │
        ├── PostgreSQL (Sequelize ORM)
        │
        ├── Redis Pub/Sub
        │      └── GraphQL Subscriptions
        │
        └── AWS S3 (File Uploads)
```

---
## 🚀 Deployment Architecture

Frontend is deployed on Vercel while the backend runs on an AWS EC2 instance.

File uploads are stored in AWS S3 and served via CloudFront CDN for faster delivery.

#### Architecture:
```
Client (Browser)
     │
     ▼
Next.js (Vercel)
     │
     │ API Proxy
     ▼
Node.js Backend (AWS EC2)
     │
     ├── AI Service (Groq / LLM Integration)
     │      └── Natural language → structured task parsing
     ├── PostgreSQL
     ├── Redis
     └── AWS S3 (File Storage)
```

---
## API Proxy Layer

To avoid cross-site cookie restrictions between the frontend and backend domains,
a proxy layer is implemented using Next.js route handlers.

Client requests are sent to `/api/proxy/*` which forwards them to the backend API.

Benefits:

• Same-origin requests for authentication cookies  
• Cleaner API communication  
• Improved security for session-based authentication

---

## 🧩 System Design

This project was designed to mimic real-world project management tools like Jira while keeping the architecture modular and scalable.

### High Level Architecture

Frontend communicates with the backend using GraphQL. The backend manages business logic through service layers and interacts with PostgreSQL using Sequelize ORM.

Real-time communication is implemented using GraphQL subscriptions backed by **Redis Pub/Sub** (used as a distributed event bus for GraphQL subscriptions).

File uploads are handled via AWS S3 using signed URLs to avoid routing large files through the backend server.

```
Client (Next.js)
      │
      │ GraphQL
      ▼
Apollo Server (Node.js + Express)
      │
      ├── PostgreSQL
      │       └── relational data (projects, tasks, activities)
      │
      ├── Redis
      │       └── pub/sub for GraphQL subscriptions
      │
      └── AWS S3
              └── file storage
```

---

## Database Design

The system uses relational modeling with junction tables to manage many-to-many relationships.

Example:

Users ↔ Projects (Many-to-Many)

```
users
projects
user_project_junction
```

Tasks belong to a project and may be assigned to a user.

```
projects
   │
   └── tasks
           │
           ├── comments
           └── activities
```

---

## Real-Time Communication

Real-time updates for comments are implemented using GraphQL subscriptions.

To allow scalability across multiple server instances, Redis Pub/Sub is used as the event transport layer.

```
Client A comment
        │
        ▼
GraphQL Mutation
        │
        ▼
Redis Pub/Sub
        │
        ▼
GraphQL Subscription
        │
        ▼
Client B receives comment instantly
```

---
### Notifications

* Real-time notifications for:
  - Task assignment
  - Comments

* Click-to-mark-as-read functionality
* Unread notification indicator

### Notification Flow
```
User Action (e.g., comment / assign)
        │
        ▼
Backend Event Trigger
        │
        ▼
Database (store notification)
        │
        ▼
Redis Pub/Sub
        │
        ▼
GraphQL Subscription
        │
        ▼
Client receives notification instantly
        │
        ▼
User clicks → mark as read (mutation)
```

---

## Task Positioning Strategy

Tasks are ordered using a **fractional indexing approach** to avoid reordering the entire list during drag-and-drop operations.

Example:

```
TODO column

Task A  → position 10000
Task B  → position 20000
Task C  → position 30000
```

When a new task is inserted between A and B:

```
New Task → position 15000
```

This approach significantly reduces database writes during drag-and-drop operations.

---

## Error Handling Strategy

Error handling is centralized using GraphQL error formatting.

Frontend interceptors display user-friendly error notifications, while backend services throw domain-specific errors.

This keeps the service layer clean while maintaining consistent error responses across the application.

---

## Scalability Considerations

The system is designed with scalability in mind:

• Stateless backend architecture
• Redis-based pub/sub for horizontal scaling
• Direct S3 uploads using signed URLs
• Service layer abstraction for maintainability

These patterns allow the application to scale to multiple backend instances behind a load balancer.


---
## ⚡ Performance Optimizations

• Fractional indexing to minimize database writes during drag-and-drop  
• Redis-based pub/sub to support horizontal scaling of real-time features  
• Direct S3 uploads using signed URLs to reduce backend load  
• Service layer architecture to isolate business logic from GraphQL resolvers

---

## 🧠 Technical Highlights

### GraphQL Architecture

* Modular resolver structure
* Service layer abstraction
* Centralized error handling

### Database Design

* PostgreSQL relational schema
* Junction tables for many-to-many relations
* Activity logging system

### Real-Time System

* GraphQL subscriptions using Redis Pub/Sub
* Multi-instance scalable architecture

### Drag & Drop Optimization

* Fractional indexing strategy for task positions
* Avoids full list reordering

### AI Integration

* Prompt-engineered task extraction
* Controlled output schema (no hallucination)

---

## 🛠 Tech Stack

Frontend

* Next.js
* React
* Apollo Client
* TailwindCSS
* Redux-toolkit

Backend

* Node.js
* Express
* Apollo Server (GraphQL)

Database

* PostgreSQL
* Sequelize ORM

Real-Time

* Redis
* GraphQL Subscriptions

Storage

* AWS S3 (signed URL uploads)

---

## 📂 Project Structure

```
backend
└── src
    ├── config
    │   ├── email.config.ts
    │   ├── pubSub.config.ts
    │   ├── sequelize.init.ts
    │   └── webSocket.config.ts
    ├── graphql-schema
    │   ├── resolvers
    │   ├── rootMutation.ts
    │   ├── rootQuery.ts
    │   ├── rootSubscription.ts
    │   ├── schema.ts
    │   └── typeDef.ts
    ├── models
    │   ├── index.ts
    │   └── userProject.model.ts
    ├── modules
    │   ├── activity
    │   │   ├── activity.controller.ts
    │   │   ├── activity.model.ts
    │   │   └── activity.service.ts
    │   ├── comment
    │   ├── invitation
    │   ├── project
    │   ├── task
    |   ├── ai 
    │   └── user
    ├── services
    ├── utils
    ├── app.ts
    ├── server.ts
    ├── access.log

frontend
├── app
│   ├── (auth)
│   │   ├── components
│   │   ├── login
│   │   └── register
│   ├── (board)
│   │   ├── components
│   │   ├── dashboard
│   │   ├── projects
│   │   │   ├── [projectId]
│   │   │   │   └── page.tsx
│   │   │   └── components
│   │   │       └── page.tsx
│   │   └── tasks
|   |   ├── layout.tsx
│   ├── graphql
│   ├── mutations
│   ├── queries
│   ├── subscriptions
│   └── types
|   ├── invite
|   ├── lib
|   │   ├── apollo-client.ts
|   ├── settings
|   ├── state
|   │   ├── features
|   |   │   ├── hooks.ts
|   |   │   └── store.ts
|   ├── utils
|   ├── globals.css
|   ├── layout.tsx
|   ├── page.tsx
|   ├── storeProvider.tsx
|   ├── proxy.ts

```

---

## ⚙️ Installation

#### Clone the repository

```
git clone https://github.com/goldy-suryan/jira-lite.git
```

#### Install dependencies

```
cd backend
npm install

cd ../frontend
npm install
```
#### Create environment variables:
backend/.env
```
PORT=
JWT_SECRET=
SEQUEL_USERNAME=
SEQUEL_DATABASE=
SEQUEL_PASSWORD=
MAIL_USER=
MAIL_PASS=
FRONTEND_URL=
AWS_REGION=
BUCKET_NAME=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
GROK_API_KEY=
```

frontend/.env
```
NEXT_PUBLIC_GRAPHQL_URL=
NEXT_PUBLIC_WS_URL=
NEXT_PUBLIC_CLOUDFRONT_URL=
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_BASE_URL=
```
---

#### Start Redis

This project uses Redis for GraphQL subscriptions.

If Redis is installed locally:
```
redis-server
```

#### Start backend server

```
npm run dev_server
```

#### Start frontend

```
npm run dev
```

---

## 🔮 Upcoming Improvements

* AI-powered task suggestions & auto-complete
* Multi-task extraction from single input
* Role-based access controls (Admin / Member / Viewer)
* Activity filtering
* Full-text search for tasks
* WebSocket-based presence indicators

---

## 🎯 Learning Goals

This project focuses on:

* GraphQL architecture and resolver design
* Real-time communication using Redis Pub/Sub and subscriptions
* Scalable backend design with stateless services
* Relational database modeling with PostgreSQL
* Production-grade patterns (service layer, error handling, API proxy)

### AI Integration & Prompt Engineering

* Structured prompt design for task extraction
* Converting natural language into validated structured data
* Handling ambiguous and messy real-world inputs
* Schema-based validation to prevent hallucinated or invalid AI output
* Intelligent defaults and fallback handling

### Performance & Optimization

* Fractional indexing for efficient drag-and-drop ordering
* Backend-driven filtering for scalability
* Redis as an event bus for real-time updates

### System Design Thinking

* Trade-offs between frontend vs backend filtering
* Designing for horizontal scalability
* Decoupling real-time systems using Redis

---

## 👨‍💻 Author

Goldy Suryan
Senior Software Developer (MERN / MEAN)

GitHub: https://github.com/goldy-suryan
