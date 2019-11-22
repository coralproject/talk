import Logger from "bunyan";
import { Db } from "mongodb";

import logger from "coral-server/logger";
import { I18n } from "coral-server/services/i18n";

interface Migration {
  indexes?(mongo: Db): Promise<void>;
  up?(mongo: Db, tenantID: string): Promise<void>;
  test?(mongo: Db, tenantID: string): Promise<void>;
  down?(mongo: Db, tenantID: string): Promise<void>;
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
  public static disabled?: boolean;

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
}

export default Migration;
