import TenantContext from "talk-server/graph/tenant/context";
import Comment from "./comment";

export default (ctx: TenantContext) => ({
  Comment: Comment(ctx),
});
