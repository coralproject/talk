import t from 'coral-framework/services/i18n';

/**
 * createNotificationService returns a notification services based on pym.
 * @param  {func}    condition   callback that checks that the given argument is valid.
 * @param  {error}   string      error that is displayed when validation fails.
 * @return {func}    validator function
 */
export function createValidator(condition, error) {
  return (v, values) => (condition(v, values) ? undefined : error);
}

/**
 * composeValidators chains validators and runs them in sequence until
 * one validator fails and returns an error message.
 * @param  {func[]}  validators         array of validator functions.
 * @return {func}    validator fuction
 */
export function composeValidators(...validators) {
  return value =>
    validators.reduce(
      (error, validator) => error || validator(value),
      undefined
    );
}

/**
 * required checks that the value is truthy.
 * @return {func}    validator fuction
 */
export const required = createValidator(v => !!v, t('validators.required'));

/**
 * Confirm will check that this field has the same value as another.
 * @param  {string}  key  key of other form field to compare with.
 * @param  {error}   string      error that is displayed when validation fails.
 * @return {func}    validator fuction
 */
export const confirm = (key, error) =>
  createValidator((v, data) => v === data[key], error);

/**
 * Verify email.
 * @return {func}    validator fuction
 */
export const verifyEmail = createValidator(
  email => /^.+@.+\..+$/.test(email),
  t('validators.verify_email')
);

/**
 * Confirm email.
 * @param  {string}  key  key of other form field to compare with.
 * @return {func}    validator fuction
 */
export const confirmEmail = key => confirm(key, t('validators.confirm_email'));

/**
 * Verify password.
 * @return {func}    validator fuction
 */
export const verifyPassword = createValidator(
  pass => /^(?=.{8,}).*$/.test(pass),
  t('validators.verify_password')
);

/**
 * Confirm password.
 * @param  {string}  key  key of other form field to compare with.
 * @return {func}    validator fuction
 */
export const confirmPassword = key =>
  confirm(key, t('validators.confirm_password'));

/**
 * Verify username.
 * @return {func}    validator fuction
 */
export const verifyUsername = createValidator(
  username => /^[a-zA-Z0-9_]+$/.test(username),
  t('validators.verify_username')
);

/**
 * Verify organization name.
 * @return {func}    validator fuction
 */
export const verifyOrganizationName = createValidator(
  org => /^[a-zA-Z0-9_ ]+$/.test(org),
  t('validators.verify_organization_name')
);
