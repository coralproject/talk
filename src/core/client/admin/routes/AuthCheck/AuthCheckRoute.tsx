import { Match, Router, withRouter } from "found";
import React from "react";
import { graphql } from "react-relay";

import { SetRedirectPathMutation } from "coral-admin/mutations";
import { AbilityType, can } from "coral-admin/permissions";
import { roleIsAtLeast } from "coral-framework/helpers";
import { CoralContext, withContext } from "coral-framework/lib/bootstrap";
import { MutationProp, withMutation } from "coral-framework/lib/relay";
import { withRouteConfig } from "coral-framework/lib/router";
import { GQLUSER_ROLE } from "coral-framework/schema";

import { AuthCheckRouteQueryResponse } from "coral-admin/__generated__/AuthCheckRouteQuery.graphql";

import NetworkError from "./NetworkError";
import RestrictedContainer from "./RestrictedContainer";

interface Props {
  reporter: CoralContext["reporter"];
  match: Match;
  router: Router;
  setRedirectPath: MutationProp<typeof SetRedirectPathMutation>;
  data: AuthCheckRouteQueryResponse;
  error: Error | null;
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
      void this.redirectIfNotLoggedIn();
    }

    public UNSAFE_componentWillReceiveProps(nextProps: Props) {
      if (nextProps.data && nextProps.data.viewer) {
        this.wasLoggedIn = true;
      }
      void this.redirectIfNotLoggedIn(nextProps, this.props);
      if (nextProps.data && !nextProps.data.viewer) {
        this.wasLoggedIn = false;
      }
    }

    private shouldRedirectTo(props: Props = this.props) {
      if (!props.data || (props.data.viewer && props.data.viewer.email)) {
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

    public componentDidUpdate(prevProps: Props) {
      // Whenever the viewer changes on this component, update the user on the
      // reporter.
      if (!this.props.reporter) {
        return;
      }

      // Pull the viewer out of the next props (`this.props`) and the current
      // props (`prevProps`) to compare them.
      const next = this.props.data?.viewer || null;
      const curr = prevProps.data?.viewer || null;

      // If the next is different than current, then...
      if (next !== curr) {
        // If they are both provided then if the id of the viewer didn't change,
        // then the user hasn't changed (at least, it hasn't changed enough to
        // require another update to the reporter).
        if (next && curr && next.id === curr.id) {
          return;
        }

        this.props.reporter.setUser(next);
      }
    }

    public render() {
      if (this.props.error) {
        return <NetworkError />;
      }

      if (!this.props.data || this.shouldRedirectTo()) {
        return null;
      }

      if (this.hasAccess()) {
        return this.props.children;
      }

      return <RestrictedContainer viewer={this.props.data.viewer} />;
    }
  }

  const enhanced = withRouteConfig<Props>({
    query: graphql`
      query AuthCheckRouteQuery {
        viewer {
          ...RestrictedContainer_viewer
          id
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
  })(
    withContext(({ reporter }) => ({ reporter }))(
      withRouter(withMutation(SetRedirectPathMutation)(AuthCheckRoute))
    )
  );

  return enhanced;
}

export default createAuthCheckRoute;
