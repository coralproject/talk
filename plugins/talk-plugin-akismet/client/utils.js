export function isSpam(actions) {
  return actions.some(
    action =>
      action.__typename === 'FlagAction' && action.reason === 'SPAM_COMMENT'
  );
}
