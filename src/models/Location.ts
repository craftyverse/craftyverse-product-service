import mongoose from "mongoose";

export interface LocationFields {
  locationId: string;
  locationName: string;
  locationEmail: string;
  locationApproved: boolean;
  locationLegalAddressLine1: string;
  locationLegalAddressLine2: string | undefined;
}

// Properties that a location model (database) requires
export interface LocationModel extends mongoose.Model<LocationDocument> {
  build(fields: LocationFields): LocationDocument;
}

// Properties that the Location document requires
export interface LocationDocument extends mongoose.Document {
  locationId: string;
  locationName: string;
  locationEmail: string;
  locationApproved: boolean;
  locationLegalAddressLine1: string;
  locationLegalAddressLine2: string | undefined;
}

const locationSchema = new mongoose.Schema(
  {
    locationId: { type: String, required: true },
    locationName: { type: String, required: true },
    locationEmail: { type: String, required: true },
    locationApproved: { type: Boolean, required: true },
    locationLegalAddressLine1: { type: String, required: true },
    locationLegalAddressLine2: { type: String, required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.locationId = ret._id;
        delete ret._id;
      },
    },
  }
);

locationSchema.statics.build = (fields: LocationFields) => {
  return new Location(fields);
};

const Location = mongoose.model<LocationDocument, LocationModel>(
  "Location",
  locationSchema
);

export { Location };
