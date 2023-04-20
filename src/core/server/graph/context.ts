import { RedisPubSub } from "graphql-redis-subscriptions";
import { v1 as uuid } from "uuid";

import { LanguageCode } from "coral-common/helpers/i18n/locales";
import { Config } from "coral-server/config";
import { DataCache } from "coral-server/data/cache/dataCache";
import { MongoContext } from "coral-server/data/context";
import CoralEventListenerBroker, {
  CoralEventPublisherBroker,
} from "coral-server/events/publisher";
import logger, { Logger } from "coral-server/logger";
import { PersistedQuery } from "coral-server/models/queries";
import { Site } from "coral-server/models/site";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import { LoadCacheQueue } from "coral-server/queue/tasks/loadCache";
import { MailerQueue } from "coral-server/queue/tasks/mailer";
import { NotifierQueue } from "coral-server/queue/tasks/notifier";
import { RejectorQueue } from "coral-server/queue/tasks/rejector";
import { ScraperQueue } from "coral-server/queue/tasks/scraper";
import { UnarchiverQueue } from "coral-server/queue/tasks/unarchiver";
import { WebhookQueue } from "coral-server/queue/tasks/webhook";
import { ErrorReporter } from "coral-server/services/errors";
import { I18n } from "coral-server/services/i18n";
import { JWTSigningConfig } from "coral-server/services/jwt";
import { AugmentedRedis } from "coral-server/services/redis";
import { TenantCache } from "coral-server/services/tenant/cache";
import { Request } from "coral-server/types/express";

import loaders from "./loaders";
import mutators from "./mutators";
import SeenCommentsCollection from "./seenCommentsCollection";

export interface GraphContextOptions {
  clientID?: string;
  disableCaching?: boolean;
  id?: string;
  lang?: LanguageCode;
  logger?: Logger;
  now?: Date;
  persisted?: PersistedQuery;
  reporter?: ErrorReporter;
  req?: Request;
  signingConfig?: JWTSigningConfig;
  user?: User;

  config: Config;
  i18n: I18n;
  mailerQueue: MailerQueue;
  rejectorQueue: RejectorQueue;
  scraperQueue: ScraperQueue;
  webhookQueue: WebhookQueue;
  notifierQueue: NotifierQueue;
  loadCacheQueue: LoadCacheQueue;
  unarchiverQueue: UnarchiverQueue;
  mongo: MongoContext;
  pubsub: RedisPubSub;
  redis: AugmentedRedis;
  tenant: Tenant;
  site?: Site;
  tenantCache: TenantCache;
  broker: CoralEventListenerBroker;
}

export default class GraphContext {
  public readonly config: Config;
  public readonly broker: CoralEventPublisherBroker;
  public readonly disableCaching: boolean;
  public readonly i18n: I18n;
  public readonly reporter?: ErrorReporter;
  public readonly id: string;
  public readonly lang: LanguageCode;
  public readonly loaders: ReturnType<typeof loaders>;
  public readonly logger: Logger;
  public readonly mailerQueue: MailerQueue;
  public readonly rejectorQueue: RejectorQueue;
  public readonly scraperQueue: ScraperQueue;
  public readonly webhookQueue: WebhookQueue;
  public readonly notifierQueue: NotifierQueue;
  public readonly loadCacheQueue: LoadCacheQueue;
  public readonly unarchiverQueue: UnarchiverQueue;
  public readonly mongo: MongoContext;
  public readonly mutators: ReturnType<typeof mutators>;
  public readonly now: Date;
  public readonly pubsub: RedisPubSub;
  public readonly redis: AugmentedRedis;
  public readonly tenant: Tenant;
  public readonly tenantCache: TenantCache;
  public readonly site?: Site;

  public readonly clientID?: string;
  public readonly persisted?: PersistedQuery;
  public readonly req?: Request;
  public readonly signingConfig?: JWTSigningConfig;
  public readonly user?: User;

  public readonly seenComments: SeenCommentsCollection;

  public readonly cache: DataCache;

  constructor(options: GraphContextOptions) {
    this.id = options.id || uuid();
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
    this.site = options.site;
    this.tenantCache = options.tenantCache;
    this.scraperQueue = options.scraperQueue;
    this.mailerQueue = options.mailerQueue;
    this.rejectorQueue = options.rejectorQueue;
    this.notifierQueue = options.notifierQueue;
    this.webhookQueue = options.webhookQueue;
    this.loadCacheQueue = options.loadCacheQueue;
    this.unarchiverQueue = options.unarchiverQueue;
    this.signingConfig = options.signingConfig;
    this.clientID = options.clientID;
    this.reporter = options.reporter;

    this.broker = options.broker.instance(this);
    this.loaders = loaders(this);
    this.mutators = mutators(this);

    this.seenComments = new SeenCommentsCollection();

    this.cache = new DataCache(
      this.mongo,
      this.redis,
      this.tenantCache,
      this.logger,
      this.disableCaching,
      this.config.get("redis_cache_expiry") / 1000
    );
  }
}
