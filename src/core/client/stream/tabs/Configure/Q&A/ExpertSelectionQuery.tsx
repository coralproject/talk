import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderer } from "coral-framework/lib/relay";
import { Flex, Spinner } from "coral-ui/components/v2";
import { QueryError } from "coral-ui/components/v3";

import { ExpertSelectionQuery as QueryTypes } from "coral-stream/__generated__/ExpertSelectionQuery.graphql";

import ExpertSelectionContainer from "./ExpertSelectionContainer";

interface Props {
  storyID: string;
}

const ExpertSelectionQuery: FunctionComponent<Props> = ({ storyID }) => (
  <QueryRenderer<QueryTypes>
    query={graphql`
      query ExpertSelectionQuery($storyID: ID) {
        ...ExpertSelectionContainer_query @arguments(storyID: $storyID)
      }
    `}
    cacheConfig={{ force: true }}
    variables={{
      storyID,
    }}
    render={({ error, props }: any) => {
      if (error) {
        return <QueryError error={error} />;
      }
      if (!props) {
        return (
          <Flex justifyContent="center">
            <Spinner />
          </Flex>
        );
      }

      return <ExpertSelectionContainer query={props} storyID={storyID} />;
    }}
  />
);

export default ExpertSelectionQuery;
