import t from 'coral-framework/services/i18n';

const DECIMAL_AMOUNT = 1;

export function humanizeNumber(number) {
  const abs = Math.abs(number);

  if (abs >= 1e9) {
    number = `${(number / 1e9).toFixed(DECIMAL_AMOUNT)}${t(
      'modqueue.billion'
    )}`;
  } else if (abs >= 1e6) {
    number = `${(number / 1e6).toFixed(DECIMAL_AMOUNT)}${t(
      'modqueue.million'
    )}`;
  } else if (abs >= 1e3) {
    number = `${(number / 1e3).toFixed(DECIMAL_AMOUNT)}${t(
      'modqueue.thousand'
    )}`;
  }
  return number;
}
