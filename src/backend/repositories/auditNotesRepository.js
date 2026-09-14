import { COLLECTIONS } from "../commercial/constants.js";
import {
  findManyByField,
  insert,
} from "./baseRepository.js";

export async function createAuditNote(data) {
  return insert(COLLECTIONS.MANAGEMENT_AUDIT_NOTES, data);
}

export async function getAuditNotesByEntityId(entityId) {
  return findManyByField(COLLECTIONS.MANAGEMENT_AUDIT_NOTES, "entityId", entityId, {
    descendingField: "_createdDate",
  });
}
