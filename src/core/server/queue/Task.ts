import Queue, { Job, JobCounts, Queue as QueueType } from "bull";
import Logger from "bunyan";
import timeoutPromiseAfter from "p-timeout";

import { createTimer } from "coral-server/helpers";
import logger from "coral-server/logger";
import { TenantResource } from "coral-server/models/tenant";

import { JobProcessor } from "./processor";

interface Options<T extends TenantResource, U = void> {
  name: string;
  processor: JobProcessor<T, U>;
  options?: Queue.JobOptions;
  queue: Queue.QueueOptions;
  timeout?: number;
}

export default class Task<T extends TenantResource, U = any> {
  private readonly log: Logger;
  private readonly options: Queue.JobOptions;
  private readonly processor: JobProcessor<T, U>;
  private readonly queue: QueueType<T>;
  private readonly timeout: number;

  constructor({
    processor,
    options = {},
    queue,
    timeout = 30 * 1000,
  }: Options<T, U>) {
    this.log = logger.child({ jobName: name }, true);
    this.options = {
      // We always remove the job when it's complete, no need to fill up Redis
      // with completed entries if we don't need to.
      removeOnComplete: true,

      // Remove the job if it fails after all attempts.
      removeOnFail: true,

      // By default, configure jobs to use an exponential backoff strategy.
      backoff: {
        type: "exponential",
        delay: 10 * 1000,
      },

      // Be default, try all jobs at least 5 times.
      attempts: 5,

      // Add the custom job options if they exist.
      ...options,
    };
    this.processor = processor;
    this.queue = new Queue(name, queue);
    this.timeout = timeout;

    // TODO: (wyattjoh) attach event handlers to the queue for metrics via: https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#events
  }

  public async counts(): Promise<JobCounts> {
    return this.queue.getJobCounts();
  }

  /**
   * Add will add the job to the queue to get processed. It's not needed to
   * handle the job after it has been created.
   *
   * @param data the data for the job to add.
   */
  public async add(data: T): Promise<Queue.Job<T> | undefined> {
    // Create the job.
    const job = await this.queue.add(data, this.options);

    this.log.info({ jobID: job.id }, "added job to queue");

    return job;
  }

  /**
   * process will connect the queue to the processor so that it may process the
   * job requests.
   */
  public process() {
    // We don't handle this error here so that if the process is no longer being
    // ran, we should throw an error to crash the process.
    void this.queue.process(async (job: Job<T>) => {
      const log = this.log.child(
        { jobID: job.id, attemptsMade: job.attemptsMade },
        true
      );

      const timer = createTimer();
      log.info("processing job from queue");

      try {
        // Send the job off to the job processor to be handled. If the
        // processing of the job takes too long time it out.
        const promise: U = await timeoutPromiseAfter(
          this.processor.process(log, job),
          this.timeout
        );

        // Log it!
        log.info({ took: timer() }, "processing completed");

        return promise;
      } catch (err) {
        log.error({ err, took: timer() }, "job failed to process");
        throw err;
      }
    });

    // When an error occurs with the job processor, handle the error by logging
    // it and re-throwing it to crash the process.
    this.queue.on("error", (err: Error) => {
      this.log.fatal({ err }, "failed to handle error from job");
      process.exit(1);
    });

    this.log.trace("registered processor for job type");
  }
}
