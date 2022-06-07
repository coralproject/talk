import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { SectionFilter } from "coral-common/section";
import { QUEUE_NAME } from "coral-framework/helpers";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLFEATURE_FLAG } from "coral-framework/schema";

import { SectionSelectorContainer_query } from "coral-admin/__generated__/SectionSelectorContainer_query.graphql";

import SectionSelector from "./SectionSelector";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment SectionSelectorContainer_settings on Settings {
    featureFlags
  }
`;

// eslint-disable-next-line no-unused-expressions
const queryFragment = graphql`
  fragment SectionSelectorContainer_query on Query {
    sections
    settings {
      featureFlags
      ...SectionSelectorContainer_settings
    }
  }
`;

interface Props {
  query: SectionSelectorContainer_query | null;

  section?: SectionFilter | null;
  queueName: QUEUE_NAME | undefined;
}

const SectionSelectorContainer: FunctionComponent<Props> = ({
  section,
  queueName,
  query,
}) => {
  // FEATURE_FLAG:SECTIONS
  if (
    !query ||
    !query.settings.featureFlags.includes(GQLFEATURE_FLAG.SECTIONS) ||
    query.sections === null ||
    query.sections.length === 0
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
  query: queryFragment,
})(SectionSelectorContainer);

export default enhanced;
