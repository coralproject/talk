import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import SignDialog from '../components/SignDialog';
import Button from 'coral-ui/components/Button';
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
  showSignInDialog,
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
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleResendVerification = this.handleResendVerification.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.addError = this.addError.bind(this);
  }

  static propTypes = {
    requireEmailConfirmation: PropTypes.bool.isRequired
  }

  componentWillMount () {
    this.props.checkLogin();
  }

  componentDidMount() {
    window.authCallback = this.props.facebookCallback;
    const {formData} = this.state;
    const errors = Object.keys(formData).reduce((map, prop) => {
      map[prop] = lang.t('signIn.requiredField');
      return map;
    }, {});
    this.setState({errors});
  }

  handleChange(e) {
    const {name, value} = e.target;
    this.setState(state => ({
      ...state,
      formData: {
        ...state.formData,
        [name]: value
      }
    }), () => {
      this.validation(name, value);
    });
  }

  handleChangeEmail(e) {
    const {value} = e.target;
    this.setState({emailToBeResent: value});
  }

  handleResendVerification(e) {
    e.preventDefault();
    this.props.requestConfirmEmail(this.state.emailToBeResent, pym.parentUrl || location.href)
      .then(() => {
        setTimeout(() => {

          // allow success UI to be shown for a second, and then close the modal
          this.props.handleClose();
        }, 2500);
      });
  }

  addError(name, error) {
    return this.setState(state => ({
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
    } else if (name === 'confirmPassword' && formData.confirmPassword !== formData.password) {
      addError('confirmPassword', lang.t('signIn.passwordsDontMatch'));
    } else if (!validate[name](value)) {
      addError(name, errorMsj[name]);
    } else {
      const { [name]: prop, ...errors } = this.state.errors; // eslint-disable-line
      // Removes Error
      this.setState(state => ({...state, errors}));
    }
  }

  isCompleted() {
    const {formData} = this.state;
    return !Object.keys(formData).filter(prop => !formData[prop].length).length;
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
    this.props.fetchSignIn(this.state.formData)
      .then(this.props.refetch);
  }

  render() {
    const {auth, showSignInDialog, noButton, offset, requireEmailConfirmation} = this.props;
    const {emailVerificationLoading, emailVerificationSuccess} = auth;

    return (
      <div>
        {!noButton && <Button id='coralSignInButton' onClick={showSignInDialog} full>
          Sign in to comment
        </Button>}
        <SignDialog
          open={auth.showSignInDialog}
          view={auth.view}
          offset={offset}
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

const mapStateToProps = state => ({
  auth: state.auth.toJS()
});

const mapDispatchToProps = dispatch => ({
  checkLogin: () => dispatch(checkLogin()),
  facebookCallback: (err, data) => dispatch(facebookCallback(err, data)),
  fetchSignUp: (formData, url) => dispatch(fetchSignUp(formData, url)),
  fetchSignIn: formData => dispatch(fetchSignIn(formData)),
  fetchSignInFacebook: () => dispatch(fetchSignInFacebook()),
  fetchSignUpFacebook: () => dispatch(fetchSignUpFacebook()),
  fetchForgotPassword: formData => dispatch(fetchForgotPassword(formData)),
  requestConfirmEmail: (email, url) => dispatch(requestConfirmEmail(email, url)),
  showSignInDialog: () => dispatch(showSignInDialog()),
  changeView: view => dispatch(changeView(view)),
  handleClose: () => dispatch(hideSignInDialog()),
  invalidForm: error => dispatch(invalidForm(error)),
  validForm: () => dispatch(validForm())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignInContainer);
