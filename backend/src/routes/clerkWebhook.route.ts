import { Hono } from "hono";
import { Webhook } from "svix";
import { inngest } from "../inngest/client";

const router = new Hono();

router.post("/clerk", async (c: any) => {
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
          (e: any) => e.id === user.primary_email_address_id
        )?.email_address ?? user.email_addresses?.[0]?.email_address;

      console.log("Sending event to Inngest");

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
    }

    return c.json({ success: true });

  } catch (err) {
    console.error("Webhook error:", err);

    return c.json(
      {
        success: false,
        message: "Webhook crashed",
      },
      500
    );
  }
});

export default router;