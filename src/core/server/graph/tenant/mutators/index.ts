import TenantContext from "talk-server/graph/tenant/context";

import Comment from "./comment";
import Settings from "./settings";
import Story from "./story";
import User from "./user";

export default (ctx: TenantContext) => ({
  Comment: Comment(ctx),
  Settings: Settings(ctx),
  Story: Story(ctx),
  User: User(ctx),
});
