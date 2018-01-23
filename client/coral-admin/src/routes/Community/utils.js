export function isFlaggedUserDangling(user) {
  return ['APPROVED', 'REJECTED'].includes(user.state.status.username.status);
}
