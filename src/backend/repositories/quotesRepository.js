import { COLLECTIONS } from "../commercial/constants.js";
import {
  findOneByField,
  findManyByField,
  insert,
  update,
} from "./baseRepository.js";

export async function createQuoteRecord(data) {
  return insert(COLLECTIONS.QUOTES, data);
}

export async function updateQuoteRecord(item) {
  return update(COLLECTIONS.QUOTES, item);
}

export async function getQuoteByBusinessId(quoteId) {
  return findOneByField(COLLECTIONS.QUOTES, "quoteId", quoteId);
}

export async function getQuotesByRfQId(rfqId) {
  return findManyByField(COLLECTIONS.QUOTES, "rfqId", rfqId, {
    descendingField: "_createdDate",
  });
}
