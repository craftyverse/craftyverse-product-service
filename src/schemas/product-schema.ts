import { z } from "zod";

export const productSchema = z.object({
  id: z.number(),
  locationId: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.date(),
  deletedAt: z.date().optional(),
});

export type Product = z.infer<typeof productSchema>;
