/**
 * roundRating will round the number in a predictable way.
 *
 * @param rating the rating to round
 * @param precision the precision to round the rating to
 */
function roundRating(rating: number, precision = 1): number {
  if (precision <= 0) {
    return Math.floor(rating);
  }

  // The following ensures that the average is truncated but is still returned
  // as a float.
  const rounder = Math.pow(10, precision);
  return Math.floor(rating * rounder) / rounder;
}

export default roundRating;
