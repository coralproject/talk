import { Request } from "express";

import TenantContext from "talk-server/graph/tenant/context";
import { Tenant } from "talk-server/models/tenant";
import { User } from "talk-server/models/user";
import TenantCache from "talk-server/services/tenant/cache";

export interface TalkRequest {
  cache?: {
    tenant: TenantCache;
  };
  user?: User;
  tenant?: Tenant;
  context?: {
    tenant?: TenantContext;
  };
}

export interface Request extends Request {
  talk?: TalkRequest;
}
