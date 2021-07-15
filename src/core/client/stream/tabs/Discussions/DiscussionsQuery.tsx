import { Localized } from "@fluent/react/compat";
import { once } from "lodash";
import React, { FunctionComponent, Suspense } from "react";
import { graphql } from "react-relay";

import { polyfillCSSVars } from "coral-framework/helpers";
import {
  QueryRenderData,
  QueryRenderer,
  withLocalStateContainer,
} from "coral-framework/lib/relay";
import useHandleIncompleteAccount from "coral-stream/common/useHandleIncompleteAccount";
import { CallOut, Delay, Spinner } from "coral-ui/components/v2";
import { QueryError } from "coral-ui/components/v3";

import { DiscussionsQuery as QueryTypes } from "coral-stream/__generated__/DiscussionsQuery.graphql";
import { DiscussionsQueryLocal as Local } from "coral-stream/__generated__/DiscussionsQueryLocal.graphql";

const loadDiscussionsContainer = () =>
  import("./DiscussionsContainer" /* webpackChunkName: "profile" */).then(
    (x) => {
      // New css is loaded, take care of polyfilling those css vars for IE11.
      void polyfillCSSVars();
      return x;
    }
  );
// (cvle) For some reason without `setTimeout` this request will block other requests.
const preloadDiscussionsContainer = once(() =>
  setTimeout(loadDiscussionsContainer, 0)
);

const LazyDiscussionsContainer = React.lazy(loadDiscussionsContainer);

interface Props {
  local: Local;
}

export const render = ({ error, props }: QueryRenderData<QueryTypes>) => {
  if (error) {
    return <QueryError error={error} />;
  }

  // TODO: use official React API once it has one :-)
  preloadDiscussionsContainer();

  if (props) {
    if (!props.viewer) {
      return (
        <Localized id="discussions-discussionsQuery-errorLoadingProfile">
          <CallOut color="error" fullWidth>
            Error loading profile
          </CallOut>
        </Localized>
      );
    }
    if (!props.story) {
      return (
        <Localized id="discussions-discussionsQuery-storyNotFound">
          <CallOut>Story not found</CallOut>
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

const DiscussionsQuery: FunctionComponent<Props> = ({
  local: { storyID, storyURL },
}) => {
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
        return render(data);
      }}
    />
  );
};

const enhanced = withLocalStateContainer(
  graphql`
    fragment DiscussionsQueryLocal on Local {
      storyID
      storyURL
    }
  `
)(DiscussionsQuery);

export default enhanced;
