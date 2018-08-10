import { RestClient } from "../lib/rest";

export interface SignUpInput {
  username: string;
  password: string;
  email: string;
}

export default function signUp(rest: RestClient, input: SignUpInput) {
  return rest.fetch("/tenant/auth/local/signup", {
    method: "POST",
    body: input,
  });
}
