import { Match, Router, withRouter } from "found";
import React from "react";

import { AuthCheckContainerQueryResponse } from "talk-admin/__generated__/AuthCheckContainerQuery.graphql";
import {
  SetRedirectPathMutation,
  withSetRedirectPathMutation,
} from "talk-admin/mutations";
import RestrictedContainer from "talk-admin/views/restricted/containers/RestrictedContainer";
import { graphql } from "talk-framework/lib/relay";
import { withRouteConfig } from "talk-framework/lib/router";

interface Props {
  match: Match;
  router: Router;
  setRedirectPath: SetRedirectPathMutation;
  data: AuthCheckContainerQueryResponse | null;
}

class AuthCheckContainer extends React.Component<Props> {
  private wasLoggedIn = false;
  constructor(props: Props) {
    super(props);
    this.redirectIfNotLoggedIn();
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (nextProps.data && nextProps.data.me) {
      this.wasLoggedIn = true;
    }
    this.redirectIfNotLoggedIn(nextProps, this.props);
    if (nextProps.data && !nextProps.data.me) {
      this.wasLoggedIn = false;
    }
  }

  private shouldRedirectTo(props: Props = this.props) {
    if (!props.data || props.data.me) {
      return false;
    }
    return true;
  }

  private hasAccess(props: Props = this.props) {
    const {
      me,
      settings: { auth },
    } = props.data!;
    if (me) {
      if (me.role === "COMMENTER") {
        return false;
      } else if (
        !me.email ||
        !me.username ||
        (!me.profiles.some(p => p.__typename === "LocalProfile") &&
          auth.integrations.local.enabled &&
          (auth.integrations.local.targetFilter.admin ||
            auth.integrations.local.targetFilter.stream))
      ) {
        return false;
      }
      return true;
    }
    return false;
  }

  private async redirectIfNotLoggedIn(
    props: Props = this.props,
    prevProps: Props | null = null
  ) {
    if (!this.shouldRedirectTo(props)) {
      return;
    }
    // If I was previously logged in then logged out, we don't need to set the redirect path.
    if (!this.wasLoggedIn) {
      const location = props.match.location;
      await props.setRedirectPath({
        path: location.pathname + location.search + location.hash,
      });
    }
    props.router.replace("/admin/login");
  }

  public render() {
    if (!this.props.data || this.shouldRedirectTo()) {
      return null;
    }
    if (this.hasAccess()) {
      return this.props.children;
    }
    return <RestrictedContainer me={this.props.data.me!} />;
  }
}

const enhanced = withRouteConfig({
  query: graphql`
    query AuthCheckContainerQuery {
      me {
        ...RestrictedContainer_me
        username
        email
        profiles {
          __typename
        }
        role
      }
      settings {
        auth {
          integrations {
            local {
              enabled
              targetFilter {
                admin
                stream
              }
            }
          }
        }
      }
    }
  `,
})(withRouter(withSetRedirectPathMutation(AuthCheckContainer)));

export default enhanced;
