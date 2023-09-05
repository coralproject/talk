import { pick } from "lodash";

import { createMutation } from "coral-framework/lib/relay";
import { linkAccount, LinkAccountInput } from "coral-framework/rest";

export type LinkAccountMutation = (input: LinkAccountInput) => Promise<void>;

const LinkAccountMutation = createMutation(
  "linkAccount",
  async (_, input: LinkAccountInput, { rest, clearSession }) => {
    const result = await linkAccount(rest, pick(input, ["email", "password"]));
    await clearSession(result.token);
  }
);

export default LinkAccountMutation;
