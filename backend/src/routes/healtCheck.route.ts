import { Hono } from "hono";
import { healthCheck } from "../controllers/healthCheck.controller";
import { dbCheck } from "../controllers/healthCheck.controller";

const router = new Hono();

router.get("/healthcheck", healthCheck);

router.get("/dbcheck", dbCheck);


export default router