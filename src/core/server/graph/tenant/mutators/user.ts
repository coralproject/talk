import { completeUserRegistration } from "talk-server/models/user";
import TenantContext from "../context";
import { GQLCompleteUserRegistrationInput } from "../schema/__generated__/types";

export default (ctx: TenantContext) => ({
  completeRegistration: (input: GQLCompleteUserRegistrationInput) =>
    completeUserRegistration(ctx.mongo, ctx.tenant.id, ctx.user!.id, input),
});
