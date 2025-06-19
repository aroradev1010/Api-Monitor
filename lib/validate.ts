import { z } from "zod";

export const endpointSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  tags: z.array(z.string()).optional(),
});

export const logSchema = z.object({
  endpointId: z.string(),
  latency: z.number(),
  statusCode: z.number(),
});
