import { Match, Router, withRouter } from "found";
import React from "react";

import { RedirectLoginContainerLocal as Local } from "talk-admin/__generated__/RedirectLoginContainerLocal.graphql";
import {
  SetRedirectPathMutation,
  withSetRedirectPathMutation,
} from "talk-admin/mutations";
import { graphql, withLocalStateContainer } from "talk-framework/lib/relay";

interface Props {
  local: Local;
  match: Match;
  router: Router;
  setRedirectPath: SetRedirectPathMutation;
}

class RedirectLoginContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.redirectIfNotLoggedIn();
  }

  public componentWillReceiveProps() {
    this.redirectIfNotLoggedIn();
  }

  private redirectIfNotLoggedIn() {
    if (!this.props.local.loggedIn) {
      const location = this.props.match.location;
      this.props.setRedirectPath({
        path: location.pathname + location.search + location.hash,
      });
      this.props.router.replace("/admin/login");
    }
  }

  public render() {
    return this.props.children;
  }
}

const enhanced = withRouter(
  withSetRedirectPathMutation(
    withLocalStateContainer(
      graphql`
        fragment RedirectLoginContainerLocal on Local {
          loggedIn
        }
      `
    )(RedirectLoginContainer)
  )
);

export default enhanced;
