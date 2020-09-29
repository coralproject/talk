import { RedisPubSub } from "graphql-redis-subscriptions";
import { container } from "tsyringe";

import { LanguageCode } from "coral-common/helpers/i18n/locales";
import { CONFIG, Config } from "coral-server/config";
import CoralEventEmitter, {
  CoralEventPublisherBroker,
} from "coral-server/events/publisher";
import { Logger } from "coral-server/logger";
import { PersistedQuery } from "coral-server/models/queries";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import { MailerQueue } from "coral-server/queue/tasks/mailer";
import { NotifierQueue } from "coral-server/queue/tasks/notifier";
import { RejectorQueue } from "coral-server/queue/tasks/rejector";
import { ScraperQueue } from "coral-server/queue/tasks/scraper";
import { WebhookQueue } from "coral-server/queue/tasks/webhook";
import { ErrorReporter } from "coral-server/services/errors";
import { I18n, I18nService } from "coral-server/services/i18n";
import {
  JWTSigningConfigService,
  SigningConfig,
} from "coral-server/services/jwt";
import { MONGO, Mongo } from "coral-server/services/mongodb";
import { REDIS, Redis } from "coral-server/services/redis";
import { TenantCache } from "coral-server/services/tenant/cache";
import { Request } from "coral-server/types/express";

import loaders from "./loaders";
import mutators from "./mutators";
import { PubSubService } from "./subscriptions/pubsub";

export interface GraphContextOptions {
  id: string;
  now: Date;
  tenant: Tenant;
  logger: Logger;

  clientID?: string;
  user?: User;

  // TODO: Scope down this request to simplify access.
  req?: Request;

  disableCaching?: boolean;
  persisted?: PersistedQuery;
  reporter?: ErrorReporter;
}

export default class GraphContext {
  // These references are currently resolved from the container.
  public readonly config: Config;
  public readonly i18n: I18n;
  public readonly mailerQueue: MailerQueue;
  public readonly mongo: Mongo;
  public readonly notifierQueue: NotifierQueue;
  public readonly pubsub: RedisPubSub;
  public readonly redis: Redis;
  public readonly rejectorQueue: RejectorQueue;
  public readonly scraperQueue: ScraperQueue;
  public readonly signingConfig: SigningConfig;
  public readonly tenantCache: TenantCache;
  public readonly webhookQueue: WebhookQueue;

  public readonly reporter?: ErrorReporter;

  public readonly disableCaching: boolean;
  public readonly id: string;
  public readonly now: Date;
  public readonly logger: Logger;
  public readonly tenant: Tenant;
  public readonly req?: Request;
  public readonly clientID?: string;

  public readonly lang: LanguageCode;

  // TODO: move this somewhere else.
  public readonly persisted?: PersistedQuery;

  public readonly user?: User;

  // These loaders and mutators keep a reference of the context around. This
  // should in the future instead
  private _loaders: ReturnType<typeof loaders>;
  private _mutators: ReturnType<typeof mutators>;
  private _broker: CoralEventPublisherBroker;

  constructor(options: GraphContextOptions) {
    // TODO: Replace with DI.
    this.config = container.resolve<Config>(CONFIG);
    this.mongo = container.resolve<Mongo>(MONGO);
    this.redis = container.resolve<Redis>(REDIS);
    this.i18n = container.resolve(I18nService);
    this.mailerQueue = container.resolve(MailerQueue);
    this.notifierQueue = container.resolve(NotifierQueue);
    this.pubsub = container.resolve(PubSubService);
    this.rejectorQueue = container.resolve(RejectorQueue);
    this.scraperQueue = container.resolve(ScraperQueue);
    this.signingConfig = container.resolve(JWTSigningConfigService);
    this.tenantCache = container.resolve(TenantCache);
    this.webhookQueue = container.resolve(WebhookQueue);

    this.id = options.id;
    this.now = options.now;
    this.tenant = options.tenant;
    this.logger = options.logger;

    this.disableCaching = options.disableCaching || false;
    this.clientID = options.clientID;
    this.req = options.req;
    this.user = options.user;

    this.lang = options.tenant.locale;

    this.persisted = options.persisted;
    this.reporter = options.reporter;
  }

  /**
   * broker is a lazy reference to the broker instance that can be used to
   * report events.
   */
  public get broker() {
    if (this._broker) {
      return this._broker;
    }

    // Load and cache a reference for this broker.
    this._broker = container.resolve(CoralEventEmitter).instance(this);

    return this._broker;
  }

  /**
   * loaders is a lazy reference to the loaders object that can be used to load
   * content.
   */
  public get loaders() {
    if (this._loaders) {
      return this._loaders;
    }

    // Load and cache a reference for these loaders.
    this._loaders = loaders(this);

    return this._loaders;
  }

  /**
   * mutators is a lazy reference to the mutators object that can be used to
   * mutate content.
   */
  public get mutators() {
    if (this._mutators) {
      return this._mutators;
    }

    // Load and cache a reference for these mutators.
    this._mutators = mutators(this);

    return this._mutators;
  }
}
