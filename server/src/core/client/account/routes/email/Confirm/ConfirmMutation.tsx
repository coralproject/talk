import { Environment } from "relay-runtime";

import { createMutation } from "coral-framework/lib/relay";

const ConfirmMutation = createMutation(
  "confirm",
  async (environment: Environment, variables: { token: string }, { rest }) =>
    await rest.fetch<void>("/account/confirm", {
      method: "PUT",
      token: variables.token,
    })
);

export default ConfirmMutation;
