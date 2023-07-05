import { isNil, omitBy } from "lodash";

import { SectionFilter } from "coral-common/section";
import { CommentConnectionInput } from "coral-server/models/comment";
import { hasFeatureFlag, Tenant } from "coral-server/models/tenant";

import { GQLFEATURE_FLAG } from "../schema/__generated__/types";

/**
 * requiredPropertyFilter will remove those properties that are nil from the
 * object as they are not nilable on the database model. If we didn't do this,
 * then any time that the property is nil, we'd be querying for comments that
 * can't possibly exist!
 *
 * @param props properties that if nil should be removed from the return object
 */
export const requiredPropertyFilter = (
  props: CommentConnectionInput["filter"]
): CommentConnectionInput["filter"] => omitBy(props, isNil);

export const sectionFilter = (
  tenant: Pick<Tenant, "featureFlags">,
  section?: SectionFilter
): CommentConnectionInput["filter"] => {
  // Don't filter by section if the feature flag is disabled.
  if (!hasFeatureFlag(tenant, GQLFEATURE_FLAG.SECTIONS)) {
    return {};
  }

  if (section) {
    return { section: section.name || null };
  }

  return {};
};
