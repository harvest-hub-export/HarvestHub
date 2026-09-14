import wixData from "wix-data";
import { COLLECTIONS } from "../commercial/constants.js";

const INTERNAL_OPTIONS = Object.freeze({ suppressAuth: true });

export async function getActiveKpiDefinitions() {
  const result = await wixData
    .query(COLLECTIONS.COMMERCIAL_KPI)
    .eq("active", true)
    .limit(100)
    .find(INTERNAL_OPTIONS);

  return result.items;
}

export async function getActiveDashboardDefinitions() {
  const result = await wixData
    .query(COLLECTIONS.MANAGEMENT_DASHBOARD)
    .eq("active", true)
    .ascending("sortOrder")
    .limit(100)
    .find(INTERNAL_OPTIONS);

  return result.items;
}
