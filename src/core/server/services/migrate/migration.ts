import Logger from "bunyan";
import { Collection } from "mongodb";

import { MongoContext } from "coral-server/data/context";
import logger from "coral-server/logger";
import { TenantResource } from "coral-server/models/tenant";
import { I18n } from "coral-server/services/i18n";

import Batch from "./batch";

interface Migration {
  indexes?(mongo: MongoContext): Promise<void>;
  up?(mongo: MongoContext, tenantID: string): Promise<void>;
  test?(mongo: MongoContext, tenantID: string): Promise<void>;
  down?(mongo: MongoContext, tenantID: string): Promise<void>;
}

export interface MigrationOptions {
  id: number;
  name: string;
  i18n: I18n;
}

abstract class Migration {
  public readonly name: string;
  public readonly id: number;
  public readonly logger: Logger;
  public readonly i18n: I18n;

  /**
   * disabled when true will not run the migration.
   */
  public static readonly disabled?: boolean;

  constructor({ id, name, i18n }: MigrationOptions) {
    this.id = id;
    this.name = name;
    this.i18n = i18n;
    this.logger = logger.child(
      {
        migrationName: this.name,
        migrationID: this.id,
      },
      true
    );
  }

  protected log(tenantID: string) {
    return this.logger.child({ tenantID }, true);
  }

  protected batch<T extends TenantResource>(
    collection: Collection<T>,
    tenantID: string,
    size = 500
  ) {
    return new Batch(this.log(tenantID), collection, size, tenantID);
  }
}

export default Migration;
