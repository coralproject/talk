import { Match, Router, withRouter } from "found";
import React from "react";

import { CoralContext, withContext } from "coral-framework/lib/bootstrap";
import { getMessage } from "coral-framework/lib/i18n";

interface Props {
  localeBundles: CoralContext["localeBundles"];
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
      "You have unsaved changes. Are you sure you want to continue?"
    );

    this.removeTransitionHook = props.router.addTransitionHook(() =>
      this.props.active ? warningMessage : undefined
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
