/**
 * TIME represends various constants for second representations of times.
 */
enum TIME {
  SECOND = 1,
  MINUTE = 60 * TIME.SECOND,
  HOUR = 60 * TIME.MINUTE,
  DAY = 24 * TIME.HOUR,
  WEEK = 7 * TIME.DAY,
}

export default TIME;
