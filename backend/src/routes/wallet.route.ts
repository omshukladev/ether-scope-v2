import { Hono } from "hono";
import { walletActivity } from "../controllers/wallet.controller";

const router = new Hono();

router.get("/:address",walletActivity);

export default router;