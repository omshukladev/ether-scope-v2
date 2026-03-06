import { serve } from "inngest/cloudflare";
import { inngest } from "./client";
import { syncUser } from "./functions/syncUser";

export const inngestHandler = (env: any) =>
  serve({
    client: inngest,
    functions: [syncUser],
    signingKey: env.INNGEST_SIGNING_KEY,
  });
