import { QueryTypes, Sequelize } from "sequelize";
import { faker } from "@faker-js/faker";
import { LocationService } from "./location";
import { Location } from "../../schemas/location-schema";

const mockLocation = {
  _id: faker.number.int().toString(),
  _v: faker.number.int(),
  locationLegalName: faker.company.name(),
  locationEmail: faker.internet.email(),
  locationIndustry: faker.company.buzzVerb(),
  locationRegion: "AUS",
  locationCurrency: "AUD",
  locationTimeZone: faker.date.anytime().toISOString(),
  locationSIUnit: "KG",
  locationAddressLine1: faker.location.streetAddress(),
  locationAddressLine2: faker.location.secondaryAddress(),
  locationCity: faker.location.city(),
  locationState: faker.location.state(),
  locationCountry: faker.location.country(),
  locationPostcode: faker.location.countryCode(),
  locationApproved: false,
  locationApprovedAt: faker.date.anytime().toISOString(),
  locationCreatedAt: faker.date.anytime().toISOString(),
  locationDeletedAt: faker.date.anytime().toISOString(),
};

describe("Location service", () => {
  afterEach(async () => {
    const dbInstance = new Sequelize(`${process.env.POSTGRES_CONNECTION_URI}`);
    await dbInstance.query(`DELETE FROM location;`, {
      type: QueryTypes.DELETE,
    });
  });
  describe("## createLocation function", () => {
    it("shuld create a location in the database", async () => {
      const fakeUserEmail = faker.internet.email();
      const storedLocation = await LocationService.createLocation(
        fakeUserEmail,
        mockLocation
      );

      expect(storedLocation).toEqual([
        {
          id: storedLocation[0].id,
          locationAddressLine1: mockLocation.locationAddressLine1,
          locationAddressLine2: mockLocation.locationAddressLine2,
          locationApproved: mockLocation.locationApproved,
          locationApprovedAt: mockLocation.locationApprovedAt,
          locationCity: mockLocation.locationCity,
          locationCountry: mockLocation.locationCountry,
          locationCreatedAt: mockLocation.locationCreatedAt,
          locationCurrency: mockLocation.locationCurrency,
          locationDeletedAt: mockLocation.locationDeletedAt,
          locationEmail: mockLocation.locationEmail,
          locationId: mockLocation._id,
          locationIndustry: mockLocation.locationIndustry,
          locationLegalName: mockLocation.locationLegalName,
          locationPostCode: mockLocation.locationPostcode,
          locationRegion: mockLocation.locationRegion,
          locationSiUnit: mockLocation.locationSIUnit,
          locationState: mockLocation.locationState,
          locationTimeZone: mockLocation.locationTimeZone,
          locationUserEmail: fakeUserEmail,
        },
      ]);
    });

    it("should gracefully handle error when insert is unsuccessful", async () => {
      const fakeUserEmail = faker.internet.email();
      const problematicLocation = {};
      const storedLocation = await LocationService.createLocation(
        fakeUserEmail,
        {
          ...problematicLocation,
        } as Location
      );
      expect(storedLocation).toEqual("Error in inserting location");
    });
  });

  describe("## getLocationByLocationId function", () => {
    it("should get a location by location id", async () => {
      const fakeUserEmail = faker.internet.email();
      const storedLocation = await LocationService.createLocation(
        fakeUserEmail,
        mockLocation
      );
      const location = await LocationService.getLocationByLocationId(
        mockLocation._id
      );
      console.log(storedLocation);
      expect(location).toEqual([
        {
          id: storedLocation[0].id,
          locationAddressLine1: mockLocation.locationAddressLine1,
          locationAddressLine2: mockLocation.locationAddressLine2,
          locationApproved: mockLocation.locationApproved,
          locationApprovedAt: mockLocation.locationApprovedAt,
          locationCity: mockLocation.locationCity,
          locationCountry: mockLocation.locationCountry,
          locationCreatedAt: mockLocation.locationCreatedAt,
          locationCurrency: mockLocation.locationCurrency,
          locationDeletedAt: mockLocation.locationDeletedAt,
          locationEmail: mockLocation.locationEmail,
          locationId: mockLocation._id,
          locationIndustry: mockLocation.locationIndustry,
          locationLegalName: mockLocation.locationLegalName,
          locationPostCode: mockLocation.locationPostcode,
          locationRegion: mockLocation.locationRegion,
          locationSiUnit: mockLocation.locationSIUnit,
          locationState: mockLocation.locationState,
          locationTimeZone: mockLocation.locationTimeZone,
          locationUserEmail: fakeUserEmail,
        },
      ]);
    });
  });
});
