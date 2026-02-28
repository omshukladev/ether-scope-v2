import { Hono } from "hono";
import { errorHandler } from "./utils/errorHandler"


const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/message", (c) => {
  return c.text("Hello Hono!");
});

// Import routes
import healthCheckRoute from "./routes/healtCheck.route";

// Use routes
app.route("/api", healthCheckRoute);


//! Global error handler
app.onError(errorHandler)

export default app;
