import { Environment } from "relay-runtime";

import { createMutation } from "coral-framework/lib/relay";

const InviteCompleteMutation = createMutation(
  "invite",
  async (
    environment: Environment,
    variables: { token: string; username: string; password: string },
    { rest }
  ) =>
    await rest.fetch<void>("/account/invite", {
      method: "PUT",
      token: variables.token,
      body: {
        username: variables.username,
        password: variables.password,
      },
    })
);

export default InviteCompleteMutation;
