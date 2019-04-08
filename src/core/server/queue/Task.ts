import Queue, { Job, Queue as QueueType } from "bull";
import Logger from "bunyan";

import logger from "talk-server/logger";

export interface TaskOptions<T, U = any> {
  jobName: string;
  jobProcessor: (job: Job<T>) => Promise<U>;
  jobOptions?: Queue.JobOptions;
  queue: Queue.QueueOptions;
}

export default class Task<T, U = any> {
  private options: TaskOptions<T, U>;
  private queue: QueueType<T>;
  private log: Logger;

  constructor({
    jobName,
    jobProcessor,
    jobOptions = {},
    queue,
  }: TaskOptions<T, U>) {
    this.log = logger.child({ jobName });
    this.queue = new Queue(jobName, queue);
    this.options = {
      jobName,
      jobProcessor,
      jobOptions: {
        // We always remove the job when it's complete, no need to fill up Redis
        // with completed entries if we don't need to.
        removeOnComplete: true,

        // By default, configure jobs to use an exponential backoff
        // strategy starting at a 10 second delay.
        backoff: {
          type: "exponential",
          delay: 10000,
        },

        // Be default, try all jobs at least 5 times.
        attempts: 5,

        // Add the custom job options if they exist.
        ...jobOptions,
      },
      queue,
    };

    // TODO: (wyattjoh) attach event handlers to the queue for metrics via: https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#events
  }

  /**
   * Add will add the job to the queue to get processed. It's not needed to
   * handle the job after it has been created.
   *
   * @param data the data for the job to add.
   */
  public async add(data: T): Promise<Queue.Job<T> | undefined> {
    // Create the job.
    const job = await this.queue.add(data, this.options.jobOptions);

    this.log.trace({ jobID: job.id }, "added job to queue");
    return job;
  }

  /**
   * process will connect the queue to the processor so that it may process the
   * job requests.
   */
  public process() {
    this.queue.process(async (job: Job<T>) => {
      const log = this.log.child({ jobID: job.id });

      log.trace("processing job from queue");

      try {
        // Send the job off to the job processor to be handled.
        const promise: U = await this.options.jobProcessor(job);
        log.trace("processing completed");
        return promise;
      } catch (err) {
        log.error({ err }, "job failed to process");
        throw err;
      }
    });

    this.log.trace("registered processor for job type");
  }
}
