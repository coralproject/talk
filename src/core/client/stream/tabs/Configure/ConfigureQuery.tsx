import { Localized } from "@fluent/react/compat";
import { once } from "lodash";
import React, { FunctionComponent, Suspense } from "react";
import { graphql } from "react-relay";

import { useCoralContext } from "coral-framework/lib/bootstrap/CoralContext";
import {
  QueryRenderData,
  QueryRenderer,
  withLocalStateContainer,
} from "coral-framework/lib/relay";
import { Delay, Spinner } from "coral-ui/components/v2";
import { QueryError } from "coral-ui/components/v3";

import { ConfigureQuery as QueryTypes } from "coral-stream/__generated__/ConfigureQuery.graphql";
import { ConfigureQueryLocal as Local } from "coral-stream/__generated__/ConfigureQueryLocal.graphql";

const loadConfigureContainer = () =>
  import("./ConfigureContainer" /* webpackChunkName: "configure" */);

// (cvle) For some reason without `setTimeout` this request will block other requests.
const preload = once((window: Window) =>
  setTimeout(() => {
    void loadConfigureContainer();
  }, 0)
);

const LazyConfigureContainer = React.lazy(loadConfigureContainer);

interface Props {
  local: Local;
}

export const render = (
  { error, props }: QueryRenderData<QueryTypes>,
  window: Window
) => {
  if (error) {
    return <QueryError error={error} />;
  }

  preload(window);

  if (props) {
    if (!props.viewer) {
      return (
        <Localized id="configure-configureQuery-errorLoadingConfigure">
          <div>Error loading configure</div>
        </Localized>
      );
    }
    if (!props.story) {
      return (
        <Localized id="configure-configureQuery-storyNotFound">
          <div>Story not found</div>
        </Localized>
      );
    }
    return (
      <Suspense fallback={<Spinner />}>
        <LazyConfigureContainer
          viewer={props.viewer}
          story={props.story}
          settings={props.settings}
        />
      </Suspense>
    );
  }

  return (
    <Delay>
      <Spinner />
    </Delay>
  );
};

const ConfigureQuery: FunctionComponent<Props> = ({
  local: { storyID, storyURL },
}) => {
  const { window } = useCoralContext();
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query ConfigureQuery($storyID: ID, $storyURL: String) {
          story(id: $storyID, url: $storyURL) {
            ...ConfigureContainer_story
          }
          viewer {
            ...ConfigureContainer_viewer
          }
          settings {
            ...ConfigureContainer_settings
          }
        }
      `}
      variables={{
        storyID,
        storyURL,
      }}
      render={(data) => {
        return render(data, window);
      }}
    />
  );
};

const enhanced = withLocalStateContainer(
  graphql`
    fragment ConfigureQueryLocal on Local {
      storyID
      storyURL
    }
  `
)(ConfigureQuery);

export default enhanced;
