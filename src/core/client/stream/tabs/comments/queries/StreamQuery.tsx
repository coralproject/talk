import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { ReadyState } from "react-relay";
import {
  graphql,
  QueryRenderer,
  withLocalStateContainer,
} from "talk-framework/lib/relay";
import { StreamQuery as QueryTypes } from "talk-stream/__generated__/StreamQuery.graphql";
import { StreamQueryLocal as Local } from "talk-stream/__generated__/StreamQueryLocal.graphql";
import { Spinner } from "talk-ui/components";
import StreamContainer from "../containers/StreamContainer";

interface Props {
  local: Local;
}

export const render = (
  data: ReadyState<QueryTypes["response"]>,
  defaultStreamOrderBy: Props["local"]["defaultStreamOrderBy"]
) => {
  if (data.error) {
    return <div>{data.error.message}</div>;
  }

  if (data.props) {
    if (!data.props.asset) {
      return (
        <Localized id="comments-streamQuery-assetNotFound">
          <div>Asset not found</div>
        </Localized>
      );
    }
    return (
      <StreamContainer
        settings={data.props.settings}
        me={data.props.me}
        asset={data.props.asset}
        defaultOrderBy={defaultStreamOrderBy}
      />
    );
  }

  return <Spinner />;
};

const StreamQuery: StatelessComponent<Props> = props => {
  const {
    local: { assetID, assetURL, defaultStreamOrderBy },
  } = props;
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query StreamQuery(
          $assetID: ID
          $assetURL: String
          $streamOrderBy: COMMENT_SORT
        ) {
          me {
            ...StreamContainer_me
          }
          asset(id: $assetID, url: $assetURL) {
            ...StreamContainer_asset @arguments(orderBy: $streamOrderBy)
          }
          settings {
            ...StreamContainer_settings
          }
        }
      `}
      variables={{
        assetID,
        assetURL,
        streamOrderBy: defaultStreamOrderBy,
      }}
      render={data => render(data, props.local.defaultStreamOrderBy)}
    />
  );
};

const enhanced = withLocalStateContainer(
  graphql`
    fragment StreamQueryLocal on Local {
      assetID
      assetURL
      defaultStreamOrderBy
    }
  `
)(StreamQuery);

export default enhanced;
