import { CronCommand, CronJob } from "cron";
import { v1 as uuid } from "uuid";

import { createTimer } from "coral-server/helpers";
import logger, { Logger } from "coral-server/logger";

export type ScheduledJobCommand = (logger: Logger) => Promise<void>;

export abstract class ScheduledJob {
  private readonly logger: Logger;
  private readonly job: CronJob;

  constructor(name: string, cronTime: string) {
    this.logger = logger.child(
      {
        jobName: name,
        jobFrequency: cronTime,
      },
      true
    );

    this.job = new CronJob({
      cronTime,
      onTick: this.command.bind(this),
      timeZone: "America/New_York",
      start: false,
      runOnInit: false,
    });
  }

  public start() {
    this.job.start();
    this.logger.debug("now started job scheduling");
  }

  protected abstract run(logger: Logger): Promise<void>;

  private command = (): CronCommand => async () => {
    const log = this.logger.child({ scheduledExecutionID: uuid() }, true);
    log.info("now starting scheduled job");
    const timer = createTimer();
    try {
      await this.run(log);
      log.info({ took: timer() }, "now finished scheduled job");
    } catch (err) {
      log.error({ err, took: timer() }, "failed to run scheduled job");
    }
  };
}
