import { CAPABILITIES } from "../security/roles.js";
import { assertCapability } from "../security/authorization.js";
import { calculateCommercialKpis } from "./kpiService.js";
import {
  getActiveDashboardDefinitions,
  getActiveKpiDefinitions,
} from "../repositories/kpiRepository.js";

export async function getManagementDashboard(actor) {
  assertCapability(actor, CAPABILITIES.READ_DASHBOARD);

  const [metrics, dashboardDefinitions, kpiDefinitions] = await Promise.all([
    calculateCommercialKpis(),
    getActiveDashboardDefinitions(),
    getActiveKpiDefinitions(),
  ]);

  return {
    generatedAt: new Date(),
    metrics,
    dashboardDefinitions,
    kpiDefinitions,
  };
}
