import { Hono } from "hono";
import { healthCheck } from "../controllers/healthCheck.controller";

const router = new Hono();

router.get("/healthcheck", healthCheck);


export default router