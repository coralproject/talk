import Context from "talk-server/graph/tenant/context";

import Actions from "./Actions";
import Auth from "./Auth";
import Comments from "./Comments";
import Stories from "./Stories";
import Users from "./Users";

export default (ctx: Context) => ({
  Auth: Auth(ctx),
  Actions: Actions(ctx),
  Stories: Stories(ctx),
  Comments: Comments(ctx),
  Users: Users(ctx),
});
