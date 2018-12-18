import { PostMessageService } from "talk-framework/lib/postMessage";

export default function(postMessage: PostMessageService, token: string) {
  return postMessage.send("setAuthToken", token, window.opener);
}
