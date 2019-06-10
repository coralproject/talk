import { Match, RouteProps, Router, withRouter } from "found";
import React from "react";
import { graphql } from "react-relay";

import { ModerateContainerQueryResponse } from "coral-admin/__generated__/ModerateContainerQuery.graphql";
import { withRouteConfig } from "coral-framework/lib/router";
import { Spinner } from "coral-ui/components";

import Moderate from "./Moderate";

interface RouteParams {
  storyID?: string;
}

interface Props {
  data: ModerateContainerQueryResponse;
  router: Router;
  match: Match & { params: RouteParams };
}

class ModerateContainer extends React.Component<Props> {
  public static routeConfig: RouteProps;

  public render() {
    const allStories = !this.props.match.params.storyID;
    if (!this.props.data) {
      return (
        <Moderate moderationQueues={null} story={null} allStories={allStories}>
          <Spinner />
        </Moderate>
      );
    }
    return (
      <Moderate
        moderationQueues={this.props.data.moderationQueues}
        story={this.props.data.story || null}
        allStories={allStories}
      >
        {this.props.children}
      </Moderate>
    );
  }
}

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query ModerateContainerQuery($storyID: ID, $includeStory: Boolean!) {
      story(id: $storyID) @include(if: $includeStory) {
        ...ModerateNavigationContainer_story
        ...ModerateSearchBarContainer_story
      }
      moderationQueues(storyID: $storyID) {
        ...ModerateNavigationContainer_moderationQueues
      }
    }
  `,
  cacheConfig: { force: true },
  prepareVariables: (params, match) => {
    return {
      storyID: match.params.storyID,
      includeStory: Boolean(match.params.storyID),
    };
  },
})(withRouter(ModerateContainer));

export default enhanced;
