import TenantContext from "talk-server/graph/tenant/context";

import { Comment } from "./Comment";
import { Settings } from "./Settings";
import { Story } from "./Story";

export default (ctx: TenantContext) => ({
  Comment: Comment(ctx),
  Settings: Settings(ctx),
  Story: Story(ctx),
});
