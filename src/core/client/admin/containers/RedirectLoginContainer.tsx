import { Match, Router, withRouter } from "found";
import React from "react";

import { RedirectLoginContainerQueryResponse } from "talk-admin/__generated__/RedirectLoginContainerQuery.graphql";
import {
  SetRedirectPathMutation,
  withSetRedirectPathMutation,
} from "talk-admin/mutations";
import { graphql } from "talk-framework/lib/relay";
import { withRouteConfig } from "talk-framework/lib/router";

interface Props {
  match: Match;
  router: Router;
  setRedirectPath: SetRedirectPathMutation;
  data: RedirectLoginContainerQueryResponse | null;
}

class RedirectLoginContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.redirectIfNotLoggedIn();
  }

  public componentWillReceiveProps(nextProps: Props) {
    this.redirectIfNotLoggedIn(nextProps);
  }

  private shouldRedirectTo(props: Props = this.props): string | null {
    if (!props.data) {
      return null;
    }
    const {
      viewer,
      settings: { auth },
    } = props.data!;
    if (viewer) {
      if (viewer.role === "COMMENTER") {
        return "/admin/login";
      } else if (
        !viewer.email ||
        !viewer.username ||
        (!viewer.profiles.some(p => p.__typename === "LocalProfile") &&
          auth.integrations.local.enabled &&
          (auth.integrations.local.targetFilter.admin ||
            auth.integrations.local.targetFilter.stream))
      ) {
        return "/admin/login";
      }
      return "";
    }
    return "/admin/login";
  }

  private redirectIfNotLoggedIn(props: Props = this.props) {
    const redirect = this.shouldRedirectTo(props);
    if (redirect) {
      const location = props.match.location;
      props.setRedirectPath({
        path: location.pathname + location.search + location.hash,
      });
      props.router.replace(redirect);
    }
  }

  public render() {
    if (this.shouldRedirectTo()) {
      return null;
    }
    return this.props.children;
  }
}

const enhanced = withRouteConfig({
  query: graphql`
    query RedirectLoginContainerQuery {
      viewer {
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
})(withRouter(withSetRedirectPathMutation(RedirectLoginContainer)));

export default enhanced;
