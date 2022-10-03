import { useRouter } from "found";
import React, { FunctionComponent, useEffect, useMemo } from "react";
import { graphql } from "react-relay";

import { getModerationLink, QUEUE_NAME } from "coral-framework/helpers";
import parseModerationOptions from "coral-framework/helpers/parseModerationOptions";
import { withRouteConfig } from "coral-framework/lib/router";
import { Spinner } from "coral-ui/components/v2";

import { ModerateContainerQueryResponse } from "coral-admin/__generated__/ModerateContainerQuery.graphql";

import Moderate from "./Moderate";

interface Props {
  data: ModerateContainerQueryResponse | null;
  children?: React.ReactNode;
}

const queueNames: QUEUE_NAME[] = [
  "reported",
  "pending",
  "unmoderated",
  "approved",
  "rejected",
  "review",
];

const ModerateContainer: FunctionComponent<Props> = ({ data, children }) => {
  const { match, router } = useRouter();
  const allStories = !match.params.storyID;
  const queueName = useMemo(
    () =>
      // TODO: (tessalt) get active route in a better way
      queueNames.find((name) => match.location.pathname.includes(name)),
    [match.location.pathname]
  );

  // This guard is used to ensure that the current viewer has permission to
  // moderate on this site. It's injected here because we get the result from
  // relay here for the site that is referenced if this is supposed to moderate
  // a story.
  useEffect(() => {
    // Wait for the data and viewer to become available.
    if (!data || !data.viewer) {
      return;
    }

    // If the viewer isn't moderation scoped, nothing we need to do!
    if (
      !data.viewer.moderationScopes?.scoped ||
      !data.viewer.moderationScopes.sites
    ) {
      return;
    }

    // Grab a reference for the following function to make the type checker
    // happy.
    const sites = data.viewer.moderationScopes.sites;
    const redirect = () =>
      router.push(
        getModerationLink({
          queue: queueName,
          // We'll grab the first site in the moderation scopes (a user can only
          // be scoped if there is at least one site).
          siteID: sites[0].id,
        })
      );

    // If we've loaded a specific story, we'll have the site on that story too,
    // so check if we're allowed to moderate it.
    if (data.story) {
      if (!data.story.site.canModerate) {
        redirect();
        return;
      }

      // The viewer can moderate this site on the story!
      return;
    }

    // Get some options from the router.
    const { siteID } = parseModerationOptions(match);

    // If the viewer is moderation scoped, they cannot moderate under all sites.
    if (!siteID) {
      redirect();
      return;
    }

    // Check to see if the user is allowed to moderate on this site given that
    // they are already scoped. If the current site ID is not found, redirect
    // them!
    if (!sites.some(({ id }) => id === siteID)) {
      redirect();
      return;
    }
  }, [router, match, data, queueName]);

  // Get some options for the moderate cards.
  const { section } = parseModerationOptions(match);

  if (!data) {
    return (
      <Moderate
        moderationQueues={null}
        story={null}
        settings={null}
        siteID={null}
        section={section}
        query={data}
        viewer={null}
        routeParams={match.params}
        queueName={queueName}
        allStories={allStories}
      >
        <Spinner />
      </Moderate>
    );
  }

  return (
    <Moderate
      moderationQueues={data.moderationQueues}
      story={data.story || null}
      siteID={data.story?.site.id || null}
      section={section}
      routeParams={match.params}
      query={data}
      viewer={data.viewer}
      allStories={allStories}
      settings={data.settings}
      queueName={queueName}
      isArchived={data.story?.isArchived || data.story?.isArchiving}
    >
      {children}
    </Moderate>
  );
};

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query ModerateContainerQuery(
      $storyID: ID
      $includeStory: Boolean!
      $siteID: ID
      $section: SectionFilter
    ) {
      ...SiteSelectorContainer_query
      ...SectionSelectorContainer_query

      settings {
        ...ModerateSearchBarContainer_settings
        ...ModerateNavigationContainer_settings
      }

      story(id: $storyID) @include(if: $includeStory) {
        ...ModerateNavigationContainer_story
        ...ModerateSearchBarContainer_story

        site {
          id
          canModerate
        }
        isArchived
        isArchiving
      }

      moderationQueues(storyID: $storyID, siteID: $siteID, section: $section) {
        ...ModerateNavigationContainer_moderationQueues
      }

      viewer {
        ...SiteSelectorContainer_viewer

        id
        role
        moderationScopes {
          scoped
          sites {
            id
          }
        }
      }
    }
  `,
  cacheConfig: { force: true },
  prepareVariables: (params, match) => {
    const { storyID, siteID, section } = parseModerationOptions(match);

    return {
      storyID,
      siteID,
      section,
      includeStory: !!storyID,
    };
  },
})(ModerateContainer);

export default enhanced;
