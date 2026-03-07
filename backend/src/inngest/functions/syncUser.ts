import { inngest } from "../client";

export const syncUser = inngest.createFunction(
  { id: "sync-clerk-user" },
  { event: "clerk/user.created" },
  async ({ event, step }) => {
    const user = event.data;

    await step.run("insert-user", {}, async ({ env }) => {
      await env.DB.prepare(
        `
          INSERT INTO users (id,name,email,profile_image,created_at)
          VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(id) DO NOTHING
        `,
      )
        .bind(
          user.id,
          `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim(),
          user.email ?? null,
          user.image_url ?? null,
          Date.now(),
        )
        .run();
    });
  },
);
