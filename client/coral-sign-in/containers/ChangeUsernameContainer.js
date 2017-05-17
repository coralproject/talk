import React, {Component} from 'react';
import {connect} from 'react-redux';

import validate from 'coral-framework/helpers/validate';
import errorMsj from 'coral-framework/helpers/error';

import CreateUsernameDialog from '../components/CreateUsernameDialog';

import t from 'coral-i18n/services/i18n';

import {
  showCreateUsernameDialog,
  hideCreateUsernameDialog,
  invalidForm,
  validForm,
  createUsername
} from '../../coral-framework/actions/auth';

class ChangeUsernameContainer extends Component {
  initialState = {
    formData: {
      username: '',
    },
    errors: {},
    showErrors: false
  };

  constructor(props) {
    super(props);
    this.initialState.formData.username = props.user.username;
    this.state = this.initialState;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmitUsername = this.handleSubmitUsername.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.addError = this.addError.bind(this);
  }

  handleChange(e) {
    const {name, value} = e.target;
    this.setState((state) => ({
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
    return this.setState((state) => ({
      errors: {
        ...state.errors,
        [name]: error
      }
    }));
  }

  validation(name, value) {
    const {addError} = this;

    if (!value.length) {
      addError(name, t('createdisplay.required_field'));
    } else if (!validate[name](value)) {
      addError(name, errorMsj[name]);
    } else {
      const { [name]: prop, ...errors } = this.state.errors; // eslint-disable-line
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

  handleSubmitUsername(e) {
    e.preventDefault();
    const {errors} = this.state;
    const {validForm, invalidForm} = this.props;
    this.displayErrors();
    if (this.isCompleted() && !Object.keys(errors).length) {
      this.props.createUsername(this.props.user.id, this.state.formData);
      validForm();
    } else {
      invalidForm(t('createdisplay.check_the_form'));
    }
  }

  handleClose() {
    this.props.hideCreateUsernameDialog();
  }

  render() {
    const {loggedIn, auth} = this.props;
    return (
      <div>
        <CreateUsernameDialog
          open={auth.showCreateUsernameDialog && auth.user.canEditName}
          handleClose={this.handleClose}
          loggedIn={loggedIn}
          handleSubmitUsername={this.handleSubmitUsername}
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
  createUsername: (userid, formData) => dispatch(createUsername(userid, formData)),
  showCreateUsernameDialog: () => dispatch(showCreateUsernameDialog()),
  hideCreateUsernameDialog: () => dispatch(hideCreateUsernameDialog()),
  invalidForm: (error) => dispatch(invalidForm(error)),
  validForm: () => dispatch(validForm())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangeUsernameContainer);
