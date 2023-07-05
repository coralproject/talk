import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import { createMutation } from "coral-framework/lib/relay";
import { signIn, SignInInput } from "coral-framework/rest";

const SignInMutation = createMutation(
  "signIn",
  async (
    environment: Environment,
    input: SignInInput,
    context: CoralContext
  ) => {
    const result = await signIn(context.rest, input);
    await context.clearSession(result.token, { ephemeral: true });
  }
);

export default SignInMutation;
