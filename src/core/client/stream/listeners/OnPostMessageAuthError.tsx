import { Component } from "react";

import { withContext } from "talk-framework/lib/bootstrap";
import { PostMessageService } from "talk-framework/lib/postMessage";

interface Props {
  postMessage: PostMessageService;
}

class OnPostMessageAuthError extends Component<Props> {
  constructor(props: Props) {
    super(props);
    // Auth popup will use this to send back errors during login.
    props.postMessage!.on("authError", error => {
      // tslint:disable-next-line:no-console
      console.error(error);
    });
  }

  public render() {
    return null;
  }
}

const enhanced = withContext(({ postMessage }) => ({ postMessage }))(
  OnPostMessageAuthError
);
export default enhanced;
