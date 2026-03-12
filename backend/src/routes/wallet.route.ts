import { Hono } from "hono";
import { walletActivity } from "../controllers/wallet.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getWalletHistory } from "../controllers/history.controller";


const router = new Hono();

router.get("/history", authMiddleware, getWalletHistory);
router.get("/:address", authMiddleware, walletActivity);


export default router;