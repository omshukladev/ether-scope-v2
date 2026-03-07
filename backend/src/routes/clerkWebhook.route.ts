import { Hono } from "hono";
import { Webhook } from "svix";
import { createEventClient } from "../inngest/client";

type Bindings = {
  DB: D1Database;
  CLERK_WEBHOOK_SECRET: string;
  INNGEST_EVENT_KEY: string;
};

const router = new Hono<{ Bindings: Bindings }>();

router.post("/clerk", async (c) => {
  try {
    const payload = await c.req.text();

    const svixId = c.req.header("svix-id");
    const svixTimestamp = c.req.header("svix-timestamp");
    const svixSignature = c.req.header("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return c.json({ success: false, message: "Missing Svix headers" }, 400);
    }

    const wh = new Webhook(c.env.CLERK_WEBHOOK_SECRET);

    const event: any = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });

    console.log("Webhook event:", event.type);

    if (event.type === "user.created") {
      const user = event.data;

      const primaryEmail =
        user.email_addresses?.find(
          (e: any) => e.id === user.primary_email_address_id,
        )?.email_address ?? user.email_addresses?.[0]?.email_address;

      // Insert user directly into DB
      console.log("Inserting user into database...");

      try {
        await c.env.DB.prepare(
          `
          INSERT INTO users (id, name, email, profile_image, created_at)
          VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(id) DO NOTHING
        `,
        )
          .bind(
            user.id,
            `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || null,
            primaryEmail ?? null,
            user.image_url ?? null,
            Math.floor(Date.now() / 1000),
          )
          .run();

        console.log("User inserted successfully");
      } catch (dbError) {
        console.error("Database insert failed:", dbError);
        // Continue to send event to Inngest even if DB fails
      }

      // Send event to Inngest for logging/observability
      if (c.env.INNGEST_EVENT_KEY) {
        try {
          console.log("Sending event to Inngest...");

          const inngest = createEventClient(c.env.INNGEST_EVENT_KEY);

          await inngest.send({
            name: "clerk/user.created",
            data: {
              id: user.id,
              first_name: user.first_name ?? null,
              last_name: user.last_name ?? null,
              email: primaryEmail ?? null,
              image_url: user.image_url ?? null,
            },
          });

          console.log("Event sent successfully");
        } catch (inngestError) {
          console.error("Inngest send failed:", inngestError);
          // Don't fail the webhook if Inngest fails
        }
      }
    }

    return c.json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err);

    return c.json(
      {
        success: false,
        message: "Webhook crashed",
      },
      500,
    );
  }
});

export default router;
