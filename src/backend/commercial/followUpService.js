import { getActiveFollowUpRulesByStage } from "../repositories/followUpRepository.js";
import { recordActivity } from "./activityService.js";

function addHours(date, hours) {
  return new Date(date.getTime() + (hours * 60 * 60 * 1000));
}

export async function buildFollowUpActionsForStage({
  entityType,
  entityId,
  stage,
  owner = "EXPORT",
  fromDate = new Date(),
}) {
  if (!entityType || !entityId || !stage) {
    throw new Error("entityType, entityId and stage are required.");
  }

  const rules = await getActiveFollowUpRulesByStage(stage);

  return rules.map((rule) => ({
    triggerStage: stage,
    action: rule.action,
    priority: rule.priority || "MEDIUM",
    dueAt: addHours(fromDate, Number(rule.delayHours || 0)),
    delayHours: Number(rule.delayHours || 0),
    owner,
    ruleId: rule._id,
  }));
}

export async function recordNextFollowUp({
  entityType,
  entityId,
  stage,
  owner = "EXPORT",
}) {
  const actions = await buildFollowUpActionsForStage({
    entityType,
    entityId,
    stage,
    owner,
  });

  if (!actions.length) return null;

  const next = actions[0];

  return recordActivity({
    entityType,
    entityId,
    activityType: "FOLLOW_UP_SCHEDULED",
    stageFrom: stage,
    stageTo: stage,
    summary: `Follow-up scheduled: ${next.action}`,
    owner,
    nextAction: next.action,
    nextActionDue: next.dueAt,
  });
}
