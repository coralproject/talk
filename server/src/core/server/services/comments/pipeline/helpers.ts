import { isUndefined } from "lodash";

import { PhaseResult } from "./pipeline";

export function mergePhaseResult(
  result: Partial<PhaseResult>,
  final: Partial<PhaseResult>
) {
  const { actions = [], tags = [], metadata = {} } = final;

  // If this result contained actions, then we should push it into the
  // other actions.
  if (result.actions) {
    final.actions = [...actions, ...result.actions];
  }

  // If this result contained metadata, then we should merge it into the
  // other metadata.
  if (result.metadata) {
    final.metadata = { ...metadata, ...result.metadata };
  }

  // If the result modified the comment body, we should replace it.
  if (!isUndefined(result.body)) {
    final.body = result.body;
  }

  // If the result added any tags, we should push it into the existing tags.
  if (result.tags && result.tags.length > 0) {
    final.tags = [
      ...tags,
      // Only push in tags that we haven't already added.
      ...result.tags.filter((tag) => !tags.includes(tag)),
    ];
  }

  // If this result contained a status, then we've finished resolving
  // phases!
  if (result.status) {
    final.status = result.status;
    return true;
  }

  return false;
}
