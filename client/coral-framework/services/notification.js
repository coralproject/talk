/**
 * createNotificationService returns a notification services based on pym.
 * @param  {Object}  pym
 * @return {Object}  notification service
 */
export function createNotificationService(pym) {
  return {
    success(text) {
      pym.sendMessage('coral-alert', JSON.stringify({ kind: 'success', text }));
    },
    error(text) {
      pym.sendMessage('coral-alert', JSON.stringify({ kind: 'error', text }));
    },
    info(text) {
      pym.sendMessage('coral-alert', JSON.stringify({ kind: 'info', text }));
    },
  };
}
