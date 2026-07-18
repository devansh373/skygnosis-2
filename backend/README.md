# Backend API

Built with **Node.js, Express, TypeScript, and Prisma (PostgreSQL)**.

## How to Run Locally

If you are not using the root Docker Compose setup, you can run the backend manually:

1. Ensure PostgreSQL is running and update your `.env` `DATABASE_URL`.
2. Ensure you have a valid `GROQ_API_KEY` in `.env`.
3. Install and run:
```bash
npm install
npx prisma db push
npm run dev
```

## Testing
We use Node's native test runner to validate API integrations.
```bash
npm run test
```

## Tech Choices
- **Prisma v6:** Used over raw SQL for type-safe queries and rapid schema iteration.
- **Groq AI:** Chosen for blazingly fast inference compared to other LLM APIs, ensuring the user gets a seamless confirmation response instantly.
- **MVC Architecture:** Separation of routes, controllers, and services makes the codebase highly testable and extensible.
