import { Hono } from "hono";
import { errorHandler } from "./utils/errorHandler";

// Define your Cloudflare Workers KV namespace bindings here
type Bindings = {
  DB: D1Database;
  INNGEST_EVENT_KEY: string;
  INNGEST_SIGNING_KEY: string;
  CLERK_WEBHOOK_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

//Middlewares
import { cors } from "hono/cors";
import { serve } from "inngest/cloudflare";
import { Inngest } from "inngest";
import { inngest } from "./inngest/client";

import { functions } from "./inngest/functions";
import clerkWebhookRoute from "./routes/clerkWebhook.route";

const handler = serve({
  client: inngest,
  functions,
  signingKey: c.env.INNGEST_SIGNING_KEY,
});

app.all("/api/inngest", (c) => {
  return handler(c.req.raw, c.env);
});
app.route("/api/webhooks", clerkWebhookRoute);
app.use(
  "*",
  cors({
    origin: "*", // allow all for now (dev)
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Headers",
    ],
  }),
);

app.get("/message", (c) => {
  return c.text("Hello Hono!");
});

// Import routes
import healthCheckRoute from "./routes/healtCheck.route";

// Use routes
app.route("/api", healthCheckRoute);

//! Global error handler
app.onError(errorHandler);

export default app;
