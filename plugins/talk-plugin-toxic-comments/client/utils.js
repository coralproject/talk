export function isToxic(actions) {
  return actions.some(
    action =>
      action.__typename === 'FlagAction' && action.reason === 'TOXIC_COMMENT'
  );
}
