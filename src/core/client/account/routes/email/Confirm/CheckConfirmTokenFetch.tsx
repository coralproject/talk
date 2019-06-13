import { Environment } from "relay-runtime";

import { createFetch } from "coral-framework/lib/relay";

const CheckConfirmTokenFetch = createFetch(
  "confirm",
  async (environment: Environment, variables: { token: string }, { rest }) =>
    await rest.fetch<void>("/account/confirm", {
      method: "GET",
      token: variables.token,
    })
);

export default CheckConfirmTokenFetch;
