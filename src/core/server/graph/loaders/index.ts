import Context from "coral-server/graph/context";

import Auth from "./Auth";
import CommentActions from "./CommentActions";
import CommentModerationActions from "./CommentModerationActions";
import Comments from "./Comments";
import Stories from "./Stories";
import Users from "./Users";

export default (ctx: Context) => ({
  Auth: Auth(ctx),
  CommentActions: CommentActions(ctx),
  CommentModerationActions: CommentModerationActions(ctx),
  Stories: Stories(ctx),
  Comments: Comments(ctx),
  Users: Users(ctx),
});
