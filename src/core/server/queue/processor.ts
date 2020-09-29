import { Job } from "bull";
import { Logger } from "coral-server/logger";
import { TenantResource } from "coral-server/models/tenant";

export type JobProcessorHandler<T, U = void> = (
  logger: Logger,
  job: Job<T>
) => Promise<U>;

export interface JobProcessor<T extends TenantResource, U = void> {
  process: JobProcessorHandler<T, U>;
}
