import t from 'coral-framework/services/i18n';

export function createValidator(condition, error) {
  return (v, values) => (condition(v, values) ? undefined : error);
}

export function composeValidators(...validators) {
  return value =>
    validators.reduce(
      (error, validator) => error || validator(value),
      undefined
    );
}

export const required = createValidator(v => !!v, t('validators.required'));

export const confirm = (key, msg) =>
  createValidator((v, data) => v === data[key], msg);

export const verifyEmail = createValidator(
  email => /^.+@.+\..+$/.test(email),
  t('validators.verify_email')
);

export const confirmEmail = key => confirm(key, t('validators.confirm_email'));

export const verifyPassword = createValidator(
  pass => /^(?=.{8,}).*$/.test(pass),
  t('validators.verify_password')
);

export const confirmPassword = key =>
  confirm(key, t('validators.confirm_password'));

export const verifyUsername = createValidator(
  username => /^[a-zA-Z0-9_]+$/.test(username),
  t('validators.verify_username')
);

export const verifyOrganizationName = createValidator(
  org => /^[a-zA-Z0-9_ ]+$/.test(org),
  t('validators.verify_organization_name')
);
