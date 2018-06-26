import { Tenant } from "talk-server/models/tenant";
import { User } from "talk-server/models/user";

declare module "express" {
  interface Request {
    user?: User;
    tenant?: Tenant;
  }
}
