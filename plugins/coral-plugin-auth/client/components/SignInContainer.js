import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import SignDialog from './SignDialog';
import validate from 'coral-framework/helpers/validate';
import errorMsj from 'coral-framework/helpers/error';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations';
import {pym} from 'coral-framework';
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

class SignInContainer extends Component {
  initialState = {
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

  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.addError = this.addError.bind(this);
    this.handleAuth = this.handleAuth.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleResendVerification = this.handleResendVerification.bind(this);
  }

  static propTypes = {
    requireEmailConfirmation: PropTypes.bool.isRequired
  };

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

  handleAuth(e) {

    // Listening to FB changes
    // FB localStorage key is 'auth'
    const authCallback = this.props.facebookCallback;

    if (e.key === 'auth') {
      const {err, data} = JSON.parse(e.newValue);
      authCallback(err, data);
    }
  }

  handleChange(e) {
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
  }

  handleChangeEmail(e) {
    const {value} = e.target;
    this.setState({emailToBeResent: value});
  }

  handleResendVerification(e) {
    e.preventDefault();
    this.props
      .requestConfirmEmail(
        this.state.emailToBeResent,
        pym.parentUrl || location.href
      )
      .then(() => {
        setTimeout(() => {

          // allow success UI to be shown for a second, and then close the modal
          this.props.handleClose();
        }, 2500);
      });
  }

  addError(name, error) {
    return this.setState((state) => ({
      errors: {
        ...state.errors,
        [name]: error
      }
    }));
  }

  validation(name, value) {
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
  }

  isCompleted() {
    const {formData} = this.state;
    return !Object.keys(formData).filter((prop) => !formData[prop].length).length;
  }

  displayErrors(show = true) {
    this.setState({showErrors: show});
  }

  handleSignUp(e) {
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
  }

  handleSignIn(e) {
    e.preventDefault();
    this.props.fetchSignIn(this.state.formData);
  }

  render() {
    const {auth, requireEmailConfirmation} = this.props;
    const {emailVerificationLoading, emailVerificationSuccess} = auth;

    return (
      <div>
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
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth.toJS()
});

const mapDispatchToProps = (dispatch) => ({
  checkLogin: () => dispatch(checkLogin()),
  facebookCallback: (err, data) => dispatch(facebookCallback(err, data)),
  fetchSignUp: (formData, url) => dispatch(fetchSignUp(formData, url)),
  fetchSignIn: (formData) => dispatch(fetchSignIn(formData)),
  fetchSignInFacebook: () => dispatch(fetchSignInFacebook()),
  fetchSignUpFacebook: () => dispatch(fetchSignUpFacebook()),
  fetchForgotPassword: (formData) => dispatch(fetchForgotPassword(formData)),
  requestConfirmEmail: (email, url) =>
    dispatch(requestConfirmEmail(email, url)),
  changeView: (view) => dispatch(changeView(view)),
  handleClose: () => dispatch(hideSignInDialog()),
  invalidForm: (error) => dispatch(invalidForm(error)),
  validForm: () => dispatch(validForm())
});

export default connect(mapStateToProps, mapDispatchToProps)(SignInContainer);
