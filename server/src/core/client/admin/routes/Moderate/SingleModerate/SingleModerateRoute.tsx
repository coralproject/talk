import { noop } from "lodash";
import React, { FunctionComponent, useEffect } from "react";
import { graphql } from "react-relay";

import { useSubscription } from "coral-framework/lib/relay";
import { withRouteConfig } from "coral-framework/lib/router";

import { SingleModerateRouteQueryResponse } from "coral-admin/__generated__/SingleModerateRouteQuery.graphql";

import NotFound from "../../NotFound";
import { LoadingQueue, Queue } from "../Queue";
import SingleModerate from "./SingleModerate";
import SingleModerateSubscription from "./SingleModerateSubscription";

type Props = SingleModerateRouteQueryResponse;

const danglingLogic = () => false;

const SingleModerateRoute: FunctionComponent<Props> = (props) => {
  const subscribeToSingleModerate = useSubscription(SingleModerateSubscription);
  useEffect(() => {
    if (!props.comment) {
      return;
    }
    const disposable = subscribeToSingleModerate({
      commentID: props.comment.id,
    });
    return () => {
      disposable.dispose();
    };
  }, [props.comment, subscribeToSingleModerate]);

  if (!props.viewer) {
    return null;
  }

  if (!props.comment) {
    return <NotFound />;
  }

  return (
    <SingleModerate>
      <Queue
        comments={[props.comment]}
        settings={props.settings}
        viewer={props.viewer}
        onLoadMore={noop}
        hasLoadMore={false}
        disableLoadMore={false}
        danglingLogic={danglingLogic}
        showStoryInfo
      />
    </SingleModerate>
  );
};

const enhanced = withRouteConfig<Props, SingleModerateRouteQueryResponse>({
  query: graphql`
    query SingleModerateRouteQuery($commentID: ID!) {
      comment(id: $commentID) {
        id
        ...ModerateCardContainer_comment
      }
      settings {
        ...ModerateCardContainer_settings
      }
      viewer {
        ...ModerateCardContainer_viewer
      }
    }
  `,
  cacheConfig: { force: true },
  render: function SingleModerateRouteRender({ Component, data }) {
    if (Component && data) {
      return <Component {...data} />;
    }
    return <LoadingQueue />;
  },
})(SingleModerateRoute);

export default enhanced;
