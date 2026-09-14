import { COLLECTIONS } from "../commercial/constants.js";
import {
  findManyByField,
  insert,
  update,
} from "./baseRepository.js";

export async function createQuoteLine(data) {
  return insert(COLLECTIONS.QUOTE_LINE_ITEMS, data);
}

export async function updateQuoteLine(item) {
  return update(COLLECTIONS.QUOTE_LINE_ITEMS, item);
}

export async function getLinesByQuoteId(quoteId) {
  return findManyByField(COLLECTIONS.QUOTE_LINE_ITEMS, "quoteId", quoteId, {
    ascendingField: "lineNo",
  });
}
