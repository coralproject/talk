import { Component } from "react";

import { TalkContext, withContext } from "talk-framework/lib/bootstrap";
import {
  SetAccessTokenMutation,
  withSetAccessTokenMutation,
} from "talk-framework/mutations/SetAccessTokenMutation";

interface Props {
  postMessage: TalkContext["postMessage"];
  setAccessToken: SetAccessTokenMutation;
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
  withSetAccessTokenMutation(OnPostMessageSetAccessToken)
);
export default enhanced;
