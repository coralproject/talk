import { singleton } from "tsyringe";

import { ScheduledJob, ScheduledJobCommand } from "coral-server/scheduled/job";

import { GQLDIGEST_FREQUENCY } from "coral-server/graph/schema/__generated__/types";

import { NotificationDigester } from "./digester";

@singleton()
export class DailyNotificationDigestingJob extends ScheduledJob {
  constructor(private readonly digester: NotificationDigester) {
    super("Daily Notification Digesting", "0 0 * * *");
  }

  protected run: ScheduledJobCommand = () =>
    this.digester.run(GQLDIGEST_FREQUENCY.DAILY);
}
