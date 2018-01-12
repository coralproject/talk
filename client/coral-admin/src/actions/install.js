import * as actions from '../constants/install';
import validate from 'coral-framework/helpers/validate';
import errorMsj from 'coral-framework/helpers/error';
import t from 'coral-framework/services/i18n';

export const nextStep = () => ({ type: actions.NEXT_STEP });
export const previousStep = () => ({ type: actions.PREVIOUS_STEP });
export const goToStep = step => ({ type: actions.GO_TO_STEP, step });

const installRequest = () => ({ type: actions.INSTALL_REQUEST });
const installSuccess = () => ({ type: actions.INSTALL_SUCCESS });
const installFailure = error => ({ type: actions.INSTALL_FAILURE, error });

const addError = (name, error) => ({ type: actions.ADD_ERROR, name, error });
const hasError = error => ({ type: actions.HAS_ERROR, error });
const clearErrors = () => ({ type: actions.CLEAR_ERRORS });

const validation = (formData, dispatch, next) => {
  if (!(formData != null)) {
    dispatch(hasError());
    return;
  }

  const validKeys = Object.keys(formData).filter(name => name !== 'domains');

  // Required Validation
  const empty = validKeys.filter(name => {
    const cond = !formData[name].length;

    if (cond) {
      // Adding Error
      dispatch(addError(name, 'This field is required.'));
    } else {
      dispatch(addError(name, ''));
    }

    return cond;
  });

  if (empty.length) {
    dispatch(hasError());
    return;
  }

  // RegExp Validation
  const validation = validKeys.filter(name => {
    const cond = !validate[name](formData[name]);
    if (cond) {
      // Adding Error
      dispatch(addError(name, errorMsj[name]));
    } else {
      dispatch(addError(name, ''));
    }

    return cond;
  });

  if (validation.length) {
    dispatch(hasError());
    return;
  }

  // Confirm Validation
  const prefixLength = 'confirm'.length;
  const confirm = validKeys.filter(name => {
    if (!name.startsWith('confirm')) {
      return false;
    }

    // Check that 'confirmX' equals 'X'.
    const other =
      name.substr(prefixLength, 1).toLowerCase() +
      name.substr(prefixLength + 1);
    const cond = formData[other] !== formData[name];
    if (cond) {
      dispatch(addError(name, errorMsj[name]));
    }
    return cond;
  });

  if (confirm.length) {
    dispatch(hasError());
    return;
  }

  dispatch(clearErrors());
  next();
};

export const submitSettings = () => (dispatch, getState) => {
  const settingsFormData = getState().install.data.settings;
  validation(settingsFormData, dispatch, function() {
    dispatch(nextStep());
  });
};

export const submitUser = () => (dispatch, getState) => {
  const userFormData = getState().install.data.user;
  validation(userFormData, dispatch, function() {
    dispatch(nextStep());
  });
};

export const finishInstall = () => (dispatch, getState, { rest }) => {
  const data = getState().install.data;
  dispatch(installRequest());
  return rest('/setup', { method: 'POST', body: data })
    .then(() => {
      dispatch(installSuccess());
      dispatch(nextStep());
    })
    .catch(error => {
      console.error(error);
      const errorMessage = error.translation_key
        ? t(`error.${error.translation_key}`)
        : error.toString();
      dispatch(installFailure(errorMessage));
    });
};

export const updateSettingsFormData = (name, value) => ({
  type: actions.UPDATE_FORMDATA_SETTINGS,
  name,
  value,
});
export const updateUserFormData = (name, value) => ({
  type: actions.UPDATE_FORMDATA_USER,
  name,
  value,
});
export const updatePermittedDomains = value => ({
  type: actions.UPDATE_PERMITTED_DOMAINS_SETTINGS,
  value,
});

const checkInstallRequest = () => ({ type: actions.CHECK_INSTALL_REQUEST });
const checkInstallSuccess = installed => ({
  type: actions.CHECK_INSTALL_SUCCESS,
  installed,
});
const checkInstallFailure = error => ({
  type: actions.CHECK_INSTALL_FAILURE,
  error,
});

export const checkInstall = next => async (dispatch, _, { rest }) => {
  dispatch(checkInstallRequest());

  try {
    const { installed } = await rest('/setup');
    dispatch(checkInstallSuccess(installed));
    if (installed) {
      next();
    }
  } catch (error) {
    console.error(error);
    const errorMessage = error.translation_key
      ? t(`error.${error.translation_key}`)
      : error.toString();
    dispatch(checkInstallFailure(errorMessage));
  }
};
