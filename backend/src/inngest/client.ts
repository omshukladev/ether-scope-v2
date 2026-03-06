import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "etherscope-worker",
  eventKey: process.env.INNGEST_EVENT_KEY,
});