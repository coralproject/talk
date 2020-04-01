import { ExternalModerationPhase } from "./settings";

export function filterActivePhase() {
  return (phase: Pick<ExternalModerationPhase, "enabled">) => phase.enabled;
}
