import { Match, Router, withRouter } from "found";
import React from "react";

import { TalkContext, withContext } from "talk-framework/lib/bootstrap";
import { getMessage } from "talk-framework/lib/i18n";

interface Props {
  localeBundles: TalkContext["localeBundles"];
  router: Router;
  active: boolean;
  match: Match;
}

class NavigationWarningContainer extends React.Component<Props> {
  private removeTransitionHook: () => void;

  constructor(props: Props) {
    super(props);

    const warningMessage = getMessage(
      props.localeBundles,
      "configure-unsavedInputWarning",
      "You have unsaved input. Are you sure you want to leave this page?"
    );

    this.removeTransitionHook = props.router.addTransitionHook(() =>
      this.props.active ? warningMessage : true
    );
  }

  public componentWillUnmount() {
    this.removeTransitionHook();
  }

  public render() {
    return null;
  }
}

const enhanced = withContext(({ localeBundles }) => ({ localeBundles }))(
  withRouter(NavigationWarningContainer)
);
export default enhanced;
