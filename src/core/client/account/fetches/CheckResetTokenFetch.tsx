import { Environment } from "relay-runtime";

import { createFetch } from "talk-framework/lib/relay";

const CheckResetTokenFetch = createFetch(
  "resetToken",
  async (environment: Environment, variables: { token: string }, { rest }) =>
    await rest.fetch<void>("/auth/local/forgot", {
      method: "GET",
      token: variables.token,
    })
);

export default CheckResetTokenFetch;
