import { ENTITY_TYPES } from "./constants.js";
import { createActivityId } from "./ids.js";
import { createActivityRecord } from "../repositories/activitiesRepository.js";

export async function recordActivity({
  entityType,
  entityId,
  activityType,
  stageFrom = null,
  stageTo = null,
  summary,
  owner = "SYSTEM",
  nextAction = null,
  nextActionDue = null,
}) {
  if (!entityType || !entityId || !activityType || !summary) {
    throw new Error("entityType, entityId, activityType and summary are required.");
  }

  return createActivityRecord({
    activityId: createActivityId(),
    entityType,
    entityId,
    activityType,
    stageFrom,
    stageTo,
    summary,
    owner,
    activityDate: new Date(),
    nextAction,
    nextActionDue,
  });
}

export async function recordQuoteActivity(args) {
  return recordActivity({
    ...args,
    entityType: ENTITY_TYPES.QUOTE,
  });
}
