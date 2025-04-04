import { FORM_ERROR } from "final-form";
import { RestClient } from "../lib/rest";

export interface BskyHandleInput {
  handle: string;
}

export default function postBskyApiAuth(
  rest: RestClient,
  input: BskyHandleInput,
  authPath: string
) {
  try {
    console.log(authPath);
    return rest.fetch<void>("/auth/bsky", {
      method: "POST",
      body: input,
    });
  } catch (err) {
    return { [FORM_ERROR]: err.message };
  }
}
