import { RestClient } from "../lib/rest";

export interface ForgotPasswordInput {
  email: string;
}

export default function forgotPassword(
  rest: RestClient,
  input: ForgotPasswordInput
) {
  return rest.fetch<void>("/auth/local/forgot", {
    method: "POST",
    body: input,
  });
}
