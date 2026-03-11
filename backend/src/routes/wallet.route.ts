import { Hono } from "hono";
import { walletActivity } from "../controllers/wallet.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = new Hono();

router.get("/:address", authMiddleware, walletActivity);

export default router;