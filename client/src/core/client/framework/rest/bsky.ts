import { FORM_ERROR } from "final-form";

export interface BskyHandleInput {
  handle: string;
}

export default function postBskyApiAuth(
  input: BskyHandleInput,
  authPath: string
) {
  try {
    fetch(authPath, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(input),
    })
      .then((resp) => {
        if (resp.redirected) {
          window.location.href = resp.url;
        }
      })
      .catch((err) => {
        return { [FORM_ERROR]: err.message };
      });
    return Promise.resolve();
  } catch (err) {
    return { [FORM_ERROR]: err.message };
  }
}
