import { z } from "zod";

// productLocationId: string;
// productCategoryId: string;
// productName: string;
// productDescription: string;
// productImages: string[];

// locationName: string;
// locationEmail: string;
// locationApproved: boolean;
// locationLegalAddressLine1: string;
// locationLegalAddressLine2: string | undefined;

export const productLocationSchema = z.object({
  locationName: z.string(),
  locationEmail: z.string(),
  locationApproved: z.boolean(),
  locationLegalAddressLine1: z.string(),
  locationLegalAddressLine2: z.string(),
});

export const productRequestSchema = z.object({
  productLocationId: z.string(),
  productCategoryId: z.string(),
  productName: z.string(),
  productDescription: z.string(),
  productImageIds: z.string().array(),
});

export const productResponseSchema = z.object({});

export type NewProductRequest = z.infer<typeof productRequestSchema>;
export type ProductLocationSchema = z.infer<typeof productLocationSchema>;
