import { Environment } from "relay-runtime";

import { createFetch } from "coral-framework/lib/relay";

const CheckInstallFetch = createFetch(
  "checkInstallFetch",
  async (environment: Environment, variables: any, { rest }) =>
    await rest.fetch("/install", {
      method: "GET",
    })
);

export default CheckInstallFetch;
