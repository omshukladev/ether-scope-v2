import { Hono } from "hono";
import { Webhook } from "svix";
import { createInngest } from "../inngest/client";

type Bindings = {
  DB: D1Database;
  CLERK_WEBHOOK_SECRET: string;
  INNGEST_EVENT_KEY: string;
};

const router = new Hono<{ Bindings: Bindings }>();

type ClerkEmailAddress = {
  id: string;
  email_address: string;
};

type ClerkUserCreatedData = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  image_url?: string | null;
  primary_email_address_id?: string | null;
  email_addresses?: ClerkEmailAddress[];
};

type ClerkWebhookEvent = {
  type: string;
  data: ClerkUserCreatedData;
};

router.post("/clerk", async (c) => {
  const payload = await c.req.text();

  const svixId = c.req.header("svix-id");
  const svixTimestamp = c.req.header("svix-timestamp");
  const svixSignature = c.req.header("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return c.json(
      {
        success: false,
        message: "Missing Svix headers",
      },
      400,
    );
  }

  if (!c.env.CLERK_WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET is not configured");
    return c.json(
      {
        success: false,
        message: "Webhook secret is not configured",
      },
      500,
    );
  }

  let event: ClerkWebhookEvent;

  try {
    const wh = new Webhook(c.env.CLERK_WEBHOOK_SECRET);
    event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    console.error("Invalid Clerk webhook signature:", err);
    return c.json(
      {
        success: false,
        message: "Invalid webhook signature",
      },
      400,
    );
  }

  console.log("Webhook event:", event.type);

  if (event.type === "user.created") {
    const user = event.data;
    const primaryEmail =
      user.email_addresses?.find(
        (emailAddress) => emailAddress.id === user.primary_email_address_id,
      )?.email_address ?? user.email_addresses?.[0]?.email_address;

    if (!c.env.INNGEST_EVENT_KEY) {
      console.warn("INNGEST_EVENT_KEY is not configured, skipping user sync");
      return c.json({
        success: true,
        message:
          "Webhook verified. User sync skipped due to missing INNGEST_EVENT_KEY.",
      });
    }

    try {
      const inngest = createInngest(c.env.INNGEST_EVENT_KEY);

      await inngest.send({
        name: "clerk/user.created",
        data: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: primaryEmail,
          image_url: user.image_url,
        },
      });
    } catch (err) {
      console.error("Failed to dispatch user.created to Inngest:", err);
      return c.json({
        success: true,
        message: "Webhook verified, but user sync dispatch failed.",
      });
    }
  }

  return c.json({ success: true });
});

export default router;
