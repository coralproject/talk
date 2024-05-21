import GraphContext from "coral-server/graph/context";

import { Actions } from "./Actions";
import { Comments } from "./Comments";
import { DSAReports } from "./DSAReports";
import { Redis } from "./Redis";
import { Settings } from "./Settings";
import { Sites } from "./Sites";
import { Stories } from "./Stories";
import { Users } from "./Users";

const root = (ctx: GraphContext) => ({
  Actions: Actions(ctx),
  Comments: Comments(ctx),
  DSAReports: DSAReports(ctx),
  Settings: Settings(ctx),
  Stories: Stories(ctx),
  Users: Users(ctx),
  Sites: Sites(ctx),
  Redis: Redis(ctx),
});

export default root;
