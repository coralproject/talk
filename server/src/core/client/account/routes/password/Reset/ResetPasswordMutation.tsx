import { Environment } from "relay-runtime";

import { createMutation } from "coral-framework/lib/relay";

const ResetPasswordMutation = createMutation(
  "resetPassword",
  async (
    environment: Environment,
    variables: { token: string; password: string },
    { rest }
  ) =>
    await rest.fetch<void>("/auth/local/forgot", {
      method: "PUT",
      token: variables.token,
      body: {
        password: variables.password,
      },
    })
);

export default ResetPasswordMutation;
