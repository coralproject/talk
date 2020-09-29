import { injectAll, registry, singleton } from "tsyringe";

import { ScheduledJob } from "./job";
import {
  DailyNotificationDigestingJob,
  HourlyNotificationDigestingJob,
  TwiceHourlyAccountDeletionJob,
} from "./jobs";

export const JOB = Symbol("JOB");

@singleton()
@registry([
  { token: JOB, useClass: DailyNotificationDigestingJob },
  { token: JOB, useClass: HourlyNotificationDigestingJob },
  { token: JOB, useClass: TwiceHourlyAccountDeletionJob },
])
export class ScheduledJobsService {
  constructor(@injectAll(JOB) private readonly jobs: ScheduledJob[]) {}

  /**
   * start will start all the available scheduled jobs.
   */
  public start() {
    for (const job of this.jobs) {
      job.start();
    }
  }
}
