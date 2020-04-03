import { CustomExternalIntegration, ExternalModerationPhase } from "./settings";

export function filterActivePhase() {
  return (phase: Pick<ExternalModerationPhase, "enabled">) => phase.enabled;
}

export function getExternalModerationPhase(
  integration: CustomExternalIntegration,
  phaseID: string
) {
  return integration.phases.find(p => p.id === phaseID) || null;
}
