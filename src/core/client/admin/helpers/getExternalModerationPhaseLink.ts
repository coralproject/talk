import { urls } from "coral-framework/helpers";

export default function getExternalModerationPhaseLink(phaseID: string) {
  return `${urls.admin.configureExternalModerationPhase}/${phaseID}`;
}
