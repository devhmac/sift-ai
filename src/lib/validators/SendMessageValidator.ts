import { z } from "zod";
//this is going to enforce a constant schema for all messages being sent through api route
export const SendMessageValidator = z.object({
  fileId: z.string(),
  message: z.string(),
});
