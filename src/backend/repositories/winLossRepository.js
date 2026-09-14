import { COLLECTIONS } from "../commercial/constants.js";
import { findManyByField } from "./baseRepository.js";

export async function getActiveWinLossReasons(outcome) {
  const reasons = await findManyByField(
    COLLECTIONS.WIN_LOSS_REASONS,
    "outcome",
    outcome,
    { ascendingField: "sortOrder" }
  );

  return reasons.filter((reason) => reason.active !== false);
}

export async function getWinLossReasonByCode(code) {
  const won = await getActiveWinLossReasons("WON");
  const lost = await getActiveWinLossReasons("LOST");
  return [...won, ...lost].find((item) => item.code === code) || null;
}
