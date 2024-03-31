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

/**
 * {
  locationLegalName: "Crafftyverse",
  locationUserEmail: "litony179@gmail.com",
  locationEmail: "tony.li1@test.io",
  locationIndustry: "Arts and Crafts",
  locationRegion: "AUS",
  locationCurrency: "AUD",
  locationTimeZone: "AWST",
  locationSIUnit: "KG",
  locationAddressLine1: "24 Delaney Drive",
  locationAddressLine2: "Baulkham Hills",
  locationCity: "Sydney",
  locationState: "NSW",
  locationCountry: "Australia",
  locationPostcode: "2153",
  locationApproved: false,
  locationApprovedAt: null,
  locationCreatedAt: "2024-03-29T11:11:06.497Z",
  locationDeletedAt: null,
  _id: "6608ae47b46894dc4f08fe10",
  __v: 0
}
 */

export type Location = z.infer<typeof locationSchema>;
