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
