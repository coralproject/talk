import { Component } from "react";

import { TalkContext, withContext } from "talk-framework/lib/bootstrap";
import { commit as setAuthToken } from "talk-framework/mutations/SetAuthTokenMutation";

interface Props {
  context: TalkContext;
}

export class OnPostMessageSetAuthToken extends Component<Props> {
  constructor(props: Props) {
    super(props);
    // Auth popup will use this to handle a successful login.
    props.context.postMessage!.on("setAuthToken", (authToken: string) => {
      setAuthToken(
        this.props.context.relayEnvironment,
        { authToken },
        this.props.context
      );
    });
  }

  public render() {
    return null;
  }
}

const enhanced = withContext(context => ({ context }))(
  OnPostMessageSetAuthToken
);
export default enhanced;
