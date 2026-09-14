import { COLLECTIONS } from "../commercial/constants.js";
import { findManyByField } from "./baseRepository.js";

export async function getActiveFollowUpRulesByStage(stage) {
  const rules = await findManyByField(
    COLLECTIONS.FOLLOW_UP_RULES,
    "triggerStage",
    stage,
    { ascendingField: "delayHours" }
  );

  return rules.filter((rule) => rule.active !== false);
}
