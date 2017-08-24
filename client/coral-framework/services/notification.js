/**
 * createNotificationService returns a notification services based on pym.
 * @param  {Object}  pym
 * @return {Object}  notification service
 */
export function createNotificationService(pym) {
  return {
    success(msg) {
      pym.sendMessage('coral-alert', `success|${msg}`);
    },
    error(msg) {
      pym.sendMessage('coral-alert', `error|${msg}`);
    },
    info(msg) {
      pym.sendMessage('coral-alert', `info|${msg}`);
    },
  };
}
