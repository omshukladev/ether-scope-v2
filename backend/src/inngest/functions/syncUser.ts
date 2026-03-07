import { inngest } from "../client";

type Env = {
  DB: D1Database;
};

export const syncUser = inngest.createFunction(
  { id: "sync-clerk-user" },
  { event: "clerk/user.created" },
  async ({ event, step }: any) => {
    const user = event.data;

    await step.run("log-user-created", async () => {
      console.log("User created event processed:", {
        id: user.id,
        name: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim(),
        email: user.email,
      });

      // Note: Database insert happens directly in the webhook handler
      // This function is just for logging/observability via Inngest

      return { success: true, userId: user.id };
    });
  },
);
