import { serve } from "inngest/cloudflare";
import { Inngest } from "inngest";
import { syncUser } from "./functions/syncUser";

export const inngestHandler = (env: any) => {
  const client = new Inngest({
    id: "etherscope-worker",
    eventKey: env.INNGEST_EVENT_KEY,
  });

  return serve({
    client,
    functions: [syncUser],
    signingKey: env.INNGEST_SIGNING_KEY,
  });
};
