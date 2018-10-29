import Context from "talk-server/graph/tenant/context";

import Auth from "./auth";
import Comments from "./comments";
import Stories from "./stories";
import Users from "./users";

export default (ctx: Context) => ({
  Auth: Auth(ctx),
  Stories: Stories(ctx),
  Comments: Comments(ctx),
  Users: Users(ctx),
});
