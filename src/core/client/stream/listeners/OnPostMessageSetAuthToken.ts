import { Component } from "react";

import { TalkContext, withContext } from "talk-framework/lib/bootstrap";
import {
  SetAuthTokenMutation,
  withSetAuthTokenMutation,
} from "talk-framework/mutations/SetAuthTokenMutation";

interface Props {
  postMessage: TalkContext["postMessage"];
  setAuthToken: SetAuthTokenMutation;
}

export class OnPostMessageSetAuthToken extends Component<Props> {
  constructor(props: Props) {
    super(props);
    // Auth popup will use this to handle a successful login.
    props.postMessage!.on("setAuthToken", (authToken: string) => {
      props.setAuthToken({ authToken });
    });
  }

  public render() {
    return null;
  }
}

const enhanced = withContext(({ postMessage }) => ({ postMessage }))(
  withSetAuthTokenMutation(OnPostMessageSetAuthToken)
);
export default enhanced;
