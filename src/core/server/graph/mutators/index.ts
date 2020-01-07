import GraphContext from "coral-server/graph/context";

import { Actions } from "./Actions";
import { Comments } from "./Comments";
import { Settings } from "./Settings";
import { Stories } from "./Stories";
import { Users } from "./Users";

export default (ctx: GraphContext) => ({
  Actions: Actions(ctx),
  Comments: Comments(ctx),
  Settings: Settings(ctx),
  Stories: Stories(ctx),
  Users: Users(ctx),
});
