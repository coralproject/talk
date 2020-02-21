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
    // TODO: (tessalt) get active route in a better way
    const queueName = [
      "default",
      "reported",
      "pending",
      "unmoderated",
      "approved",
      "rejected",
    ].find(name => {
      return this.props.match.location.pathname.includes(name);
    });
    if (!this.props.data) {
      return (
        <Moderate
          moderationQueues={null}
          story={null}
          settings={null}
          siteID={null}
          query={this.props.data}
          routeParams={this.props.match.params}
          queueName={queueName || "default"}
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
        siteID={this.props.data.story ? this.props.data.story.site.id : null}
        routeParams={this.props.match.params}
        query={this.props.data}
        allStories={allStories}
        settings={this.props.data.settings}
        queueName={queueName || "default"}
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
    ) {
      settings {
        ...ModerateSearchBarContainer_settings
      }
      story(id: $storyID) @include(if: $includeStory) {
        ...ModerateNavigationContainer_story
        ...ModerateSearchBarContainer_story
        site {
          id
        }
      }
      moderationQueues(storyID: $storyID, siteID: $siteID) {
        ...ModerateNavigationContainer_moderationQueues
      }
      ...SiteSelectorContainer_query
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
