# TaskMaster Pro

REST API for task management: Node.js, Express, TypeScript (strict), SQLite, Prisma, Zod, and Jest. Structure follows Clean Architecture (controllers → services → repositories).

## Prerequisites

- Node.js 18+
- npm

## Installation

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:push
```

`db:push` applies the Prisma schema to the SQLite file (see `DATABASE_URL` in `.env`).

## Running the project

**Development (watch mode):**

```bash
npm run dev
```

**Production build:**

```bash
npm run build
npm start
```

Default port is `3000` (override with `PORT` in `.env`).

**Health check:**

```bash
curl http://localhost:3000/health
```

## API usage examples

Base URL: `http://localhost:3000`

Responses use `{ "success": true | false, "data"?: ..., "error"?: { ... } }`.

### Create a task

```bash
curl -s -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Buy milk\",\"description\":\"2%\",\"status\":\"pending\"}"
```

### List all tasks

```bash
curl -s http://localhost:3000/tasks
```

### Filter by status

```bash
curl -s "http://localhost:3000/tasks?status=pending"
curl -s "http://localhost:3000/tasks?status=completed"
```

### Update a task

```bash
curl -s -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Buy oat milk\",\"status\":\"completed\"}"
```

### Delete a task

```bash
curl -s -X DELETE http://localhost:3000/tasks/1
```

## Testing

```bash
npm test
```

Unit tests live in the `tests/` folder (next to `src/`). Service-layer tests use mocked repositories (Jest).

## Prompts used in Cursor

- Master specification: [`taskmaster_prompt_en.md`](./taskmaster_prompt_en.md) (TaskMaster Pro MVP — architecture, stack, endpoints, tests, documentation).

## Project layout

```
src/
 ├── controllers/task.controller.ts
 ├── services/task.service.ts
 ├── repositories/task.repository.ts
 ├── routes/task.routes.ts
 ├── middlewares/error.middleware.ts
 ├── models/task.model.ts
 ├── config/prisma.ts
 ├── errors/app.error.ts
 ├── app.ts
 └── index.ts
```

`index.ts` boots the HTTP server; `app.ts` wires Express, routes, and global error handling.
