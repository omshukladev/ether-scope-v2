import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "etherscope-worker",
  isDev: false,
});

export const createEventClient = (eventKey: string) =>
  new Inngest({
    id: "etherscope-worker",
    eventKey,
    isDev: false,
  });