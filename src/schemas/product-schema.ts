import { z } from "zod";

export const productSchema = z.object({
  name: z.string(),
  locationId: z.string(),
  description: z.string(),
});

export type Product = z.infer<typeof productSchema>;
