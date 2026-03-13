import { asyncHandler } from "../utils/asyncHandler";
import { apiError } from "../utils/apiError";
import { apiResponse } from "../utils/apiResponse";

// ADD TRACKED WALLET

const addTrackedWallet = asyncHandler(async (c: any) => {
  const wallet = c.req.param("address");
  const userId = c.get("userId");

  if (!wallet || wallet.length !== 42) {
    throw new apiError(400, "Invalid wallet address");
  }

  await c.env.DB.prepare(
    `
  INSERT OR IGNORE INTO tracked_wallets (user_id, wallet_address, created_at)
  VALUES (?, ?, ?)
`,
  )
    .bind(userId, wallet.toLowerCase(), Math.floor(Date.now() / 1000))
    .run();
  return c.json(new apiResponse(200, { wallet }, "Wallet added to tracking"));
});

// GET ALL TRACKED WALLETS

const getTrackedWallets = asyncHandler(async (c: any) => {
  const userId = c.get("userId");

  const { results } = await c.env.DB.prepare(
    `
    SELECT wallet_address, created_at
    FROM tracked_wallets
    WHERE user_id = ?
    ORDER BY created_at DESC
  `,
  )
    .bind(userId)
    .all();

  return c.json(new apiResponse(200, results, "Tracked wallets fetched"));
});

// DELETE WALLET

const deleteTrackedWallet = asyncHandler(async (c: any) => {
  const wallet = c.req.param("address");
  const userId = c.get("userId");

  await c.env.DB.prepare(
    `
    DELETE FROM tracked_wallets
    WHERE user_id = ? AND wallet_address = ?
  `,
  )
    .bind(userId, wallet.toLowerCase())
    .run();

  return c.json(new apiResponse(200, null, "Wallet removed from tracking"));
});

export { addTrackedWallet, getTrackedWallets, deleteTrackedWallet };
