import { Component } from "react";

import { CoralContext, withContext } from "coral-framework/lib/bootstrap";
import { MutationProp, withMutation } from "coral-framework/lib/relay";
import { SetAccessTokenMutation } from "coral-framework/mutations";
import { SignedInEvent } from "coral-stream/events";

interface Props {
  postMessage: CoralContext["postMessage"];
  eventEmitter: CoralContext["eventEmitter"];
  setAccessToken: MutationProp<typeof SetAccessTokenMutation>;
}

export class OnPostMessageSetAccessToken extends Component<Props> {
  constructor(props: Props) {
    super(props);
    // Auth popup will use this to handle a successful login.
    props.postMessage.on("setAccessToken", (accessToken: string) => {
      void props.setAccessToken({ accessToken });
      SignedInEvent.emit(props.eventEmitter);
    });
  }

  public render() {
    return null;
  }
}

const enhanced = withContext(({ postMessage, eventEmitter }) => ({
  postMessage,
  eventEmitter,
}))(withMutation(SetAccessTokenMutation)(OnPostMessageSetAccessToken));
export default enhanced;
