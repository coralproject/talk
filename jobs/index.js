const mailer = require('./mailer');
const scraper = require('./scraper');
const { createLogger } = require('../services/logging');
const logger = createLogger('jobs');

const jobs = { mailer, scraper };

const process = (...disabledJobs) =>
  Object.entries(jobs).forEach(([taskName, taskFnc]) => {
    if (disabledJobs.includes(taskName)) {
      logger.info({ taskName }, 'Not starting job, disabled');
      return;
    }

    logger.info({ taskName }, 'Starting job');

    taskFnc();
  });

module.exports = { process };
