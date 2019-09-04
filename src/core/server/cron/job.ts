import { CronCommand, CronJob } from "cron";
import now from "performance-now";

import logger, { Logger } from "coral-server/logger";

export type JobCommand = (job: ScheduledJob) => Promise<void>;

interface Options {
  name: string;
  cronTime: string;
  command: JobCommand;
}

export class ScheduledJob {
  public readonly job: CronJob;
  public readonly log: Logger;

  constructor({ name, cronTime, command }: Options) {
    this.log = logger.child({ jobName: name, jobFrequency: cronTime });
    this.job = new CronJob({
      cronTime,
      onTick: this.command(command),
      timeZone: "America/New_York",
      start: false,
      runOnInit: true,
    });
  }

  private command(command: JobCommand): CronCommand {
    return async () => {
      this.log.debug("now starting scheduled job");
      const start = now();
      try {
        await command(this);
        const processingTime = Math.floor(now() - start);
        this.log.debug({ processingTime }, "now finished scheduled job");
      } catch (err) {
        const processingTime = Math.floor(now() - start);
        this.log.error({ err, processingTime }, "failed to run scheduled job");
      }
    };
  }
}

export interface ScheduledJobGroup {
  name: string;
  schedulers: ScheduledJob[];
}
