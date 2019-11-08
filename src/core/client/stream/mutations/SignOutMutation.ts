import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import { createMutation } from "coral-framework/lib/relay";

import { commit as signOut } from "coral-framework/mutations/SignOutMutation";
import { SignOutEvent } from "coral-stream/events";

const SignOutMutation = createMutation(
  "signOut",
  async (environment: Environment, input: undefined, ctx: CoralContext) => {
    const signOutEvent = SignOutEvent.begin(ctx.eventEmitter);
    try {
      await signOut(environment, input, ctx);
      signOutEvent.success();
    } catch (error) {
      signOutEvent.error({ message: error.message, code: error.code });
      throw error;
    }
  }
);

export default SignOutMutation;
