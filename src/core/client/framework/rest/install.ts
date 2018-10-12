import { RestClient } from "../lib/rest";

export interface InstallInput {
  tenant: {
    organizationName: string;
    organizationContactEmail: string;
    organizationURL: string;
    domains: string[];
  };
  user: {
    username: string;
    password: string;
    email: string;
  };
}

export default function install(rest: RestClient, input: InstallInput) {
  return rest.fetch("/tenant/install", {
    method: "POST",
    body: input,
  });
}
