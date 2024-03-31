import { QueryTypes, Sequelize } from "sequelize";
import { BadRequestError } from "@craftyverse-au/craftyverse-common";
import "dotenv/config";

type Location = {
  _id: string;
  locationLegalName: string;
  locationEmail: string;
  locationIndustry: string;
  locationRegion: string;
  locationCurrency: string;
  locationTimeZone: string;
  locationSIUnit: string;
  locationAddressLine1: string;
  locationAddressLine2: string;
  locationCity: string;
  locationState: string;
  locationCountry: string;
  locationPostcode: string;
  locationApproved: boolean;
  locationApprovedAt: string | null;
  locationCreatedAt: string;
  locationDeletedAt: string | null;
};

export class LocationService {
  /**
   * This function creates a location in the database
   */
  static async createLocation(
    userEmail: string,
    location: Location
  ): Promise<[number, number]> {
    const dbInstance = new Sequelize(`${process.env.POSTGRES_CONNECTION_URI}`);
    const storedLocation = await dbInstance.query(
      `INSERT INTO location (
        "locationId",
        "locationLegalName",
        "locationUserEmail",
        "locationEmail",
        "locationIndustry",
        "locationRegion",
        "locationCurrency",
        "locationTimeZone",
        "locationSiUnit",
        "locationAddressLine1",
        "locationAddressLine2",
        "locationCity",
        "locationState",
        "locationCountry",
        "locationPostCode",
        "locationApproved",
        "locationApprovedAt",
        "locationCreatedAt",
        "locationDeletedAt"
      ) VALUES (
        '${location._id}',
        '${location.locationLegalName}',
        '${userEmail}',
        '${location.locationEmail}',
        '${location.locationIndustry}',
        '${location.locationRegion}',
        '${location.locationCurrency}',
        '${location.locationTimeZone}',
        '${location.locationSIUnit}',
        '${location.locationAddressLine1}',
        '${location.locationAddressLine2}',
        '${location.locationCity}',
        '${location.locationState}',
        '${location.locationCountry}',
        '${location.locationPostcode}', 
        '${location.locationApproved}',
        '${location.locationApprovedAt}',
        '${location.locationCreatedAt}',
        '${location.locationDeletedAt}'
      )
        RETURNING *;`,
      {
        type: QueryTypes.INSERT,
      }
    );
    if (!storedLocation) {
      throw new BadRequestError("Failed to store location in the database");
    }

    return storedLocation;
  }
}
