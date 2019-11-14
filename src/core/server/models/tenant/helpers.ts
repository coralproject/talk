import crypto from "crypto";
import { FluentBundle } from "fluent/compat";

import {
  GQLReactionConfiguration,
  GQLStaffConfiguration,
} from "coral-server/graph/tenant/schema/__generated__/types";
import { translate } from "coral-server/services/i18n";

import { SSOKey } from "../settings";

export const getDefaultReactionConfiguration = (
  bundle: FluentBundle
): GQLReactionConfiguration => ({
  // By default, the standard reaction style will use the Respect with the
  // handshake.
  label: translate(bundle, "Respect", "reaction-labelRespect"),
  labelActive: translate(bundle, "Respected", "reaction-labelActiveRespected"),
  sortLabel: translate(
    bundle,
    "Most Respected",
    "reaction-sortLabelMostRespected"
  ),
  icon: "thumb_up",
});

export const getDefaultStaffConfiguration = (
  bundle: FluentBundle
): GQLStaffConfiguration => ({
  label: translate(bundle, "Staff", "staff-label"),
});

export function generateRandomString(size: number, drift = 5) {
  return crypto
    .randomBytes(size + Math.floor(Math.random() * drift))
    .toString("hex");
}

export function generateSSOKey(createdAt: Date): SSOKey {
  // Generate a new key. We generate a key of minimum length 32 up to 37 bytes,
  // as 16 was the minimum length recommended.
  //
  // Reference: https://security.stackexchange.com/a/96176
  const secret = generateRandomString(32, 5);
  const kid = generateRandomString(8, 3);

  return { kid, secret, createdAt };
}
