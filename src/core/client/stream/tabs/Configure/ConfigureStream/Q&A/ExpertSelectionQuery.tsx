import React, { FunctionComponent } from "react";
import { graphql, ReadyState } from "react-relay";

import { QueryRenderer } from "coral-framework/lib/relay";
import { Flex, Spinner } from "coral-ui/components";

import { ExpertSelectionQuery as QueryTypes } from "coral-stream/__generated__/ExpertSelectionQuery.graphql";

import ExpertSelectionContainer from "./ExpertSelectionContainer";

const ExpertSelectionQuery: FunctionComponent = () => (
  <QueryRenderer<QueryTypes>
    query={graphql`
      query ExpertSelectionQuery {
        ...ExpertSelectionContainer_query
      }
    `}
    cacheConfig={{ force: true }}
    variables={{}}
    render={({ error, props }: ReadyState<QueryTypes["response"]>) => {
      if (error) {
        return <div>{error.message}</div>;
      }
      if (!props) {
        return (
          <Flex justifyContent="center">
            <Spinner />
          </Flex>
        );
      }

      return <ExpertSelectionContainer query={props} />;
    }}
  />
);

export default ExpertSelectionQuery;
