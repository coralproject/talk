import { LanguageCode } from "coral-common/helpers/i18n";

import { RestClient } from "../lib/rest";

export interface InstallInput {
  tenant: {
    organization: {
      name: string;
      contactEmail: string;
      url: string;
    };
    allowedDomains: string[];
    locale: LanguageCode;
  };
  user: {
    username: string;
    password: string;
    email: string;
  };
}

export default function install(rest: RestClient, input: InstallInput) {
  return rest.fetch("/install", {
    method: "POST",
    body: input,
  });
}
