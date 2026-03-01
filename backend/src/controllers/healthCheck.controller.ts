import { Context } from "hono";
import { apiError } from "../utils/apiError";
import { apiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const healthCheck = asyncHandler(async (c) => {
  return c.json(new apiResponse(200, "OK", "Health check passed"), 200);
});

const dbCheck = async (c: Context<{ Bindings: { DB: D1Database } }>) => {
  try {
    // 1️⃣ Check DB connectivity
    const ping = await c.env.DB.prepare("SELECT 1 as ok").first();

    if (!ping) {
      throw new apiError(500, "Database not responding");
    }

    // 2️⃣ Optional write test (safe idempotent insert)
    await c.env.DB.prepare(
      `
      INSERT INTO users (id, created_at)
      VALUES (?, ?)
      ON CONFLICT(id) DO NOTHING
    `,
    )
      .bind("healthcheck_user", Date.now())
      .run();

    return c.json(
      new apiResponse(200, { db: "connected" }, "DB check passed"),
      200,
    );
  } catch (error) {
    console.error("DB CHECK ERROR:", error);
    throw new apiError(500, "Database check failed");
  }
};

export { healthCheck, dbCheck };

// res.data.statusCode = 200
// res.data.data = ok
// res.data.message = health check passed
// res.data.success = true
