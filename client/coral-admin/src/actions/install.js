import coralApi from 'coral-framework/helpers/response';
import * as actions from '../constants/install';
import validate from 'coral-framework/helpers/validate';
import errorMsj from 'coral-framework/helpers/error';

export const nextStep = () => ({type: actions.NEXT_STEP});
export const previousStep = () => ({type: actions.PREVIOUS_STEP});
export const goToStep = step => ({type: actions.GO_TO_STEP, step});

const installRequest = () => ({type: actions.INSTALL_REQUEST});
const installSuccess = () => ({type: actions.INSTALL_SUCCESS});
const installFailure = error => ({type: actions.INSTALL_FAILURE, error});

const addError = (name, error) => ({type: actions.ADD_ERROR, name, error});
const hasError = error => ({type: actions.HAS_ERROR, error});
const clearErrors = () => ({type: actions.CLEAR_ERRORS});

const validation = (formData, dispatch, next) => {
  if (!(formData != null)) {
    return dispatch(hasError());
  }

  // Required Validation
  const empty = Object.keys(formData).filter(name => {
    const cond = !formData[name].length;

    if (cond) {

      // Adding Error
      dispatch(addError(name, 'Please, fill this field '));
    } else {
      dispatch(addError(name, ''));
    }

    return cond;
  });

  if (empty.length) {
    return dispatch(hasError());
  }

  // RegExp Validation
  const validation = Object.keys(formData).filter(name => {
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
    return dispatch(hasError());
  }

  dispatch(clearErrors());
  next();
};

export const submitSettings = () => (dispatch, getState) => {
  const settingsFormData = getState().install.toJS().data.settings;
  validation(settingsFormData, dispatch, function() {
    dispatch(nextStep());
  });
};

export const submitUser = () => (dispatch, getState) => {
  const userFormData = getState().install.toJS().data.user;
  validation(userFormData, dispatch, function() {
    const data = getState().install.toJS().data;
    dispatch(installRequest());
    coralApi('/setup', {method: 'POST', body: data})
      .then(result => {
        console.log(result);
        dispatch(installSuccess());
        dispatch(nextStep());
      })
      .catch(error => {
        console.error(error);
        dispatch(installFailure(`${error.message}`));
      });
  });
};

export const updateSettingsFormData = (name, value) => ({type: actions.UPDATE_FORMDATA_SETTINGS, name, value});
export const updateUserFormData = (name, value) => ({type: actions.UPDATE_FORMDATA_USER, name, value});
