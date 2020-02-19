import { RedisPubSub } from "graphql-redis-subscriptions";
import { Db } from "mongodb";
import uuid from "uuid";

import { LanguageCode } from "coral-common/helpers/i18n/locales";
import { Config } from "coral-server/config";
import CoralEventListenerBroker, {
  CoralEventPublisherBroker,
} from "coral-server/events/publisher";
import logger, { Logger } from "coral-server/logger";
import { PersistedQuery } from "coral-server/models/queries";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import { MailerQueue } from "coral-server/queue/tasks/mailer";
import { ScraperQueue } from "coral-server/queue/tasks/scraper";
import { I18n } from "coral-server/services/i18n";
import { JWTSigningConfig } from "coral-server/services/jwt";
import { AugmentedRedis } from "coral-server/services/redis";
import TenantCache from "coral-server/services/tenant/cache";
import { Request } from "coral-server/types/express";

import loaders from "./loaders";
import mutators from "./mutators";

export interface GraphContextOptions {
  clientID?: string;
  disableCaching?: boolean;
  id?: string;
  lang?: LanguageCode;
  logger?: Logger;
  now?: Date;
  persisted?: PersistedQuery;
  req?: Request;
  signingConfig?: JWTSigningConfig;
  user?: User;

  config: Config;
  i18n: I18n;
  mailerQueue: MailerQueue;
  mongo: Db;
  pubsub: RedisPubSub;
  redis: AugmentedRedis;
  scraperQueue: ScraperQueue;
  tenant: Tenant;
  tenantCache: TenantCache;
  broker: CoralEventListenerBroker;
}

export default class GraphContext {
  public readonly config: Config;
  public readonly broker: CoralEventPublisherBroker;
  public readonly disableCaching: boolean;
  public readonly i18n: I18n;
  public readonly id: string;
  public readonly lang: LanguageCode;
  public readonly loaders: ReturnType<typeof loaders>;
  public readonly logger: Logger;
  public readonly mailerQueue: MailerQueue;
  public readonly mongo: Db;
  public readonly mutators: ReturnType<typeof mutators>;
  public readonly now: Date;
  public readonly pubsub: RedisPubSub;
  public readonly redis: AugmentedRedis;
  public readonly scraperQueue: ScraperQueue;
  public readonly tenant: Tenant;
  public readonly tenantCache: TenantCache;

  public readonly clientID?: string;
  public readonly persisted?: PersistedQuery;
  public readonly req?: Request;
  public readonly signingConfig?: JWTSigningConfig;
  public readonly user?: User;

  constructor(options: GraphContextOptions) {
    this.id = options.id || uuid.v1();
    this.now = options.now || new Date();
    this.lang = options.lang || options.i18n.getDefaultLang();
    this.disableCaching = options.disableCaching || false;

    this.logger = (options.logger || logger).child(
      { context: "graph", contextID: this.id },
      true
    );

    this.user = options.user;
    this.req = options.req;
    this.persisted = options.persisted;
    this.config = options.config;
    this.i18n = options.i18n;
    this.pubsub = options.pubsub;
    this.mongo = options.mongo;
    this.redis = options.redis;
    this.tenant = options.tenant;
    this.tenantCache = options.tenantCache;
    this.scraperQueue = options.scraperQueue;
    this.mailerQueue = options.mailerQueue;
    this.signingConfig = options.signingConfig;
    this.clientID = options.clientID;

    this.broker = options.broker.instance(this);
    this.loaders = loaders(this);
    this.mutators = mutators(this);
  }
}
