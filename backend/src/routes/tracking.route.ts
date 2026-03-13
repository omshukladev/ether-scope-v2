import { Hono } from "hono";
import { authMiddleware } from "../middlewares/auth.middleware";

import {
  addTrackedWallet,
  getTrackedWallets,
  deleteTrackedWallet
} from "../controllers/tracking.controller";

const router = new Hono();

/* Add wallet to tracking */
router.post("/:address", authMiddleware, addTrackedWallet);

/* Get all tracked wallets */
router.get("/", authMiddleware, getTrackedWallets);

/* Delete wallet */
router.delete("/:address", authMiddleware, deleteTrackedWallet);

export default router;