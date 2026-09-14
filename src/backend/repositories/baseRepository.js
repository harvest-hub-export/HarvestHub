import wixData from "wix-data";

const INTERNAL_OPTIONS = Object.freeze({ suppressAuth: true });

export async function insert(collectionId, data) {
  return wixData.insert(collectionId, data, INTERNAL_OPTIONS);
}

export async function update(collectionId, data) {
  if (!data?._id) {
    throw new Error(`Cannot update ${collectionId} without _id.`);
  }
  return wixData.update(collectionId, data, INTERNAL_OPTIONS);
}

export async function getById(collectionId, id) {
  if (!id) return null;
  try {
    return await wixData.get(collectionId, id, INTERNAL_OPTIONS);
  } catch (error) {
    if (String(error?.message || "").toLowerCase().includes("not found")) {
      return null;
    }
    throw error;
  }
}

export async function findOneByField(collectionId, field, value) {
  const result = await wixData
    .query(collectionId)
    .eq(field, value)
    .limit(1)
    .find(INTERNAL_OPTIONS);

  return result.items[0] || null;
}

export async function findManyByField(collectionId, field, value, {
  limit = 100,
  ascendingField = null,
  descendingField = null,
} = {}) {
  let query = wixData.query(collectionId).eq(field, value).limit(limit);

  if (ascendingField) query = query.ascending(ascendingField);
  if (descendingField) query = query.descending(descendingField);

  const result = await query.find(INTERNAL_OPTIONS);
  return result.items;
}
