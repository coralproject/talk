import Queue, { Job, JobCounts, Queue as QueueType } from "bull";
import Logger from "bunyan";
import timeoutPromiseAfter from "p-timeout";

import { createTimer } from "coral-server/helpers";
import logger from "coral-server/logger";
import { TenantResource } from "coral-server/models/tenant";

export const MAX_JOB_ATTEMPTS = 5 as const;

export type JobProcessor<T, U = void> = (job: Job<T>) => Promise<U>;

interface TaskOptions<T, U = void> {
  jobName: string;
  jobProcessor: JobProcessor<T, U>;
  queue: Queue.QueueOptions;
  timeout?: number;
  jobIdGenerator?: null | ((data: T) => number | string);
}

export default class Task<T extends TenantResource, U = any> {
  private readonly queue: QueueType<T>;
  private readonly log: Logger;
  private readonly options: Queue.JobOptions;
  private readonly idGenerator: ((data: T) => number | string) | null;
  private readonly processor: JobProcessor<T, U>;
  private readonly timeout: number;

  constructor({
    jobName,
    jobProcessor,
    jobIdGenerator = null,
    queue,
    timeout = 30000,
  }: TaskOptions<T, U>) {
    this.log = logger.child({ jobName }, true);
    this.queue = new Queue(jobName, queue);
    this.options = {
      // We always remove the job when it's complete, no need to fill up Redis
      // with completed entries if we don't need to.
      removeOnComplete: true,

      // Remove the job if it fails after all attempts.
      removeOnFail: true,

      // By default, configure jobs to use an exponential backoff strategy.
      backoff: {
        type: "exponential",
        delay: 10000,
      },

      // Be default, try all jobs at least 5 times.
      attempts: MAX_JOB_ATTEMPTS,
    };
    this.idGenerator = jobIdGenerator;
    this.processor = jobProcessor;
    this.timeout = timeout;
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
    // Generate the ID if we need to.
    const options = { ...this.options };
    if (this.idGenerator) {
      options.jobId = this.idGenerator(data);
    }

    // Create the job.
    const job = await this.queue.add(data, options);

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
        {
          jobID: job.id,
          attemptsMade: job.attemptsMade,
          tenantID: job.data.tenantID,
        },
        true
      );

      const timer = createTimer();
      log.info("processing job from queue");

      try {
        // Send the job off to the job processor to be handled. If the
        // processing of the job takes too long time it out.
        const promise: U = await timeoutPromiseAfter(
          this.processor(job),
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
