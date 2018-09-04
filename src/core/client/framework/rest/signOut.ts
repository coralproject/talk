import { RestClient } from "../lib/rest";

export default function signOut(rest: RestClient) {
  return rest.fetch("/tenant/auth", {
    method: "DELETE",
  });
}
