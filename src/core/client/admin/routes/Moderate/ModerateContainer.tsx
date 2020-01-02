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
      "rejected",
    ].find(name => {
      return this.props.match.location.pathname.match(name);
    });
    if (!this.props.data) {
      return (
        <Moderate
          moderationQueues={null}
          story={null}
          site={null}
          sites={[]}
          routeParams={this.props.match.params}
          queueName={queueName || "default"}
          allStories={allStories}
        >
          <Spinner />
        </Moderate>
      );
    }
    const sites = this.props.data.sites
      ? this.props.data.sites.edges.map(edge => edge.node)
      : [];

    return (
      <Moderate
        moderationQueues={this.props.data.moderationQueues}
        story={this.props.data.story || null}
        site={this.props.data.site || null}
        routeParams={this.props.match.params}
        sites={sites}
        allStories={allStories}
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
      $includeSite: Boolean!
    ) {
      # TODO: paginate
      sites {
        edges {
          node {
            id
            ...SiteSelectorSite_site
            ...SiteSelectorSelected_site
          }
        }
      }
      story(id: $storyID) @include(if: $includeStory) {
        ...ModerateNavigationContainer_story
        ...ModerateSearchBarContainer_story
      }
      site(id: $siteID) @include(if: $includeSite) {
        id
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
