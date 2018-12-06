import TenantContext from "talk-server/graph/tenant/context";

import { Actions } from "./Actions";
import { Comment } from "./Comment";
import { Settings } from "./Settings";
import { Story } from "./Story";
import { User } from "./User";

export default (ctx: TenantContext) => ({
  Actions: Actions(ctx),
  Comment: Comment(ctx),
  Settings: Settings(ctx),
  Story: Story(ctx),
  User: User(ctx),
});
