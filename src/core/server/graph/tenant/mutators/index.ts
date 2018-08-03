import TenantContext from "talk-server/graph/tenant/context";

import Comment from "./comment";
import Settings from "./settings";

export default (ctx: TenantContext) => ({
  Comment: Comment(ctx),
  Settings: Settings(ctx),
});
