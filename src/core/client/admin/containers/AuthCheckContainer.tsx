import { Match, Router, withRouter } from "found";
import React from "react";

import { AuthCheckContainerQueryResponse } from "talk-admin/__generated__/AuthCheckContainerQuery.graphql";
import { SetRedirectPathMutation } from "talk-admin/mutations";
import { AbilityType, can } from "talk-admin/permissions";
import RestrictedContainer from "talk-admin/views/restricted/containers/RestrictedContainer";
import { graphql, MutationProp, withMutation } from "talk-framework/lib/relay";
import { withRouteConfig } from "talk-framework/lib/router";
import { GQLUSER_ROLE } from "talk-framework/schema";

interface Props {
  match: Match;
  router: Router;
  setRedirectPath: MutationProp<typeof SetRedirectPathMutation>;
  data:
    | AuthCheckContainerQueryResponse & {
        route: {
          // An AbilityType can be passed in as the Route data
          // to perform a permission check.
          data?: AbilityType;
        };
      }
    | null;
}

class AuthCheckContainer extends React.Component<Props> {
  private wasLoggedIn = false;
  constructor(props: Props) {
    super(props);
    this.redirectIfNotLoggedIn();
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (nextProps.data && nextProps.data.viewer) {
      this.wasLoggedIn = true;
    }
    this.redirectIfNotLoggedIn(nextProps, this.props);
    if (nextProps.data && !nextProps.data.viewer) {
      this.wasLoggedIn = false;
    }
  }

  private shouldRedirectTo(props: Props = this.props) {
    if (!props.data || props.data.viewer) {
      return false;
    }
    return true;
  }

  private hasAccess(props: Props = this.props) {
    const { viewer } = props.data!;
    if (viewer) {
      if (
        viewer.role === GQLUSER_ROLE.COMMENTER ||
        viewer.role === GQLUSER_ROLE.STAFF ||
        (props.data &&
          props.data.route.data &&
          // Perform permission check on the ability passed in by the route data
          !can(viewer, props.data.route.data))
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
    return <RestrictedContainer viewer={this.props.data.viewer!} />;
  }
}

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query AuthCheckContainerQuery {
      viewer {
        ...RestrictedContainer_viewer
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
})(withRouter(withMutation(SetRedirectPathMutation)(AuthCheckContainer)));

export default enhanced;
