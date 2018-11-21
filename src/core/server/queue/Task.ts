import Queue, { Job, Queue as QueueType } from "bull";
import Logger from "bunyan";

import logger from "talk-server/logger";

export interface TaskOptions<T, U = any> {
  jobName: string;
  jobProcessor: (job: Job<T>) => Promise<U>;
  queue: Queue.QueueOptions;
}

export default class Task<T, U = any> {
  private options: TaskOptions<T, U>;
  private queue: QueueType<T>;
  private log: Logger;

  constructor(options: TaskOptions<T, U>) {
    this.queue = new Queue(options.jobName, options.queue);
    this.options = options;
    this.log = logger.child({ jobName: options.jobName });

    // Sets up and attaches the job processor to the queue.
    this.setupAndAttachProcessor();
  }

  /**
   * Add will add the job to the queue to get processed. It's not needed to
   * handle the job after it has been created.
   *
   * @param data the data for the job to add.
   */
  public async add(data: T) {
    const job = await this.queue.add(data, {
      // We always remove the job when it's complete, no need to fill up Redis
      // with completed entries if we don't need to.
      removeOnComplete: true,
    });

    this.log.trace({ jobID: job.id }, "added job to queue");
    return job;
  }
  private setupAndAttachProcessor() {
    this.queue.process(async (job: Job<T>) => {
      const log = this.log.child({ jobID: job.id });

      log.trace("processing job from queue");

      // Send the job off to the job processor to be handled.
      const promise: U = await this.options.jobProcessor(job);
      log.trace("processing completed");
      return promise;
    });

    this.log.trace("registered processor for job type");
  }
}
