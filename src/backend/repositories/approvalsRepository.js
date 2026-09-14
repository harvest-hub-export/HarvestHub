import { COLLECTIONS } from "../commercial/constants.js";
import {
  findManyByField,
  insert,
} from "./baseRepository.js";

export async function createApprovalRecord(data) {
  return insert(COLLECTIONS.APPROVAL_LOG, data);
}

export async function getApprovalsByEntityId(entityId) {
  return findManyByField(COLLECTIONS.APPROVAL_LOG, "entityId", entityId, {
    descendingField: "decisionDate",
  });
}

export async function getLatestApprovalByEntityId(entityId) {
  const items = await getApprovalsByEntityId(entityId);
  return items[0] || null;
}
