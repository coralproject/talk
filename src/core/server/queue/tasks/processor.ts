import { Job } from "bull";
import { Logger } from "coral-server/logger";
import { TenantResource } from "coral-server/models/tenant";

export type ProcessorHandler<T, U = void> = (
  logger: Logger,
  job: Job<T>
) => Promise<U>;

export interface Processor<T extends TenantResource, U = void> {
  process: ProcessorHandler<T, U>;
}
