import { QueryTypes, Sequelize } from "sequelize";
import {
  BadRequestError,
  NotFoundError,
} from "@craftyverse-au/craftyverse-common";
import "dotenv/config";
import { th } from "date-fns/locale";

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
  ): Promise<any> {
    const dbInstance = new Sequelize(`${process.env.POSTGRES_CONNECTION_URI}`);
    try {
      const [results, metadata] = await dbInstance.query(
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
        RETURNING *;`
      );
      return results;
    } catch (error) {
      return "Error in inserting location";
    }
  }

  static async getLocationByLocationId(locationId: string): Promise<any> {
    const dbInstance = new Sequelize(`${process.env.POSTGRES_CONNECTION_URI}`);
    try {
      const [results, metadata] = await dbInstance.query(
        `SELECT * FROM location WHERE "locationId" = '${locationId}'`
      );
      return results;
    } catch (error) {
      return "Error in fetching location";
    }
  }
}
