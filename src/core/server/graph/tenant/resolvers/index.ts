import Cursor from "talk-server/graph/common/scalars/cursor";
import { GQLResolver } from "talk-server/graph/tenant/schema/__generated__/types";

import Asset from "./asset";
import Comment from "./comment";
import Mutation from "./mutation";
import Query from "./query";

const Resolvers: GQLResolver = {
  Asset,
  Comment,
  Cursor,
  Query,
  Mutation,
};

export default Resolvers;
