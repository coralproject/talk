import Logger from "bunyan";
import { Tenant } from "./models/tenant";
import { User } from "./models/user";
import { Request } from "./types/express";

/**
 * Context is the new representation of the GraphContext that only provides
 * request specific data that will be passed around versus the entire dependency
 * tree that GraphContext hauls around.
 */
export interface Context {
  readonly id: string;
  readonly now: Date;
  readonly tenant: Tenant;
  readonly logger: Logger;

  readonly clientID?: string;
  readonly req?: Request;
  readonly user?: User;
}
