import { Match, Router, withRouter } from "found";
import React from "react";

import { SetRedirectPathMutation } from "coral-admin/mutations";
import { AbilityType, can } from "coral-admin/permissions";
import { roleIsAtLeast } from "coral-framework/helpers";
import { graphql, MutationProp, withMutation } from "coral-framework/lib/relay";
import { withRouteConfig } from "coral-framework/lib/router";
import { GQLUSER_ROLE } from "coral-framework/schema";

import { AuthCheckRouteQueryResponse } from "coral-admin/__generated__/AuthCheckRouteQuery.graphql";

import RestrictedContainer from "./RestrictedContainer";

interface Props {
  match: Match;
  router: Router;
  setRedirectPath: MutationProp<typeof SetRedirectPathMutation>;
  data: AuthCheckRouteQueryResponse;
}

type CheckParams =
  | {
      role: GQLUSER_ROLE;
      ability?: AbilityType;
    }
  | {
      role?: GQLUSER_ROLE;
      ability: AbilityType;
    };

function createAuthCheckRoute(check: CheckParams) {
  class AuthCheckRoute extends React.Component<Props> {
    private wasLoggedIn = false;
    constructor(props: Props) {
      super(props);
      this.redirectIfNotLoggedIn();
    }

    public UNSAFE_componentWillReceiveProps(nextProps: Props) {
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
      const { viewer } = props.data;
      if (viewer) {
        if (
          (check.role && !roleIsAtLeast(viewer.role, check.role)) ||
          (check.ability && !can(viewer, check.ability))
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
      query AuthCheckRouteQuery {
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
  })(withRouter(withMutation(SetRedirectPathMutation)(AuthCheckRoute)));
  return enhanced;
}

export default createAuthCheckRoute;
