import { Hono } from "hono";
import { errorHandler } from "./utils/errorHandler";



// Define your Cloudflare Workers KV namespace bindings here
type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

//Middlewares
import { cors } from "hono/cors";

app.use(
  "*",
  cors({
    origin: "*", // allow all for now (dev)
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type","Authorization","X-Requested-With","Headers"],
  }),
);




app.get("/message", (c) => {
  return c.text("Hello Hono!");
});

// Import routes
import healthCheckRoute from "./routes/healtCheck.route";

// Use routes
app.route("/api", healthCheckRoute);

//! Global error handler
app.onError(errorHandler);

export default app;
