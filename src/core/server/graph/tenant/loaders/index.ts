import Context from "talk-server/graph/tenant/context";
import Comments from "./comments";
import Stories from "./stories";
import Users from "./users";

export default (ctx: Context) => ({
  Stories: Stories(ctx),
  Comments: Comments(ctx),
  Users: Users(ctx),
});
