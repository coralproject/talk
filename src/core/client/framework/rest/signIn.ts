import { RestClient } from "../lib/rest";

export interface SignInInput {
  username: string;
  password: string;
}

export default function signIn(rest: RestClient, input: SignInInput) {
  return rest.fetch("/tenant/auth/local", {
    method: "POST",
    body: input,
  });
}
