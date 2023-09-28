import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  LocationCreatedEvent,
} from "@craftyverse-au/craftyverse-common";
import { Location } from "../../models/Location";
import { queueGroupName } from "./queue-group-name";

export class LocationCreatedListener extends Listener<LocationCreatedEvent> {
  subject: Subjects.LocationCreated = Subjects.LocationCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: LocationCreatedEvent["data"], msg: Message) {
    const createdLocation = data;

    const productLocation = Location.build({
      locationId: createdLocation.locationId,
      locationName: createdLocation.locationName,
      locationEmail: createdLocation.locationEmail,
      locationApproved: createdLocation.locationApproved,
      locationLegalAddressLine1: createdLocation.locationLegalAddressLine1,
      locationLegalAddressLine2: createdLocation.locationLegalAddressLine2,
    });

    await productLocation.save();

    msg.ack();
  }
}
