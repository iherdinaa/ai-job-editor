// Vercel serverless entry point for all /api/* routes in production.
//
// The Vercel project uses the Vite framework preset, which deploys only the
// static client build — the custom Express server in server.ts never runs in
// production. That caused every /api/* request (including /api/submit-job) to
// return 404, so submissions silently failed to reach Google Sheets and Lark.
//
// This catch-all function reuses the SAME configured Express app so all routes
// (submit-job, chat, translate, generate-all, etc.) behave identically in
// production. The app's listener is skipped on Vercel (see server.ts).
//
// Import notes: use a dynamic import with the explicit ".js" extension. Vercel's
// file tracer emits the compiled server as ".../server.js", and Node's ESM loader
// rejects an extensionless specifier ("../server" -> ERR_MODULE_NOT_FOUND). The
// try/catch surfaces any load/runtime error instead of an opaque platform 500.
import type { IncomingMessage, ServerResponse } from 'http';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const mod: any = await import('../server.js').catch(() => import('../server'));
    const app = (mod.default ?? mod) as (req: IncomingMessage, res: ServerResponse) => void;
    return app(req, res);
  } catch (err) {
    console.error('[api handler] failed to handle request:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: 'API handler failed',
        message: err instanceof Error ? err.message : String(err),
      })
    );
  }
}
