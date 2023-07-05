import { GQLFEATURE_FLAG } from "coral-server/graph/schema/__generated__/types";

import { User } from "../user";
import { hasModeratorRole } from "../user/helpers";

/**
 * FEATURE_FLAGS is an array of all the valid feature flags.
 */
const FEATURE_FLAGS = Object.values(GQLFEATURE_FLAG);

/**
 * PUBLIC_FEATURE_FLAGS are flags that are allowed to be returned when accessed
 * by a user with non-staff permissions.
 */
const PUBLIC_FEATURE_FLAGS = [
  GQLFEATURE_FLAG.AVATARS,
  GQLFEATURE_FLAG.ALTERNATE_OLDEST_FIRST_VIEW,
  GQLFEATURE_FLAG.DISCUSSIONS,
  GQLFEATURE_FLAG.READ_MORE_NEW_TAB,
  GQLFEATURE_FLAG.AVATARS,
  GQLFEATURE_FLAG.NEW_COMMENT_COUNT,
  GQLFEATURE_FLAG.COMMENT_SEEN,
  GQLFEATURE_FLAG.Z_KEY,
];

type FlagFilter = (flag: GQLFEATURE_FLAG | string) => boolean;

const validFeatureFlagsFilter = (user: User | null | undefined): FlagFilter => {
  const filters: FlagFilter[] = [
    // Return a type guard for the feature flag.
    (flag): flag is GQLFEATURE_FLAG =>
      FEATURE_FLAGS.includes(flag as GQLFEATURE_FLAG),
  ];

  // For anonymous users or users without a moderator role, ensure we only send
  // back the public flags.
  if (!user || !hasModeratorRole(user)) {
    filters.push((flag) =>
      PUBLIC_FEATURE_FLAGS.includes(flag as GQLFEATURE_FLAG)
    );
  }

  return (flag) => filters.every((filter) => filter(flag));
};

export default validFeatureFlagsFilter;
