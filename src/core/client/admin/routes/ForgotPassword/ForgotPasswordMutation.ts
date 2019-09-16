import { pick } from "lodash";

import { createMutation } from "coral-framework/lib/relay";
import { forgotPassword, ForgotPasswordInput } from "coral-framework/rest";

const ForgotPasswordMutation = createMutation(
  "forgotPassword",
  (_, input: ForgotPasswordInput, { rest }) =>
    forgotPassword(rest, pick(input, ["email"]))
);

export default ForgotPasswordMutation;
