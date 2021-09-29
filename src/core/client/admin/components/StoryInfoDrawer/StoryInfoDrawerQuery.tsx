import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderData, QueryRenderer } from "coral-framework/lib/relay";
import { Spinner } from "coral-ui/components/v2";
import { QueryError } from "coral-ui/components/v3";

import StoryInfoDrawerContainer from "./StoryInfoDrawerContainer";

import { StoryInfoDrawerQuery as QueryTypes } from "coral-admin/__generated__/StoryInfoDrawerQuery.graphql";

export interface Props {
  storyID: string;
  onClose: () => void;
}

const StoryInfoDrawerQuery: FunctionComponent<Props> = ({
  storyID,
  onClose,
}) => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query StoryInfoDrawerQuery($storyID: ID!) {
          story(id: $storyID) {
            id
            url
            status
            scrapedAt
            metadata {
              title
              author
              publishedAt
            }
          }
        }
      `}
      variables={{ storyID }}
      render={({ props, error }: QueryRenderData<QueryTypes>) => {
        if (error) {
          return <QueryError error={error} />;
        }

        if (!props || !props.story) {
          return (
            <div>
              <Spinner />
            </div>
          );
        }

        return (
          <StoryInfoDrawerContainer onClose={onClose} story={props.story} />
        );
      }}
    />
  );
};

export default StoryInfoDrawerQuery;
