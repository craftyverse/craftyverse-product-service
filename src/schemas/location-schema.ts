import { z } from "zod";
const locationRegionSchema = z.enum(["EN", "CHN", "AUS", "USA"]);

const locationCurrencySchema = z.enum(["USD", "CNY", "AUD", "EUR"]);

export const locationSchema = z.object({
  _id: z.string(),
  _v: z.number(),
  locationLegalName: z.string(),
  locationUserEmail: z.string().email(),
  locationEmail: z.string(),
  locationIndustry: z.string(),
  locationRegion: locationRegionSchema,
  locationCurrency: locationCurrencySchema,
  locationTimeZone: z.string(),
  locationSIUnit: z.string(),
  locationAddressLine1: z.string(),
  locationAddressLine2: z.string(),
  locationCity: z.string(),
  locationState: z.string(),
  locationCountry: z.string(),
  locationPostcode: z.string(),
  locationApproved: z.boolean(),
  locationApprovedAt: z.string().nullable(),
  locationCreatedAt: z.string(),
  locationDeletedAt: z.string().nullable(),
});

export type Location = z.infer<typeof locationSchema>;
