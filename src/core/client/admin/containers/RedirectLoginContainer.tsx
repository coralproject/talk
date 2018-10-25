import { Match, Router, withRouter } from "found";
import React from "react";

import { RedirectLoginContainerLocal as Local } from "talk-admin/__generated__/RedirectLoginContainerLocal.graphql";
import { graphql, withLocalStateContainer } from "talk-framework/lib/relay";

interface Props {
  local: Local;
  match: Match;
  router: Router;
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
      this.props.router.replace("/admin/login");
    }
  }

  public render() {
    return <>{this.props.children}</>;
  }
}

const enhanced = withRouter(
  withLocalStateContainer(
    graphql`
      fragment RedirectLoginContainerLocal on Local {
        loggedIn
      }
    `
  )(RedirectLoginContainer)
);

export default enhanced;
