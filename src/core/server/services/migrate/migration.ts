import { Db } from "mongodb";

import logger from "coral-server/logger";

interface Migration {
  test?(mongo: Db, tenantID: string): Promise<void>;
  down?(mongo: Db, tenantID: string): Promise<void>;
}

abstract class Migration {
  public readonly name: string;
  public readonly version: number;

  constructor(version: number, name: string) {
    this.version = version;
    this.name = name;
  }

  protected log(tenantID: string) {
    return logger.child(
      {
        tenantID,
        migrationName: this.name,
        migrationVersion: this.version,
      },
      true
    );
  }

  public abstract async up(mongo: Db, tenantID: string): Promise<void>;
}

export default Migration;
