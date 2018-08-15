import { RestClient } from "../lib/rest";

export default function signOff(rest: RestClient) {
  return rest.fetch("/tenant/auth/local", {
    method: "DELETE",
  });
}
