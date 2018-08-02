import { Request } from "express";

import { Tenant } from "talk-server/models/tenant";
import { User } from "talk-server/models/user";
import TenantCache from "talk-server/services/tenant/cache";

export interface Request extends Request {
  user?: User;
  tenant?: Tenant;
  tenantCache: TenantCache;
}
