import { inngest } from "../client";

type Env = {
  DB: D1Database;
};

export const syncUser = inngest.createFunction(
  { id: "sync-clerk-user" },
  { event: "clerk/user.created" },
  async ({ event, step }: any) => {
    const user = event.data;

    await step.run("insert-user-db", async ({ env }: { env: Env }) => {
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
          Math.floor(Date.now() / 1000),
        )
        .run();
    });
  },
);
