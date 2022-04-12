import { Localized } from "@fluent/react/compat";
import { once } from "lodash";
import React, { FunctionComponent, Suspense } from "react";
import { graphql } from "react-relay";

import { polyfillCSSVars } from "coral-framework/helpers";
import { useCoralContext } from "coral-framework/lib/bootstrap/CoralContext";
import { QueryRenderData, QueryRenderer } from "coral-framework/lib/relay";
import useHandleIncompleteAccount from "coral-stream/common/useHandleIncompleteAccount";
import { useStreamLocal } from "coral-stream/local/StreamLocal";
import { CallOut, Delay, Spinner } from "coral-ui/components/v2";
import { QueryError } from "coral-ui/components/v3";

import { DiscussionsQuery as QueryTypes } from "coral-stream/__generated__/DiscussionsQuery.graphql";

const loadDiscussionsContainer = () =>
  import("./DiscussionsContainer" /* webpackChunkName: "profile" */);

// (cvle) For some reason without `setTimeout` this request will block other requests.
const preloadAndPolyfill = once((window: Window) =>
  setTimeout(() => {
    void loadDiscussionsContainer().then((x) => {
      // New css is loaded, take care of polyfilling those css vars for IE11.
      void polyfillCSSVars(window);
      return x;
    });
  }, 0)
);

const LazyDiscussionsContainer = React.lazy(loadDiscussionsContainer);

export const render = (
  { error, props }: QueryRenderData<QueryTypes>,
  window: Window
) => {
  if (error) {
    return <QueryError error={error} />;
  }

  preloadAndPolyfill(window);

  if (props) {
    if (!props.viewer) {
      return (
        <Localized id="discussions-discussionsQuery-errorLoadingProfile">
          <CallOut color="error" fullWidth aria-live="polite">
            Error loading profile
          </CallOut>
        </Localized>
      );
    }
    if (!props.story) {
      return (
        <Localized id="discussions-discussionsQuery-storyNotFound">
          <CallOut aria-live="polite">Story not found</CallOut>
        </Localized>
      );
    }
    return (
      <Suspense fallback={<Spinner />}>
        <LazyDiscussionsContainer
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

const DiscussionsQuery: FunctionComponent = () => {
  const { window } = useCoralContext();
  const { storyID, storyURL } = useStreamLocal();

  const handleIncompleteAccount = useHandleIncompleteAccount();
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query DiscussionsQuery($storyID: ID, $storyURL: String) {
          story: stream(id: $storyID, url: $storyURL) {
            ...DiscussionsContainer_story
          }
          viewer {
            ...DiscussionsContainer_viewer
          }
          settings {
            ...DiscussionsContainer_settings
          }
        }
      `}
      variables={{
        storyID,
        storyURL,
      }}
      render={(data) => {
        if (handleIncompleteAccount(data)) {
          return null;
        }
        return render(data, window);
      }}
    />
  );
};

export default DiscussionsQuery;
