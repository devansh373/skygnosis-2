# Skygnosis AI Support Ticket Triage (Monorepo)

This repository contains both the **Frontend** (Next.js) and **Backend** (Node.js/Express) for the AI Support Ticket Triage system. It is structured as a clear monorepo, with everything fully dockerized for easy execution.

## 🚀 How to Run (End-to-End)

The entire stack (Frontend, Backend, and PostgreSQL Database) is orchestrated via Docker Compose.

1. Create a `.env` file inside the `backend` folder and add your free Groq API key:
   ```env
   GROQ_API_KEY="your-groq-api-key"
   ```
2. From the root directory, start the stack:
   ```bash
   docker-compose up --build
   ```
3. Open your browser:
   - **Public Portal:** `http://localhost:3000`
   - **Admin Dashboard:** `http://localhost:3000/admin/login` (Username: `admin`, Password: `password123`)

## 🏗️ Tech Choices & Why
- **Frontend:** **Next.js (App Router) + Tailwind CSS v4**. Next.js provides excellent routing and performance. Tailwind enabled me to rapidly build a premium, glassmorphism UI with custom animations without maintaining sprawling CSS files.
- **Backend:** **Node.js, Express & TypeScript**. Express is lightweight and perfect for a REST API. TypeScript ensures type safety across the MVC layers.
- **Database:** **PostgreSQL + Prisma ORM**. PostgreSQL is robust for relational data (tickets), and Prisma provides incredible developer experience with zero-hassle migrations and type-safe queries.
- **AI:** **Groq (Llama 3.1 8B)**. Groq provides lightning-fast inference, which is critical for a synchronous ticket submission flow where the user is waiting for confirmation.
- **Bonus Implementations:** 
  - **Tests:** Implemented Jest/Supertest for backend endpoint validation.
  - **Strong Auth:** Implemented JWT with bcrypt password hashing.

## ⚖️ Trade-offs Made
Due to the 48-hour deadline, I made the calculated trade-off to store the Admin JWT inside `localStorage`. While this allowed me to rapidly build the admin portal, in a true production environment, I would securely set the JWT in an `HttpOnly`, `Secure` cookie to mitigate XSS vulnerabilities. 

## 🔮 Future Improvements
With more time, I would:
1. **Implement WebSockets (Socket.io):** Push new tickets to the Admin Dashboard in real-time so agents don't have to manually refresh.
2. **AI Semantic Search:** Embed the tickets into a vector database (like Pinecone) to allow admins to search for "tickets similar to this one."
3. **Advanced Rate Limiting:** Add Redis-backed rate limiting to the public ticket submission endpoint to prevent abuse of the AI API.

---

### Folder Structure
- `/frontend` - Next.js React application
- `/backend` - Node/Express API and Prisma schema
- `docker-compose.yml` - Orchestrates the DB, Backend, and Frontend
