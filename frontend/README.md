# Frontend Application

Built with **Next.js 16 (App Router)** and **Tailwind CSS v4**.

## How to Run Locally

If you don't want to use the global Docker Compose setup, you can run the frontend in development mode with live-reloading:

```bash
npm install
npm run dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000).

## Trade-offs
For the admin portal, the JWT is stored in `localStorage` for rapid development. In a real-world scenario, this should be mitigated against XSS by storing it in an `HttpOnly` cookie.
