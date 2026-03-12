import { asyncHandler } from "../utils/asyncHandler";
import { apiError } from "../utils/apiError";
import { apiResponse } from "../utils/apiResponse";

const getWalletHistory = asyncHandler(async (c: any) => {
  const userId = c.get("userId");

  if (!userId) {
    throw new apiError(401, "User not authenticated");
  }

  const { results } = await c.env.DB.prepare(
    `
    SELECT wallet_address, created_at
    FROM wallet_history
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 20
  `
  )
    .bind(userId)
    .all();

  return c.json(
    new apiResponse(200, results, "History fetched"),
    200
  );
});

export { getWalletHistory };


// des means short from latest to oldest 20