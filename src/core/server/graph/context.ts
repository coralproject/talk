import { RedisPubSub } from "graphql-redis-subscriptions";
import { Db } from "mongodb";
import uuid from "uuid";

import { LanguageCode } from "coral-common/helpers/i18n/locales";
import { Config } from "coral-server/config";
import {
  createPublisher,
  Publisher,
} from "coral-server/graph/subscriptions/publisher";
import logger, { Logger } from "coral-server/logger";
import { PersistedQuery } from "coral-server/models/queries";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import { MailerQueue } from "coral-server/queue/tasks/mailer";
import { NotifierQueue } from "coral-server/queue/tasks/notifier";
import { ScraperQueue } from "coral-server/queue/tasks/scraper";
import { I18n } from "coral-server/services/i18n";
import { JWTSigningConfig } from "coral-server/services/jwt";
import { AugmentedRedis } from "coral-server/services/redis";
import createSlackPublisher from "coral-server/services/slack/publisher";
import TenantCache from "coral-server/services/tenant/cache";
import { Request } from "coral-server/types/express";

import loaders from "./loaders";
import mutators from "./mutators";

export interface TenantContextOptions {
  id?: string;
  tenant: Tenant;
  user?: User;
  clientID?: string;
  now?: Date;

  req?: Request;

  tenantCache: TenantCache;
  mailerQueue: MailerQueue;
  notifierQueue: NotifierQueue;
  scraperQueue: ScraperQueue;
  signingConfig?: JWTSigningConfig;
  logger?: Logger;
  lang?: LanguageCode;
  disableCaching?: boolean;
  persisted?: PersistedQuery;
  config: Config;
  i18n: I18n;
  pubsub: RedisPubSub;
  mongo: Db;
  redis: AugmentedRedis;
}

export default class TenantContext {
  public readonly id: string;
  public readonly tenant: Tenant;
  public readonly user?: User;
  public readonly clientID?: string;
  public readonly now: Date;

  public readonly req?: Request;

  public readonly mongo: Db;
  public readonly redis: AugmentedRedis;
  public readonly tenantCache: TenantCache;
  public readonly mailerQueue: MailerQueue;
  public readonly scraperQueue: ScraperQueue;
  public readonly publisher: Publisher;
  public readonly signingConfig?: JWTSigningConfig;
  public readonly loaders: ReturnType<typeof loaders>;
  public readonly mutators: ReturnType<typeof mutators>;
  public readonly persisted?: PersistedQuery;
  public readonly config: Config;
  public readonly i18n: I18n;
  public readonly lang: LanguageCode;
  public readonly logger: Logger;
  public readonly pubsub: RedisPubSub;
  public readonly disableCaching: boolean;

  constructor({
    id = uuid.v1(),
    now = new Date(),
    tenant,
    user,
    req,
    logger: log = logger,
    notifierQueue,
    persisted,
    config,
    i18n,
    lang = i18n.getDefaultLang(),
    pubsub,
    mongo,
    redis,
    disableCaching = false,
    ...options
  }: TenantContextOptions) {
    this.id = id;
    this.now = now;
    this.user = user;
    this.req = req;
    this.persisted = persisted;
    this.config = config;
    this.i18n = i18n;
    this.lang = lang;
    this.pubsub = pubsub;
    this.mongo = mongo;
    this.redis = redis;
    this.disableCaching = disableCaching;
    this.tenant = tenant;
    this.tenantCache = options.tenantCache;
    this.scraperQueue = options.scraperQueue;
    this.mailerQueue = options.mailerQueue;
    this.signingConfig = options.signingConfig;
    this.clientID = options.clientID;

    this.logger = log.child(
      {
        context: "graph",
        contextID: id,
      },
      true
    );

    this.publisher = createPublisher({
      pubsub: this.pubsub,
      slackPublisher: createSlackPublisher(
        this.mongo,
        this.config,
        this.tenant
      ),
      notifierQueue,
      tenantID: this.tenant.id,
      clientID: this.clientID,
    });

    this.loaders = loaders(this);
    this.mutators = mutators(this);
  }
}
