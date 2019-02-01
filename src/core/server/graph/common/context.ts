import uuid from "uuid";

import { LanguageCode } from "talk-common/helpers/i18n/locales";
import { Config } from "talk-server/config";
import logger from "talk-server/logger";
import { User } from "talk-server/models/user";
import { I18n } from "talk-server/services/i18n";
import { Request } from "talk-server/types/express";

export interface CommonContextOptions {
  user?: User;
  req?: Request;
  lang?: LanguageCode;
  config: Config;
  i18n: I18n;
}

export default class CommonContext {
  public readonly user?: User;
  public readonly req?: Request;
  public readonly config: Config;
  public readonly i18n: I18n;
  public readonly lang: LanguageCode;

  public readonly logger = logger.child({
    context: "graph",
    contextID: uuid.v1(),
  });

  constructor({
    user,
    req,
    config,
    i18n,
    lang = i18n.getDefaultLang(),
  }: CommonContextOptions) {
    this.user = user;
    this.req = req;
    this.config = config;
    this.i18n = i18n;
    this.lang = lang;
  }
}
