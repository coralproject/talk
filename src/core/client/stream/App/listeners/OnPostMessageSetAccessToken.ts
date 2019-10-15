import { Component } from "react";

import { CoralContext, withContext } from "coral-framework/lib/bootstrap";
import { MutationProp, withMutation } from "coral-framework/lib/relay";
import { SetAccessTokenMutation } from "coral-framework/mutations";

interface Props {
  postMessage: CoralContext["postMessage"];
  setAccessToken: MutationProp<typeof SetAccessTokenMutation>;
}

export class OnPostMessageSetAccessToken extends Component<Props> {
  constructor(props: Props) {
    super(props);
    // Auth popup will use this to handle a successful login.
    props.postMessage.on("setAccessToken", (accessToken: string) => {
      props.setAccessToken({ accessToken });
    });
  }

  public render() {
    return null;
  }
}

const enhanced = withContext(({ postMessage }) => ({ postMessage }))(
  withMutation(SetAccessTokenMutation)(OnPostMessageSetAccessToken)
);
export default enhanced;
