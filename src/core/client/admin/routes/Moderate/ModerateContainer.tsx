import { Match, RouteProps, Router, withRouter } from "found";
import React from "react";
import { graphql } from "react-relay";

import { withRouteConfig } from "coral-framework/lib/router";
import { Spinner } from "coral-ui/components/v2";

import { ModerateContainerQueryResponse } from "coral-admin/__generated__/ModerateContainerQuery.graphql";

import Moderate from "./Moderate";

interface RouteParams {
  storyID?: string;
  siteID?: string;
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
        <Moderate
          moderationQueues={null}
          story={null}
          site={null}
          allStories={allStories}
        >
          <Spinner />
        </Moderate>
      );
    }
    return (
      <Moderate
        moderationQueues={this.props.data.moderationQueues}
        story={this.props.data.story || null}
        site={this.props.data.site || null}
        allStories={allStories}
      >
        {this.props.children}
      </Moderate>
    );
  }
}

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query ModerateContainerQuery(
      $storyID: ID
      $includeStory: Boolean!
      $siteID: ID
      $includeSite: Boolean!
    ) {
      # TODO: paginate
      sites {
        edges {
          node {
            id
            ...SiteSelectorSite_site
          }
        }
      }
      story(id: $storyID) @include(if: $includeStory) {
        ...ModerateNavigationContainer_story
        ...ModerateSearchBarContainer_story
      }
      site(id: $siteID) @include(if: $includeSite) {
        ...ModerateNavigationContainer_site
      }
      moderationQueues(storyID: $storyID, siteID: $siteID) {
        ...ModerateNavigationContainer_moderationQueues
      }
    }
  `,
  cacheConfig: { force: true },
  prepareVariables: (params, match) => {
    return {
      storyID: match.params.storyID,
      siteID: match.params.siteID,
      includeStory: Boolean(match.params.storyID),
      includeSite: Boolean(match.params.siteID),
    };
  },
})(withRouter(ModerateContainer));

export default enhanced;
