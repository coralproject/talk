import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { ReadyState } from "react-relay";

import {
  graphql,
  QueryRenderer,
  withLocalStateContainer,
} from "talk-framework/lib/relay";
import { ProfileQuery as QueryTypes } from "talk-stream/__generated__/ProfileQuery.graphql";
import { ProfileQueryLocal as Local } from "talk-stream/__generated__/ProfileQueryLocal.graphql";
import { Spinner } from "talk-ui/components";

import ProfileContainer from "../containers/ProfileContainer";

interface InnerProps {
  local: Local;
}

export const render = ({
  error,
  props,
}: ReadyState<QueryTypes["response"]>) => {
  if (error) {
    return <div>{error.message}</div>;
  }

  if (props) {
    if (!props.me) {
      return (
        <Localized id="profile-profileQuery-errorLoadingProfile">
          <div>Error loading profile</div>
        </Localized>
      );
    }
    if (!props.asset) {
      return (
        <Localized id="comments-profileQuery-assetNotFound">
          <div>Asset not found</div>
        </Localized>
      );
    }
    return <ProfileContainer me={props.me} asset={props.asset} />;
  }

  return <Spinner />;
};

const ProfileQuery: StatelessComponent<InnerProps> = ({
  local: { assetID, assetURL },
}) => (
  <QueryRenderer<QueryTypes>
    query={graphql`
      query ProfileQuery($assetID: ID, $assetURL: String) {
        asset(id: $assetID, url: $assetURL) {
          ...ProfileContainer_asset
        }
        me {
          ...ProfileContainer_me
        }
      }
    `}
    variables={{
      assetID,
      assetURL,
    }}
    render={render}
  />
);

const enhanced = withLocalStateContainer(
  graphql`
    fragment ProfileQueryLocal on Local {
      assetID
      assetURL
    }
  `
)(ProfileQuery);

export default enhanced;
