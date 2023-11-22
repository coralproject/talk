import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderer, useLocal } from "coral-framework/lib/relay";
import { QueryError } from "coral-ui/components/v3";

import { TabBarQuery as QueryTypes } from "coral-stream/__generated__/TabBarQuery.graphql";
import { TabBarQueryLocal } from "coral-stream/__generated__/TabBarQueryLocal.graphql";

import ErrorReporterSetUserContainer from "./ErrorReporterSetUserContainer";
import TabBarContainer from "./TabBarContainer";

const TabBarQuery: FunctionComponent = () => {
  const [{ storyID, storyURL, hasNewNotifications }, setLocal] =
    useLocal<TabBarQueryLocal>(graphql`
      fragment TabBarQueryLocal on Local {
        storyID
        storyURL
        hasNewNotifications
      }
    `);

  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query TabBarQuery($storyID: ID, $storyURL: String) {
          viewer {
            ...TabBarContainer_viewer
            ...ErrorReporterSetUserContainer_viewer
            hasNewNotifications
          }
          story(id: $storyID, url: $storyURL) {
            ...TabBarContainer_story
          }
          settings {
            ...TabBarContainer_settings
          }
        }
      `}
      variables={{
        storyID,
        storyURL,
      }}
      render={({ error, props }) => {
        if (error) {
          return <QueryError error={error} />;
        }

        const ErrorReporterSetUser = props ? (
          <ErrorReporterSetUserContainer viewer={props.viewer} />
        ) : null;

        if (hasNewNotifications === null) {
          setLocal({
            hasNewNotifications:
              props && props.viewer ? props.viewer.hasNewNotifications : false,
          });
        }

        return (
          <>
            {ErrorReporterSetUser}
            <TabBarContainer
              settings={(props && props.settings) || null}
              story={(props && props.story) || null}
              viewer={(props && props.viewer) || null}
            />
          </>
        );
      }}
    />
  );
};

export default TabBarQuery;
