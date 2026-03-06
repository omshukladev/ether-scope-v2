import { Inngest } from "inngest";

export const createInngest = (eventKey: string) =>
  new Inngest({
    id: "etherscope-worker",
    eventKey,
    isDev: false,
  });