export function createNotificationService(toast) {
  return {
    success(msg) {
      toast(msg, {type: 'success'});
    },
    error(msg) {
      toast(msg, {type: 'error'});
    },
    info(msg) {
      toast(msg, {type: 'info'});
    },
  };
}
