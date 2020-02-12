import { Collection, FilterQuery, UpdateQuery } from "mongodb";

import { Logger } from "coral-server/logger";
import { TenantResource } from "coral-server/models/tenant";

interface UpdateOneOperation<T> {
  updateOne: {
    filter: FilterQuery<T>;
    update: UpdateQuery<T>;
  };
}

type Operation<T> = UpdateOneOperation<T>;

class Batch<T extends TenantResource> {
  private readonly logger: Logger;
  private readonly collection: Collection<T>;
  private readonly maxBatchSize: number;
  private readonly tenantID: string;
  private updates: Array<Operation<T>> = [];

  constructor(
    logger: Logger,
    collection: Collection<T>,
    maxBatchSize: number,
    tenantID: string
  ) {
    this.logger = logger;
    this.collection = collection;
    this.maxBatchSize = maxBatchSize;
    this.tenantID = tenantID;
  }

  private async execute() {
    // Write out the updates, indicating that the writes can occur out of order.
    const result = await this.collection.bulkWrite(this.updates, {
      ordered: false,
    });

    this.logger.info(
      {
        updates: this.updates.length,
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
        collection: this.collection.collectionName,
      },
      "executed bulk write for batch operation"
    );

    // Clear the pending updates.
    this.updates = [];
  }

  public async add(filter: FilterQuery<T>, update: UpdateQuery<T>) {
    // Add the update to the list of updates.
    this.updates.push({
      updateOne: {
        filter: {
          // Merge the filter in with the tenantID.
          ...filter,
          tenantID: this.tenantID,
        },
        update,
      },
    });

    // Check to see if we need to execute this batch.
    if (this.updates.length >= this.maxBatchSize) {
      await this.execute();
    }
  }

  public async finish() {
    if (this.updates.length > 0) {
      await this.execute();
    }
  }
}

export default Batch;
