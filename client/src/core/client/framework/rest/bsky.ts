import { FORM_ERROR } from "final-form";

export interface BskyHandleInput {
  handle: string;
}

export default function postBskyApiAuth(
  input: BskyHandleInput,
  authPath: string
) {
  try {
    return fetch(authPath, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(input),
    });
  } catch (err) {
    return { [FORM_ERROR]: err.message };
  }
}
