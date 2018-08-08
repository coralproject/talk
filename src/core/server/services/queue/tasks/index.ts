import Queue, { Job, Queue as QueueType } from "bull";

import logger from "talk-server/logger";

export interface TaskOptions<T, U = any> {
  jobName: string;
  jobProcessor: (job: Job<T>) => Promise<U>;
  queue: Queue.QueueOptions;
}

export class Task<T, U = any> {
  private options: TaskOptions<T, U>;
  private queue: QueueType<T>;

  constructor(options: TaskOptions<T, U>) {
    this.queue = new Queue(options.jobName, options.queue);
    this.options = options;

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
    const job = await this.queue.add(this.options.jobName, data, {
      // We always remove the job when it's complete, no need to fill up Redis
      // with completed entries if we don't need to.
      removeOnComplete: true,
    });

    logger.trace(
      { job_id: job.id, job_name: this.options.jobName },
      "added job to queue"
    );

    return job;
  }

  private setupAndAttachProcessor() {
    this.queue.process(async (job: Job<T>) => {
      logger.trace(
        { job_id: job.id, job_name: this.options.jobName },
        "processing job from queue"
      );

      // Send the job off to the job processor to be handled.
      const promise: U = await this.options.jobProcessor(job);

      logger.trace(
        { job_id: job.id, job_name: this.options.jobName },
        "processing completed"
      );

      return promise;
    });

    logger.trace(
      { job_name: this.options.jobName },
      "registered processor for job type"
    );
  }
}
