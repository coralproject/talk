import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { ReadyState } from "react-relay";
import { graphql, QueryRenderer } from "talk-framework/lib/relay";
import { ProfileQuery as QueryTypes } from "talk-stream/__generated__/ProfileQuery.graphql";
import { Spinner } from "talk-ui/components";
import ProfileContainer from "../containers/ProfileContainer";

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
        <div>
          <Localized id="general-profileQuery-errorLoading">
            <span>Error loading profile</span>
          </Localized>
        </div>
      );
    }
    return <ProfileContainer me={props.me} />;
  }

  return <Spinner />;
};

const ProfileQuery: StatelessComponent = () => (
  <QueryRenderer<QueryTypes>
    query={graphql`
      query ProfileQuery {
        me {
          ...ProfileContainer_me
        }
      }
    `}
    variables={{}}
    render={render}
  />
);

export default ProfileQuery;
