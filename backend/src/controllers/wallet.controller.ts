import { scanWallet } from "../services/walletScanner.service";
import { apiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { apiError } from "../utils/apiError";
import { fetchWalletTransactions } from "../services/etherscan.service";

//! ETHERSCAN ONE

const walletActivity = asyncHandler(async (c: any) => {
  const wallet = c.req.param("address");

  if (!wallet || wallet.length !== 42) {
    throw new apiError(400, "Invalid wallet address");
  }

  const transactions = await fetchWalletTransactions(c.env, wallet);

  const userId = c.get("userId");
  
  if (!userId) {
    throw new apiError(401, "User not authenticated");
  }

  await c.env.DB.prepare(
    `
    INSERT INTO wallet_history
    (user_id, wallet_address, created_at)
    VALUES (?, ?, ?)
  `,
  )
    .bind(userId, wallet.toLowerCase(), Math.floor(Date.now() / 1000))
    .run();

  return c.json(
    new apiResponse(
      200,
      { wallet, transactions },
      "Wallet transactions fetched",
    ),
    200,
  );
});
export { walletActivity };

//! LAVA ONE
// const walletActivity = asyncHandler(async (c: any) => {
//   // Get wallet address from route

//   const wallet = c.req.param("address");  //what is this adress? it is the wallet address that we want to scan for activity. it is passed as a route parameter in the request, like /api/wallet/:address/activity. we extract it using c.req.param("address").

//   if (!wallet || wallet.length !== 42) {
//     throw new apiError(400, "Invalid wallet address");
//   }

//   const normalizedWallet = wallet.toLowerCase();

//   // Optional user id header

//   const userId = c.req.header("x-user-id") ?? null;

//   // Fetch wallet activity

//   const data = await scanWallet(c.env, normalizedWallet);

//   // Save wallet search history

//   await c.env.DB.prepare(
//     `
//     INSERT INTO wallet_history
//     (user_id, wallet_address, created_at)
//     VALUES (?, ?, ?)
//   `,
//   )
//     .bind(userId, normalizedWallet, Math.floor(Date.now() / 1000))
//     .run();

//   return c.json(new apiResponse(200, data, "Wallet activity fetched"), 200);
// });
