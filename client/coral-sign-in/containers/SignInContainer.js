import React, {Component} from 'react';
import {connect} from 'react-redux';

import SignDialog from '../components/SignDialog';
import Button from 'coral-ui/components/Button';

import validate from 'coral-framework/helpers/validate';
import error from 'coral-framework/helpers/error';

import {
  changeView,
  fetchSignUp,
  fetchSignIn,
  showSignInDialog,
  hideSignInDialog,
  fetchSignInFacebook,
  fetchForgotPassword,
  facebookCallback
} from '../../coral-framework/actions/auth';

class SignInContainer extends Component {
  initialState = {
    formData: {
      email: '',
      username: '',
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
    this.cleanState = this.cleanState.bind(this);
    this.validation = this.validation.bind(this);
  }

  componentDidMount() {
    window.authCallback = this.props.facebookCallback;
  }

  cleanState () {
    this.setState(this.initialState);
  }

  handleChange(e) {
    const {name, value} = e.target;
    this.validation(name, value, this.state.formData);

    this.setState(state => ({
      ...state,
      formData: {
        ...state.formData,
        [name]: value
      }
    }));
  }

  validation(name, value) {
    if (!validate[name](value)) {
      this.setState(state => ({
        errors: {
          ...state.errors,
          [name]: error[name]
        }
      }));
    } else {
      const { [name]: prop, ...errors } = this.state.errors; // eslint-disable-line
      this.setState(state => ({
        ...state,
        errors
      }));
    }
  }

  isCompleted() {
    const {formData} = this.state;
    return !Object.keys(formData).filter(prop => !formData[prop].length).length;
  }

  displayErrors(show = true) {
    this.setState({
      showErrors: show
    });
  }

  handleSignUp(e) {
    e.preventDefault();
    this.displayErrors();
    if (this.isCompleted()) {
      console.log('Is Completed!!');
    } else {
      console.log('Is not Completed!!');
    }
    this.props.fetchSignUp(this.state.formData);
  }

  handleSignIn(e) {
    e.preventDefault();
    this.displayErrors();
    this.props.fetchSignIn(this.state.formData);
  }

  handleClose() {
    this.cleanState();
    this.props.hideSignInDialog();
  }

  changeView(view) {
    this.cleanState();
    this.props.changeView(view);
  }

  render() {
    const {auth, showSignInDialog} = this.props;
    const {errors, showErrors, formData} = this.state;
    return (
      <div>
        <Button onClick={showSignInDialog}>
          Sign in to comment
        </Button>
        <SignDialog
          open={auth.get('showSignInDialog')}
          message={auth.get('message')}
          view={auth.get('view')}
          isLoading={auth.get('isLoading')}
          showErrors={showErrors}
          formData={formData}
          errors={errors}
          signInError={auth.get('signInError')}
          {...this}
          {...this.props}
        />
      </div>
    );
  }
}

const mapStateToProps = ({auth}) => ({auth});

const mapDispatchToProps = dispatch => ({
  facebookCallback: (err, data) => dispatch(facebookCallback(err, data)),
  fetchSignUp: (formData) => dispatch(fetchSignUp(formData)),
  fetchSignIn: (formData) => dispatch(fetchSignIn(formData)),
  fetchSignInFacebook: () => dispatch(fetchSignInFacebook()),
  fetchForgotPassword: (formData) => dispatch(fetchForgotPassword(formData)),
  showSignInDialog: () => dispatch(showSignInDialog()),
  changeView: (view) => dispatch(changeView(view)),
  handleClose: () => dispatch(hideSignInDialog())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignInContainer);
