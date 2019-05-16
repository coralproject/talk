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

    // Put the token on the hash and clean the session.
    // It'll be picked up by initLocalState.
    location.hash = `accessToken=${result.token}`;
    await context.clearSession();
    // TODO: (cvle) A better way would be if `context.clearSession` would return the new session and
    // we set the accessToken directly in there.
  }
);

export default SignInMutation;
