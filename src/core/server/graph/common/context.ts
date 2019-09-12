import { Db } from "mongodb";
import uuid from "uuid";

import { LanguageCode } from "coral-common/helpers/i18n/locales";
import { Config } from "coral-server/config";
import logger, { Logger } from "coral-server/logger";
import { User } from "coral-server/models/user";
import { I18n } from "coral-server/services/i18n";
import { AugmentedRedis } from "coral-server/services/redis";
import { Request } from "coral-server/types/express";
import { RedisPubSub } from "graphql-redis-subscriptions";

export interface CommonContextOptions {
  id?: string;
  now?: Date;
  user?: User;
  req?: Request;
  logger?: Logger;
  lang?: LanguageCode;
  disableCaching?: boolean;
  config: Config;
  i18n: I18n;
  pubsub: RedisPubSub;
  mongo: Db;
  redis: AugmentedRedis;
}

export default class CommonContext {
  public readonly user?: User;
  public readonly req?: Request;
  public readonly id: string;
  public readonly config: Config;
  public readonly i18n: I18n;
  public readonly lang: LanguageCode;
  public readonly now: Date;
  public readonly logger: Logger;
  public readonly pubsub: RedisPubSub;
  public readonly mongo: Db;
  public readonly redis: AugmentedRedis;
  public readonly disableCaching: boolean;

  constructor({
    id = uuid.v1(),
    now = new Date(),
    logger: log = logger,
    user,
    req,
    config,
    i18n,
    lang = i18n.getDefaultLang(),
    pubsub,
    mongo,
    redis,
    disableCaching = false,
  }: CommonContextOptions) {
    this.id = id;
    this.logger = log.child(
      {
        context: "graph",
        contextID: id,
      },
      true
    );
    this.now = now;
    this.user = user;
    this.req = req;
    this.config = config;
    this.i18n = i18n;
    this.lang = lang;
    this.pubsub = pubsub;
    this.mongo = mongo;
    this.redis = redis;
    this.disableCaching = disableCaching;
  }
}
