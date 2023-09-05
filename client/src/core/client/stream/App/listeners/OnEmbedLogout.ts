import { Component } from "react";

import { CoralContext, withContext } from "coral-framework/lib/bootstrap";
import {
  SignOutMutation,
  withSignOutMutation,
} from "coral-framework/mutations";

interface Props {
  eventEmitter: CoralContext["eventEmitter"];
  signOut: SignOutMutation;
}

export class OnEmbedLogout extends Component<Props> {
  constructor(props: Props) {
    super(props);
    props.eventEmitter.on("embed.logout", () => {
      void this.props.signOut();
    });
  }

  public render() {
    return null;
  }
}

const enhanced = withContext(({ eventEmitter }) => ({
  eventEmitter,
}))(withSignOutMutation(OnEmbedLogout));

export default enhanced;
