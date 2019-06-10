import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import { createMutation } from "coral-framework/lib/relay";
import SetAccessTokenMutation from "coral-framework/mutations/SetAccessTokenMutation";

const CompleteAccountMutation = createMutation(
  "completeAccount",
  async (
    environment: Environment,
    input: {
      accessToken: string;
    },
    context: CoralContext
  ) =>
    await SetAccessTokenMutation.commit(
      environment,
      { accessToken: input.accessToken },
      context
    )
);

export default CompleteAccountMutation;
