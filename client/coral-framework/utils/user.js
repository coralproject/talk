/**
 * getReliability
 * retrieves reliability value as string
 */
  
export const getReliability = (reliabilityValue) => {
  if (reliabilityValue === null) {
    return 'neutral';
  } else if (reliabilityValue) {
    return 'reliable';
  } else {
    return 'unreliable';
  }
};
