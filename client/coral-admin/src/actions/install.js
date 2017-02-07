import coralApi from 'coral-framework/helpers/response';
import * as actions from '../constants/install';

// import validate from 'coral-framework/helpers/validate';
// import errorMsj from 'coral-framework/helpers/error';

export const nextStep = () => ({type: actions.NEXT_STEP});
export const previousStep = () => ({type: actions.PREVIOUS_STEP});
export const goToStep = step => ({type: actions.GO_TO_STEP, step});

const installRequest = () => ({type: actions.INSTALL_REQUEST});
const installSuccess = () => ({type: actions.INSTALL_SUCCESS});
const installFailure = error => ({type: actions.INSTALL_FAILURE, error});

export const submit = () => (dispatch, getState) => {
  const formData = getState().install.toJS().data;
  console.log('Handling Submit');
  console.log(formData.settings);

  if (!(formData.settings != null)) {
    return console.log('Validation Failed');
  }

  const empty = Object.keys(formData.settings).filter(name => {
    console.log(name);
    return !formData.settings[name].length;
  });

  console.log(
    empty
  );

  // const empty = Object.keys(formData.settings)
  //   .filter(name => !formData[name].length)

  // console.log(
  //   empty
  // )
  // if (empty.length) {
  //   console.log('Validation Failed')
  // }
    // .filter(name => data[name])

};

export const install = () => dispatch => {
  dispatch(installRequest());
  coralApi('/setup')
    .then(result => {
      console.log(result);
      dispatch(installSuccess());
    })
    .catch(error => {
      console.error(error);
      dispatch(installFailure(`${error.message}`));
    });
};

export const updateSettingsFormData = (name, value) => ({
  type: actions.UPDATE_FORMDATA_SETTINGS,
  name,
  value
});

export const updateUserFormData = (name, value) => ({
  type: actions.UPDATE_FORMDATA_USER,
  name,
  value
});
