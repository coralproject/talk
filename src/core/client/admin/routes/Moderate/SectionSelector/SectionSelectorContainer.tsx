import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import { SectionFilter } from "coral-common/section";
import { QUEUE_NAME } from "coral-framework/helpers";
import { GQLFEATURE_FLAG } from "coral-framework/schema";

import { SectionSelectorContainer_query$key as SectionSelectorContainer_query } from "coral-admin/__generated__/SectionSelectorContainer_query.graphql";

import SectionSelector from "./SectionSelector";

interface Props {
  query: SectionSelectorContainer_query | null;
  section?: SectionFilter | null;
  queueName: QUEUE_NAME | undefined;
}

const SectionSelectorContainer: FunctionComponent<Props> = ({
  query,
  section,
  queueName,
}) => {
  const queryData = useFragment(
    graphql`
      fragment SectionSelectorContainer_query on Query {
        sections
        settings {
          # FEATURE_FLAG:SECTIONS
          featureFlags
        }
      }
    `,
    query
  );

  // FEATURE_FLAG:SECTIONS
  if (
    !queryData ||
    !queryData.settings.featureFlags.includes(GQLFEATURE_FLAG.SECTIONS) ||
    !queryData.sections
  ) {
    return null;
  }

  return (
    <SectionSelector
      sections={queryData.sections}
      section={section}
      queueName={queueName}
    />
  );
};

export default SectionSelectorContainer;
