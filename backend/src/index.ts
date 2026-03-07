import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "inngest/cloudflare";

import { errorHandler } from "./utils/errorHandler";
import { inngest } from "./inngest/client";
import { functions } from "./inngest/functions";

import clerkWebhookRoute from "./routes/clerkWebhook.route";
import healthCheckRoute from "./routes/healtCheck.route";

type Bindings = {
  DB: D1Database;
  INNGEST_EVENT_KEY: string;
  INNGEST_SIGNING_KEY: string;
  CLERK_WEBHOOK_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

/* ---------------- CORS ---------------- */

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Headers",
    ],
  }),
);

/* ---------------- INNGEST ENDPOINT ---------------- */

app.all("/api/inngest", (c) => {
  const handler = serve({
    client: inngest,
    functions,
    signingKey: c.env.INNGEST_SIGNING_KEY,
  });

  return handler({
    request: c.req.raw,
    env: c.env,
  } as any);
});

/* ---------------- WEBHOOK ROUTES ---------------- */

app.route("/api/webhooks", clerkWebhookRoute);

/* ---------------- HEALTH CHECK ---------------- */

app.route("/api", healthCheckRoute);

/* ---------------- TEST ROUTE ---------------- */

app.get("/message", (c) => {
  return c.text("Hello Hono!");
});

/* ---------------- ERROR HANDLER ---------------- */

app.onError(errorHandler);

export default app;
