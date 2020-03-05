declare module "passport-google-oauth2" {
  import express from "express";
  import passport from "passport";

  export interface Profile extends passport.Profile {
    id: string;
    displayName: string;
  }

  export interface AuthenticateOptions extends passport.AuthenticateOptions {
    authType?: string;
  }

  export interface StrategyOptionWithRequest {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    passReqToCallback: true;
  }

  export type VerifyFunctionWithRequest = (
    req: express.Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void
  ) => void;

  export class Strategy implements passport.Strategy {
    constructor(
      options: StrategyOptionWithRequest,
      verify: VerifyFunctionWithRequest
    );

    public name: string;
    public authenticate(req: express.Request, options?: object): void;
  }
}
