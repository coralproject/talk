/**
 * TODO: (cvle) This file is a workaround to have Relay compatible enum types.
 * This should be generated by `graphql-schema-typescript`.
 */

import { RelayEnumLiteral } from "../types";
import {
  GQLCOMMENT_FLAG_DETECTED_REASON,
  GQLCOMMENT_FLAG_REASON,
  GQLCOMMENT_FLAG_REPORTED_REASON,
  GQLCOMMENT_SORT,
  GQLCOMMENT_STATUS,
  GQLLOCALES,
  GQLMODERATION_MODE,
  GQLMODERATION_QUEUE,
  GQLSTORY_STATUS,
  GQLUSER_AUTH_CONDITIONS,
  GQLUSER_ROLE,
  GQLUSER_STATUS,
} from "./__generated__/types";

export type GQLMODERATION_QUEUE_RL = RelayEnumLiteral<
  typeof GQLMODERATION_QUEUE
>;
export type GQLUSER_ROLE_RL = RelayEnumLiteral<typeof GQLUSER_ROLE>;
export type GQLUSER_STATUS_RL = RelayEnumLiteral<typeof GQLUSER_STATUS>;
export type GQLCOMMENT_FLAG_DETECTED_REASON_RL = RelayEnumLiteral<
  typeof GQLCOMMENT_FLAG_DETECTED_REASON
>;
export type GQLCOMMENT_FLAG_REASON_RL = RelayEnumLiteral<
  typeof GQLCOMMENT_FLAG_REASON
>;
export type GQLCOMMENT_FLAG_REPORTED_REASON_RL = RelayEnumLiteral<
  typeof GQLCOMMENT_FLAG_REPORTED_REASON
>;
export type GQLCOMMENT_SORT_RL = RelayEnumLiteral<typeof GQLCOMMENT_SORT>;
export type GQLCOMMENT_STATUS_RL = RelayEnumLiteral<typeof GQLCOMMENT_STATUS>;
export type GQLLOCALES_RL = RelayEnumLiteral<typeof GQLLOCALES>;
export type GQLMODERATION_MODE_RL = RelayEnumLiteral<typeof GQLMODERATION_MODE>;
export type GQLSTORY_STATUS_RL = RelayEnumLiteral<typeof GQLSTORY_STATUS>;
export type GQLUSER_AUTH_CONDITIONS_RL = RelayEnumLiteral<
  typeof GQLUSER_AUTH_CONDITIONS
>;
