import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderData, QueryRenderer } from "coral-framework/lib/relay";
import { Spinner } from "coral-ui/components/v2";
import { QueryError } from "coral-ui/components/v3";

import StoryInfoDrawerContainer from "./StoryInfoDrawerContainer";

import { StoryInfoDrawerQuery as QueryTypes } from "coral-admin/__generated__/StoryInfoDrawerQuery.graphql";

export interface Props {
  storyID: string;
}

const StoryInfoDrawerQuery: FunctionComponent<Props> = ({ storyID }) => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query StoryInfoDrawerQuery($storyID: ID!) {
          story(id: $storyID) {
            ...StoryInfoDrawerContainer_story
          }
          settings {
            ...StoryInfoDrawerContainer_settings
          }
          viewer {
            ...StoryInfoDrawerContainer_viewer
          }
        }
      `}
      variables={{ storyID }}
      render={({ props, error }: QueryRenderData<QueryTypes>) => {
        if (error) {
          return <QueryError error={error} />;
        }

        if (!props || !props.story || !props.viewer) {
          return (
            <div>
              <Spinner />
            </div>
          );
        }

        return (
          <StoryInfoDrawerContainer
            story={props.story}
            settings={props.settings}
            viewer={props.viewer}
          />
        );
      }}
    />
  );
};

export default StoryInfoDrawerQuery;
