import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "inngest/cloudflare";

import { errorHandler } from "./utils/errorHandler";
import { createInngest } from "./inngest/client";
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



app.all("/api/inngest", (c) => {

  const inngest = createInngest(c.env.INNGEST_EVENT_KEY);

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



app.route("/api/webhooks", clerkWebhookRoute);



app.route("/api", healthCheckRoute);



app.get("/message", (c) => {
  return c.text("Hello Hono!");
});


app.onError(errorHandler);

export default app;