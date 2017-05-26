import React from 'react';
import {connect} from 'react-redux';
import {pym} from 'coral-framework';
import SignDialog from './SignDialog';
import {bindActionCreators} from 'redux';
import translations from '../translations';
import I18n from 'coral-framework/modules/i18n/i18n';
import errorMsj from 'coral-framework/helpers/error';
import validate from 'coral-framework/helpers/validate';

const lang = new I18n(translations);

import {
  changeView,
  fetchSignUp,
  fetchSignIn,
  hideSignInDialog,
  fetchSignInFacebook,
  fetchSignUpFacebook,
  fetchForgotPassword,
  requestConfirmEmail,
  facebookCallback,
  invalidForm,
  validForm,
  checkLogin
} from 'coral-framework/actions/auth';

class SignInContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
      },
      emailToBeResent: '',
      errors: {},
      showErrors: false
    };
  }

  componentWillMount() {
    this.props.checkLogin();
  }

  componentDidMount() {
    window.addEventListener('storage', this.handleAuth);

    const {formData} = this.state;
    const errors = Object.keys(formData).reduce((map, prop) => {
      map[prop] = lang.t('signIn.requiredField');
      return map;
    }, {});
    this.setState({errors});
  }

  componentWillUnmount() {
    window.removeEventListener('storage', this.handleAuth);
  }

  handleAuth = (e) => {

    // Listening to FB changes
    // FB localStorage key is 'auth'
    const authCallback = this.props.facebookCallback;

    if (e.key === 'auth') {
      const {err, data} = JSON.parse(e.newValue);
      authCallback(err, data);
    }
  };

  handleChange = (e) => {
    const {name, value} = e.target;
    this.setState(
      (state) => ({
        ...state,
        formData: {
          ...state.formData,
          [name]: value
        }
      }),
      () => {
        this.validation(name, value);
      }
    );
  };

  handleChangeEmail = (e) => {
    const {value} = e.target;
    this.setState({emailToBeResent: value});
  };

  handleResendVerification = (e) => {
    e.preventDefault();
    this.props
      .requestConfirmEmail(
        this.state.emailToBeResent,
        pym.parentUrl || location.href
      )
      .then(() => {
        setTimeout(() => {

          // allow success UI to be shown for a second, and then close the modal
          this.props.hideSignInDialog();
        }, 2500);
      });
  };

  addError = (name, error) => {
    return this.setState((state) => ({
      errors: {
        ...state.errors,
        [name]: error
      }
    }));
  };

  validation = (name, value) => {
    const {addError} = this;
    const {formData} = this.state;

    if (!value.length) {
      addError(name, lang.t('signIn.requiredField'));
    } else if (
      name === 'confirmPassword' &&
      formData.confirmPassword !== formData.password
    ) {
      addError('confirmPassword', lang.t('signIn.passwordsDontMatch'));
    } else if (!validate[name](value)) {
      addError(name, errorMsj[name]);
    } else {
      const {[name]: prop, ...errors} = this.state.errors; // eslint-disable-line
      // Removes Error
      this.setState((state) => ({...state, errors}));
    }
  };

  isCompleted = () => {
    const {formData} = this.state;
    return !Object.keys(formData).filter((prop) => !formData[prop].length).length;
  };

  displayErrors = (show = true) => {
    this.setState({showErrors: show});
  };

  handleSignUp = (e) => {
    e.preventDefault();
    const {errors} = this.state;
    const {fetchSignUp, validForm, invalidForm} = this.props;
    this.displayErrors();
    if (this.isCompleted() && !Object.keys(errors).length) {
      fetchSignUp(this.state.formData, pym.parentUrl || location.href);
      validForm();
    } else {
      invalidForm(lang.t('signIn.checkTheForm'));
    }
  };

  handleSignIn = (e) => {
    e.preventDefault();
    this.props.fetchSignIn(this.state.formData);
  };

  render() {
    const {auth} = this.props;
    const {requireEmailConfirmation, emailVerificationLoading, emailVerificationSuccess} = auth;

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

const mapStateToProps = (state) => ({
  auth: state.auth.toJS()
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      checkLogin,
      facebookCallback,
      fetchSignUp,
      fetchSignIn,
      fetchSignInFacebook,
      fetchSignUpFacebook,
      fetchForgotPassword,
      requestConfirmEmail,
      changeView,
      hideSignInDialog,
      invalidForm,
      validForm
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(SignInContainer);
