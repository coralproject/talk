import { Db } from "mongodb";
import CommonContext from "talk-server/graph/common/context";
import { Tenant } from "talk-server/models/tenant";
import { User } from "talk-server/models/user";
import loaders from "./loaders";
import mutators from "./mutators";

export interface TenantContextOptions {
  db: Db;
  tenant: Tenant;
  user?: User;
}

export default class TenantContext extends CommonContext {
  public loaders: ReturnType<typeof loaders>;
  public mutators: ReturnType<typeof mutators>;
  public db: Db;
  public tenant: Tenant;

  constructor({ user, tenant, db }: TenantContextOptions) {
    super({ user });

    this.tenant = tenant;
    this.loaders = loaders(this);
    this.mutators = mutators(this);
    this.db = db;
  }
}
