import { inngest } from "../client";

type Env = {
  DB: D1Database;
};

export const syncUser = inngest.createFunction(
  { id: "sync-clerk-user" },
  { event: "clerk/user.created" },
  async (ctx: any) => {
    console.log("Context keys:", Object.keys(ctx));
    console.log("Has runEnv:", "runEnv" in ctx);
    console.log("Has ctx:", "ctx" in ctx);

    const { event, step } = ctx;
    const user = event.data;
    const env = (ctx.runEnv || ctx.ctx?.env || ctx.env) as Env;

    console.log("env available:", !!env);

    await step.run("insert-user-db", async () => {
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
