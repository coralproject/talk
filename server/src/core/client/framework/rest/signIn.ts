import { RestClient } from "../lib/rest";

export interface SignInInput {
  email: string;
  password: string;
}

export interface SignInResponse {
  token: string;
}

export default function signIn(rest: RestClient, input: SignInInput) {
  return rest.fetch<SignInResponse>("/auth/local", {
    method: "POST",
    body: input,
  });
}
