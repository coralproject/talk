import React from 'react';
import { connect } from 'react-redux';
import SignDialog from './SignDialog';
import { bindActionCreators } from 'redux';
import t from 'coral-framework/services/i18n';
import errorMsj from 'coral-framework/helpers/error';
import validate from 'coral-framework/helpers/validate';

import {
  changeView,
  fetchSignUp,
  fetchSignIn,
  hideSignInDialog,
  fetchSignInFacebook,
  fetchSignUpFacebook,
  fetchForgotPassword,
  requestConfirmEmail,
  resetSignInDialog,
  facebookCallback,
  invalidForm,
  validForm,
} from 'coral-embed-stream/src/actions/auth';

class SignInContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
      },
      errors: {},
      showErrors: false,
    };
  }

  componentDidMount() {
    window.addEventListener('storage', this.handleAuth);

    const { formData } = this.state;
    const errors = Object.keys(formData).reduce((map, prop) => {
      map[prop] = t('sign_in.required_field');
      return map;
    }, {});
    this.setState({ errors });
  }

  componentWillUnmount() {
    window.removeEventListener('storage', this.handleAuth);
  }

  handleAuth = e => {
    // Listening to FB changes
    // FB localStorage key is 'auth'
    const authCallback = this.props.facebookCallback;

    if (e.key === 'auth') {
      const { err, data } = JSON.parse(e.newValue);
      authCallback(err, data);
    }
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState(
      state => ({
        ...state,
        formData: {
          ...state.formData,
          [name]: value,
        },
      }),
      () => {
        this.validation(name, value);
      }
    );
  };

  resendVerification = () => {
    this.props.requestConfirmEmail(this.props.auth.email).then(() => {
      setTimeout(() => {
        // allow success UI to be shown for a second, and then close the modal
        this.props.resetSignInDialog();
      }, 2500);
    });
  };

  addError = (name, error) => {
    return this.setState(state => ({
      errors: {
        ...state.errors,
        [name]: error,
      },
    }));
  };

  validation = (name, value) => {
    const { addError } = this;
    const { formData } = this.state;

    if (!value.length) {
      addError(name, t('sign_in.required_field'));
    } else if (
      name === 'confirmPassword' &&
      formData.confirmPassword !== formData.password
    ) {
      addError('confirmPassword', t('sign_in.passwords_dont_match'));
    } else if (!validate[name](value)) {
      addError(name, errorMsj[name]);
    } else {
      const {[name]: prop, ...errors} = this.state.errors; // eslint-disable-line
      // Removes Error
      this.setState(state => ({ ...state, errors }));
    }
  };

  isCompleted = () => {
    const { formData } = this.state;
    return !Object.keys(formData).filter(prop => !formData[prop].length).length;
  };

  displayErrors = (show = true) => {
    this.setState({ showErrors: show });
  };

  handleSignUp = e => {
    e.preventDefault();
    const { errors } = this.state;
    const { fetchSignUp, validForm, invalidForm } = this.props;
    this.displayErrors();
    if (this.isCompleted() && !Object.keys(errors).length) {
      fetchSignUp(this.state.formData);
      validForm();
    } else {
      invalidForm(t('sign_in.check_the_form'));
    }
  };

  handleSignIn = e => {
    e.preventDefault();
    this.props.fetchSignIn(this.state.formData);
  };

  render() {
    const { auth } = this.props;
    const {
      requireEmailConfirmation,
      emailVerificationLoading,
      emailVerificationSuccess,
    } = auth;

    return (
      <SignDialog
        open={true}
        view={auth.view}
        emailVerificationEnabled={requireEmailConfirmation}
        emailVerificationLoading={emailVerificationLoading}
        emailVerificationSuccess={emailVerificationSuccess}
        {...this}
        {...this.state}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      facebookCallback,
      fetchSignUp,
      fetchSignIn,
      fetchSignInFacebook,
      fetchSignUpFacebook,
      fetchForgotPassword,
      requestConfirmEmail,
      changeView,
      hideSignInDialog,
      resetSignInDialog,
      invalidForm,
      validForm,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(SignInContainer);
