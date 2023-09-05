import { Component } from "react";

import { CoralContext, withContext } from "coral-framework/lib/bootstrap";
import { MutationProp, withMutation } from "coral-framework/lib/relay";
import { SetAccessTokenMutation } from "coral-framework/mutations";

interface Props {
  eventEmitter: CoralContext["eventEmitter"];
  setAccessToken: MutationProp<typeof SetAccessTokenMutation>;
}

export class OnEmbedLogin extends Component<Props> {
  constructor(props: Props) {
    super(props);
    props.eventEmitter.on("embed.login", (accessToken) => {
      void this.props.setAccessToken({ accessToken, ephemeral: true });
    });
  }

  public render() {
    return null;
  }
}

const enhanced = withContext(({ eventEmitter }) => ({
  eventEmitter,
}))(withMutation(SetAccessTokenMutation)(OnEmbedLogin));

export default enhanced;
