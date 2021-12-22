const DAY_MILLIS = 1000 * 60 * 60 * 24;
const millisToDays = (millis: number): number =>
  Math.floor(millis / DAY_MILLIS);

export default millisToDays;
