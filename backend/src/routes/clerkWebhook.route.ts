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
  try {
    const payload = await c.req.text();

    const headers = {
      "svix-id": c.req.header("svix-id")!,
      "svix-timestamp": c.req.header("svix-timestamp")!,
      "svix-signature": c.req.header("svix-signature")!,
    };

    const wh = new Webhook(c.env.CLERK_WEBHOOK_SECRET);

    const event = wh.verify(payload, headers) as any;

    console.log("Webhook event:", event.type);

    if (event.type === "user.created") {
      const user = event.data;

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

  } catch (err) {
    console.error("Webhook error:", err);
    return c.json({ success: false, message: "Internal Server Error" }, 500);
  }
});

export default router;