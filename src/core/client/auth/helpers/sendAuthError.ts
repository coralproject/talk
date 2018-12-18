import { PostMessageService } from "talk-framework/lib/postMessage";

export default function(postMessage: PostMessageService, err: Error) {
  return postMessage.send("authError", err.toString(), window.opener);
}
