import {
  EmailDomain,
  ExternalModerationExternalIntegration,
  ExternalModerationPhase,
} from "./settings";

export function filterActivePhase() {
  return (phase: Pick<ExternalModerationPhase, "enabled">) => phase.enabled;
}

export function getExternalModerationPhase(
  integration: ExternalModerationExternalIntegration,
  phaseID: string
) {
  return integration.phases.find((p) => p.id === phaseID) || null;
}

export function getEmailDomain(
  emailDomainModeration: EmailDomain[],
  emailDomainId: string
) {
  return emailDomainModeration.find((d) => d.id === emailDomainId) || null;
}
