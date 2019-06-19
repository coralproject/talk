import CommonContext, {
  CommonContextOptions,
} from "coral-server/graph/common/context";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import { MailerQueue } from "coral-server/queue/tasks/mailer";
import { ScraperQueue } from "coral-server/queue/tasks/scraper";
import { JWTSigningConfig } from "coral-server/services/jwt";
import TenantCache from "coral-server/services/tenant/cache";

import loaders from "./loaders";
import mutators from "./mutators";

export interface TenantContextOptions extends CommonContextOptions {
  tenant: Tenant;
  tenantCache: TenantCache;
  mailerQueue: MailerQueue;
  scraperQueue: ScraperQueue;
  signingConfig?: JWTSigningConfig;
}

export default class TenantContext extends CommonContext {
  public readonly tenant: Tenant;
  public readonly tenantCache: TenantCache;

  public readonly mailerQueue: MailerQueue;
  public readonly scraperQueue: ScraperQueue;
  public readonly loaders: ReturnType<typeof loaders>;
  public readonly mutators: ReturnType<typeof mutators>;
  public readonly user?: User;
  public readonly signingConfig?: JWTSigningConfig;

  constructor(options: TenantContextOptions) {
    super({ ...options, lang: options.tenant.locale });

    this.tenant = options.tenant;
    this.tenantCache = options.tenantCache;
    this.scraperQueue = options.scraperQueue;
    this.mailerQueue = options.mailerQueue;
    this.signingConfig = options.signingConfig;
    this.loaders = loaders(this);
    this.mutators = mutators(this);
  }
}
