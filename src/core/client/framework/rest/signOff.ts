import { RestClient } from "../lib/rest";

// tslint:disable-next-line:no-empty-interface
export interface SignOffResponse {}

export default function signOff(rest: RestClient) {
  return rest.fetch<SignOffResponse>("/tenant/auth/local", {
    method: "DELETE",
  });
}
