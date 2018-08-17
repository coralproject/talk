import { TalkContext } from "talk-framework/lib/bootstrap";

export default function onPostMessageSetAuthToken({
  postMessage,
}: TalkContext) {
  // Auth popup will use this to send back errors during login.
  postMessage!.on("authError", error => {
    // tslint:disable-next-line:no-console
    console.error(error);
  });
}
