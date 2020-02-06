import { RestClient } from "../lib/rest";

export interface LinkAccountInput {
  email: string;
  password: string;
}

export interface LinkAccountResponse {
  token: string;
}

export default function linkAccount(rest: RestClient, input: LinkAccountInput) {
  return rest.fetch<LinkAccountResponse>("/auth/link", {
    method: "POST",
    body: input,
  });
}
