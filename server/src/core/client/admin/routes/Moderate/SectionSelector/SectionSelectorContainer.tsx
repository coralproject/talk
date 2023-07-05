import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { SectionFilter } from "coral-common/section";
import { QUEUE_NAME } from "coral-framework/helpers";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLFEATURE_FLAG } from "coral-framework/schema";

import { SectionSelectorContainer_query } from "coral-admin/__generated__/SectionSelectorContainer_query.graphql";

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
  // FEATURE_FLAG:SECTIONS
  if (
    !query ||
    !query.settings.featureFlags.includes(GQLFEATURE_FLAG.SECTIONS) ||
    !query.sections
  ) {
    return null;
  }

  return (
    <SectionSelector
      sections={query.sections}
      section={section}
      queueName={queueName}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  query: graphql`
    fragment SectionSelectorContainer_query on Query {
      sections
      settings {
        # FEATURE_FLAG:SECTIONS
        featureFlags
      }
    }
  `,
})(SectionSelectorContainer);

export default enhanced;
