// Vercel serverless entry point for all /api/* routes in production.
//
// The Vercel project uses the Vite framework preset, which deploys only the
// static client build — the custom Express server in server.ts never runs in
// production. That caused every /api/* request (including /api/submit-job) to
// return 404, so submissions silently failed to reach Google Sheets and Lark.
//
// This catch-all function reuses the SAME configured Express app so all routes
// (submit-job, chat, translate, generate-all, etc.) work identically in
// production. The app's listener is skipped on Vercel (see server.ts), and
// Express receives the full original request URL, so its /api/* routes match.
import app from '../server';

export default app;
