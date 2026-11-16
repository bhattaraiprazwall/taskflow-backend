
# TaskFlow Backend - Project Instructions

## Project Overview
TaskFlow is a personal task management application.
The backend provides REST APIs consumed by a Flutter mobile application.

## Technology Stack
- Node.js
- TypeScript
- Express 5
- PostgreSQL
- Prisma ORM 7
- Zod for validation
- JWT for authentication
- Argon2id for password hashing
- pnpm as package manager

## Architecture
Use feature-based modular architecture.

Organize backend modules into:
- Routes
- Controllers
- Services
- Repositories
- Validation schemas

Responsibilities:
- Routes define API endpoints.
- Controllers handle HTTP requests and responses.
- Services contain business logic.
- Repositories handle database operations.
- Middleware handles authentication and request validation.

## Coding Rules
1. Use TypeScript strictly.
2. Use ES Modules.
3. Use async/await.
4. Avoid unnecessary abstractions.
5. Keep functions small and understandable.
6. Do not put database queries inside controllers.
7. Validate incoming request data using Zod.
8. Use consistent API response structures.
9. Handle errors centrally.
10. Add comments when a concept is not obvious.

## Database Rules
1. Use Prisma ORM 7.
2. Use PostgreSQL.
3. Use Prisma migrations.
4. Never expose password hashes or authentication tokens.
5. Never trust a userId supplied by the client.
6. Always scope user-owned records to the authenticated user.

## Security Rules
1. Never store plain-text passwords.
2. Use Argon2id for password hashing.
3. Never commit .env files.
4. Never print or expose .env secret values.
5. Never return sensitive internal errors to clients.
6. Validate all user input.

## AI Agent Workflow
1. Implement only the feature or milestone requested.
2. Do not build the entire application in one operation.
3. Explain the purpose of every newly created file.
4. Explain important architectural decisions.
5. Run TypeScript checks after implementing changes.
6. Fix errors introduced by your changes.
7. Do not silently change the technology stack.
8. Do not upgrade major dependency versions without approval.
9. Do not implement future features unless requested.
10. Ask for approval before destructive database operations.
