import { COLLECTIONS } from "../commercial/constants.js";
import {
  findManyByField,
  insert,
  update,
} from "./baseRepository.js";

export async function createCostBuild(data) {
  return insert(COLLECTIONS.COST_BUILDS, data);
}

export async function updateCostBuild(item) {
  return update(COLLECTIONS.COST_BUILDS, item);
}

export async function getCostBuildsByQuoteId(quoteId) {
  return findManyByField(COLLECTIONS.COST_BUILDS, "quoteId", quoteId, {
    descendingField: "_createdDate",
  });
}

export async function getLatestCostBuildByQuoteId(quoteId) {
  const items = await getCostBuildsByQuoteId(quoteId);
  return items[0] || null;
}
