import { COLLECTIONS } from "../commercial/constants.js";
import {
  findManyByField,
  insert,
} from "./baseRepository.js";

export async function createActivityRecord(data) {
  return insert(COLLECTIONS.ACTIVITY_TIMELINE, data);
}

export async function getActivitiesByEntityId(entityId) {
  return findManyByField(COLLECTIONS.ACTIVITY_TIMELINE, "entityId", entityId, {
    descendingField: "activityDate",
  });
}
