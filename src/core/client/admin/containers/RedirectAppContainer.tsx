import { Match, Router, withRouter } from "found";
import React from "react";

import { RedirectAppContainerLocal as Local } from "talk-admin/__generated__/RedirectAppContainerLocal.graphql";
import { graphql, withLocalStateContainer } from "talk-framework/lib/relay";

interface Props {
  local: Local;
  match: Match;
  router: Router;
}

class RedirectAppContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.redirectIfLoggedIn();
  }

  public componentWillReceiveProps() {
    this.redirectIfLoggedIn();
  }

  private redirectIfLoggedIn() {
    if (this.props.local.loggedIn) {
      this.props.router.replace("/admin");
    }
  }

  public render() {
    return <>{this.props.children}</>;
  }
}

const enhanced = withRouter(
  withLocalStateContainer(
    graphql`
      fragment RedirectAppContainerLocal on Local {
        loggedIn
      }
    `
  )(RedirectAppContainer)
);

export default enhanced;
