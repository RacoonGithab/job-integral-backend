# job-integral-backend

## Overview

`job-integral-backend` is a backend service implementing a full-featured real-time chat system, user profile management, task management, post moderation, and content management. It uses PostgreSQL and MongoDB for data storage, Firebase for file management, and supports robust authentication and authorization.

## Features

- **Authentication & Authorization:**  
  Users can securely log in and change passwords. Custom logic using a hybrid approach with JWT and session management.

- **Databases:**
    - PostgreSQL: primary relational database.
    - MongoDB: stores chat data including messages and group chats.

- **Chat System:**  
  Real-time messaging with support for direct user chats and group chats via WebSocket.

- **Posts:**  
  Administrators can create, update, and delete posts. Regular users can read and browse posts.

- **Task Management:**  
  Admins create tasks for workers. Workers can update the status of assigned tasks.

- **User Profiles:**  
  Users can manage personal profile information and upload profile photos.

- **File Management:**  
  Files are stored and managed using Firebase Storage, including upload and deletion.

## Project Structure

- **src/modules/** – Core feature modules such as chat, user-profile, post, and task.
- **src/utils/** – Utility functions including file handling and validation.
- **src/middlewares/** – Express middlewares for authorization, validation, and file handling.
- **prisma/schema.prisma** – Prisma schema for PostgreSQL models.

## Development & Scripts

- `npm run dev` — Start the server with live reload using nodemon.
- `npm run build` — Compile TypeScript into JavaScript.
- `npm run start` — Run the compiled server build.
- `npm run db:seed` — Seed the database with initial data.
- `npm run db:seed-messages` — Seed MongoDB with chat messages for testing.
- `npm run generate-hash` — Utility to generate password hashes for testing.

## Dependencies

- Express, Socket.io — server and real-time messaging.
- Prisma ORM — PostgreSQL database.
- Mongoose — MongoDB database.
- Firebase Admin SDK — file storage management.
- Zod — schema validation.
- JWT and bcryptjs — authentication and security.

## Getting Started

1. Set up your environment variables for database connections, Firebase, and JWT secrets.
2. Apply database migrations with Prisma:
   ```bash
   npx prisma migrate dev