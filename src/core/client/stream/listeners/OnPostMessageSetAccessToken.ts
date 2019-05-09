import { Component } from "react";

import { TalkContext, withContext } from "talk-framework/lib/bootstrap";
import { MutationProp, withMutation } from "talk-framework/lib/relay";
import { SetAccessTokenMutation } from "talk-framework/mutations";

interface Props {
  postMessage: TalkContext["postMessage"];
  setAccessToken: MutationProp<typeof SetAccessTokenMutation>;
}

export class OnPostMessageSetAccessToken extends Component<Props> {
  constructor(props: Props) {
    super(props);
    // Auth popup will use this to handle a successful login.
    props.postMessage!.on("setAccessToken", (accessToken: string) => {
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
