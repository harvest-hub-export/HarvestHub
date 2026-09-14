import { COLLECTIONS } from "../commercial/constants.js";
import { createRfQId } from "../commercial/ids.js";
import {
  findOneByField,
  insert,
  update,
} from "./baseRepository.js";

export async function getRfQByBusinessId(rfqId) {
  return findOneByField(COLLECTIONS.RFQ_SUBMISSIONS, "rfqId", rfqId);
}

export async function ensureRfQBusinessId(item) {
  if (!item) throw new Error("RFQ item is required.");
  if (item.rfqId) return item;

  return update(COLLECTIONS.RFQ_SUBMISSIONS, {
    ...item,
    rfqId: createRfQId(),
  });
}

export async function createRfQ(data) {
  return insert(COLLECTIONS.RFQ_SUBMISSIONS, {
    ...data,
    rfqId: data.rfqId || createRfQId(),
    submittedAt: data.submittedAt || new Date(),
  });
}
