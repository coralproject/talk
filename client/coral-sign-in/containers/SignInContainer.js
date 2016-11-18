import React, {Component} from 'react';
import {connect} from 'react-redux';
import SignDialog from '../components/SignDialog';
import Button from 'coral-ui/components/Button';
import validate from 'coral-framework/helpers/validate';
import errorMsj from 'coral-framework/helpers/error';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations';
const lang = new I18n(translations);

import {
  changeView,
  fetchSignUp,
  fetchSignIn,
  showSignInDialog,
  hideSignInDialog,
  fetchSignInFacebook,
  fetchForgotPassword,
  facebookCallback,
  invalidForm,
  validForm
} from '../../coral-framework/actions/auth';

class SignInContainer extends Component {
  initialState = {
    formData: {
      email: '',
      displayName: '',
      password: '',
      confirmPassword: ''
    },
    errors: {},
    showErrors: false
  };

  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.handleChange = this.handleChange.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.addError = this.addError.bind(this);
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
      fetchSignUp(this.state.formData);
      validForm();
    } else {
      invalidForm(lang.t('signIn.checkTheForm'));
    }
  }

  handleSignIn(e) {
    e.preventDefault();
    this.props.fetchSignIn(this.state.formData);
  }

  handleClose() {
    this.props.hideSignInDialog();
  }

  render() {
    const {auth, showSignInDialog} = this.props;
    return (
      <div>
        <Button onClick={showSignInDialog}>
          Sign in to comment
        </Button>
        <SignDialog
          open={auth.showSignInDialog}
          view={auth.view}
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
  facebookCallback: (err, data) => dispatch(facebookCallback(err, data)),
  fetchSignUp: formData => dispatch(fetchSignUp(formData)),
  fetchSignIn: formData => dispatch(fetchSignIn(formData)),
  fetchSignInFacebook: () => dispatch(fetchSignInFacebook()),
  fetchForgotPassword: formData => dispatch(fetchForgotPassword(formData)),
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
