import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import errorMsj from 'coral-framework/helpers/error';
import validate from 'coral-framework/helpers/validate';
import CreateUsernameDialog from './CreateUsernameDialog';

import t from 'coral-framework/services/i18n';

import {
  showCreateUsernameDialog,
  hideCreateUsernameDialog,
  invalidForm,
  validForm,
  createUsername
} from 'coral-embed-stream/src/actions/auth';

class ChangeUsernameContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        username: (props.auth.user && props.auth.user.username) || ''
      },
      errors: {},
      showErrors: false
    };
  }

  componentWillReceiveProps(next) {
    if (!this.props.auth.showCreateUsernameDialog && next.auth.showCreateUsernameDialog) {
      this.setState({
        formData: {
          username: (this.props.auth.user && this.props.auth.user.username) || '',
        },
      });
    }
  }

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

    if (!value.length) {
      addError(name, t('createdisplay.required_field'));
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

  handleSubmitUsername = (e) => {
    e.preventDefault();
    const {errors} = this.state;
    const {validForm, invalidForm} = this.props;
    this.displayErrors();
    if (this.isCompleted() && !Object.keys(errors).length) {
      this.props.createUsername(this.props.auth.user.id, this.state.formData);
      validForm();
    } else {
      invalidForm(t('createdisplay.check_the_form'));
    }
  };

  handleClose = () => {
    this.props.hideCreateUsernameDialog();
  };

  render() {
    const {loggedIn, auth} = this.props;
    return (
      <div>
        <CreateUsernameDialog
          open={auth.showCreateUsernameDialog}
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

const mapStateToProps = ({auth}) => ({
  auth: auth
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      createUsername,
      showCreateUsernameDialog,
      hideCreateUsernameDialog,
      invalidForm,
      validForm
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(
  ChangeUsernameContainer
);
