import { Db } from "mongodb";
import { Tenant } from "talk-server/models/tenant";
import { User } from "talk-server/models/user";
import loaders from "./loaders";
import mutators from "./mutators";

export interface TenantContextOptions {
  db: Db;
  tenant?: Tenant;
  user?: User;
}

export default class TenantContext {
  public loaders: ReturnType<typeof loaders>;
  public mutators: ReturnType<typeof mutators>;
  public db: Db;
  public tenant?: Tenant;
  public user?: User;

  constructor({ user, tenant, db }: TenantContextOptions) {
    this.tenant = tenant;
    this.user = user;
    this.loaders = loaders(this);
    this.mutators = mutators(this);
    this.db = db;
  }
}
