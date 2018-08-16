import { RestClient } from "../lib/rest";

// tslint:disable-next-line:no-empty-interface
export interface SignOffInput {}

// tslint:disable-next-line:no-empty-interface
export interface SignOffResponse {}

export default function signOff(rest: RestClient, input: SignOffInput) {
  return rest.fetch<SignOffResponse>("/tenant/auth/local", {
    method: "DELETE",
  });
}
