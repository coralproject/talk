import { Environment } from "relay-runtime";

import { TalkContext } from "talk-framework/lib/bootstrap";
import { createMutation } from "talk-framework/lib/relay";
import SetAccessTokenMutation from "talk-framework/mutations/SetAccessTokenMutation";

const CompleteAccountMutation = createMutation(
  "completeAccount",
  async (
    environment: Environment,
    input: {
      accessToken: string;
    },
    context: TalkContext
  ) =>
    await SetAccessTokenMutation.commit(
      environment,
      { accessToken: input.accessToken },
      context
    )
);

export default CompleteAccountMutation;
