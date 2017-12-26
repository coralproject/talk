import t from 'coral-framework/services/i18n';

/**
 * getReliability
 * retrieves reliability value as string
 */

export const getReliability = (reliabilityValue) => {
  if (reliabilityValue === null) {
    return t('reliability.neutral');
  } else if (reliabilityValue) {
    return t('reliability.reliable');
  } else {
    return t('reliability.unreliable');
  }
};
