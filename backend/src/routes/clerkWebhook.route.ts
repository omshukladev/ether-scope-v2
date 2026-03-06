import { Hono } from "hono";
import { Webhook } from "svix";
import { createInngest } from "../inngest/client";

type Bindings = {
  DB: D1Database;
  CLERK_WEBHOOK_SECRET: string;
  INNGEST_EVENT_KEY: string;
};

const router = new Hono<{ Bindings: Bindings }>();

router.post("/clerk", async (c) => {

  const body = await c.req.text();
  const headers = Object.fromEntries(c.req.raw.headers);

  const secret = c.env.CLERK_WEBHOOK_SECRET;
  const wh = new Webhook(secret);

  let event: any;

  try {
    event = wh.verify(body, headers);
  } catch {
    return c.json({ error: "Invalid signature" }, 400);
  }
 

  if (event.type === "user.created") {

    const user = event.data;

    // Create Inngest client using Cloudflare env
    const inngest = createInngest(c.env.INNGEST_EVENT_KEY);

    await inngest.send({
      name: "clerk/user.created",
      data: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email_addresses?.[0]?.email_address,
        image_url: user.image_url,
      },
    });

  }

  return c.json({ success: true });

});

export default router;