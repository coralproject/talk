import Logger from "bunyan";
import { Db } from "mongodb";

import logger from "coral-server/logger";

interface Migration {
  indexes?(mongo: Db): Promise<void>;
  up?(mongo: Db, tenantID: string): Promise<void>;
  test?(mongo: Db, tenantID: string): Promise<void>;
  down?(mongo: Db, tenantID: string): Promise<void>;
}

abstract class Migration {
  public readonly name: string;
  public readonly id: number;
  public readonly logger: Logger;

  constructor(version: number, name: string) {
    this.id = version;
    this.name = name;
    this.logger = logger.child(
      {
        migrationName: this.name,
        migrationVersion: this.id,
      },
      true
    );
  }

  protected log(tenantID: string) {
    return this.logger.child({ tenantID }, true);
  }
}

export default Migration;
