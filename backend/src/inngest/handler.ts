import { serve } from "inngest/cloudflare";
import { inngest } from "./client";
import { syncUser } from "./functions/syncUser";

export const inngestHandler = serve({
  client: inngest,
  functions: [syncUser],
});