import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import { createMutation } from "coral-framework/lib/relay";

export interface CompleteAccountInput {
  accessToken: string;
}

export async function commit(
  environment: Environment,
  input: CompleteAccountInput,
  { postMessage }: CoralContext
) {
  postMessage.send(
    "setAccessToken",
    input.accessToken,
    window.opener,
    `${location.protocol}//${location.host}`
  );
  window.close();
}

const CompleteAccountMutation = createMutation("completeAccount", commit);

export default CompleteAccountMutation;
