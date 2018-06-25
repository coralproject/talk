import { User } from "talk-server/models/user";

declare module "express" {
  interface Request {
    user?: User;
  }
}
