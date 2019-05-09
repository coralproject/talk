import { pick } from "lodash";

import { createMutation } from "talk-framework/lib/relay";
import { forgotPassword, ForgotPasswordInput } from "talk-framework/rest";

const ForgotPasswordMutation = createMutation(
  "forgotPassword",
  (_, input: ForgotPasswordInput, { rest }) =>
    forgotPassword(rest, pick(input, ["email"]))
);

export default ForgotPasswordMutation;
