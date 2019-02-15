import Context from "talk-server/graph/tenant/context";

import Auth from "./Auth";
import CommentModerationActions from "./CommentModerationActions";
import Comments from "./Comments";
import Stories from "./Stories";
import Users from "./Users";

export default (ctx: Context) => ({
  Auth: Auth(ctx),
  CommentModerationActions: CommentModerationActions(ctx),
  Stories: Stories(ctx),
  Comments: Comments(ctx),
  Users: Users(ctx),
});
