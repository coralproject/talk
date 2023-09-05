import { Environment } from "relay-runtime";

import { createMutation } from "coral-framework/lib/relay";

const UnsubscribeNotificationsMutation = createMutation(
  "unsubscribeNotifications",
  async (environment: Environment, variables: { token: string }, { rest }) =>
    await rest.fetch<void>("/account/notifications/unsubscribe", {
      method: "DELETE",
      token: variables.token,
    })
);

export default UnsubscribeNotificationsMutation;
