import { Db } from "mongodb";
import passport, { Authenticator } from "passport";

export interface PassportOptions {
  db: Db;
}

export function createPassport(_opts: PassportOptions): passport.Authenticator {
  // Create the authenticator.
  const auth = new Authenticator();

  return auth;
}
