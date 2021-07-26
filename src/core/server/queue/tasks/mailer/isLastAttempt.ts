export const isLastAttempt = (attemptsMade: number, limit: number) => {
  // On the last attempt, the `attemptsMade` will be one less than the limit
  // as we have already _attempted_ `limit - 1` times.
  return attemptsMade >= limit - 1;
};
