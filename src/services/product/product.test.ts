import { QueryTypes, Sequelize } from "sequelize";
import { faker } from "@faker-js/faker";
import { ProductService } from "./product";
import { LocationService } from "../location/location";

const mockProduct = {
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  createdAt: faker.date.anytime().toISOString(),
  deletedAt: null,
  updatedAt: null,
};

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

describe("Product service", () => {
  afterEach(async () => {
    const dbInstance = new Sequelize(`${process.env.POSTGRES_CONNECTION_URI}`);
    await dbInstance.query(`DELETE FROM product;`, {
      type: QueryTypes.DELETE,
    });
  });

  describe("## createProduct function", () => {
    it("should create a product in the database", async () => {
      const fakeUserEmail = faker.internet.email();
      await LocationService.createLocation(fakeUserEmail, mockLocation);

      const storedProduct = await ProductService.createProduct({
        ...mockProduct,
        locationId: mockLocation._id,
      });
      console.log(storedProduct);

      expect(storedProduct).toEqual([
        {
          id: storedProduct[0].id,
          locationId: mockLocation._id,
          name: mockProduct.name,
          description: mockProduct.description,
          createdAt: mockProduct.createdAt,
          deletedAt: "null",
          updatedAt: "null",
        },
      ]);
    });

    it('should return "Error in inserting product" when an error occurs', async () => {
      const fakeUserEmail = faker.internet.email();
      const storedLocation = await LocationService.createLocation(
        fakeUserEmail,
        mockLocation
      );

      const storedProduct = await ProductService.createProduct({
        ...mockProduct,
        locationId: storedLocation[0].id,
      });
      console.log(storedProduct);

      expect(storedProduct).toEqual("Error in inserting product");
    });
  });
});
