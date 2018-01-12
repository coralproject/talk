import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import { bindActionCreators } from 'redux';
import errorMsj from 'coral-framework/helpers/error';
import validate from 'coral-framework/helpers/validate';
import CreateUsernameDialog from './CreateUsernameDialog';
import { withSetUsername } from 'coral-framework/graphql/mutations';
import { forEachError } from 'plugin-api/beta/client/utils';

import t from 'coral-framework/services/i18n';

import {
  showCreateUsernameDialog,
  hideCreateUsernameDialog,
  invalidForm,
  validForm,
  updateUsername,
} from 'coral-embed-stream/src/actions/auth';

class ChangeUsernameContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        username: (props.auth.user && props.auth.user.username) || '',
      },
      errors: {},
      showErrors: false,
    };
  }

  componentWillReceiveProps(next) {
    if (
      !this.props.auth.showCreateUsernameDialog &&
      next.auth.showCreateUsernameDialog
    ) {
      this.setState({
        formData: {
          username:
            (this.props.auth.user && this.props.auth.user.username) || '',
        },
      });
    }
  }

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

    if (!value.length) {
      addError(name, t('createdisplay.required_field'));
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

  async setUsernameAndClose(username, props = this.props) {
    const {
      validForm,
      invalidForm,
      setUsername,
      hideCreateUsernameDialog,
      updateUsername,
    } = props;
    try {
      // Perform mutation
      await setUsername(this.props.auth.user.id, username);

      // Also change in redux store...
      updateUsername(username);

      hideCreateUsernameDialog();
      validForm();
    } catch (error) {
      const msgs = [];
      forEachError(error, ({ msg }) => msgs.push(msg));
      invalidForm(t(msgs.join(', ')));
    }
  }

  handleSubmitUsername = e => {
    e.preventDefault();
    const { errors, formData: { username } } = this.state;
    const { invalidForm } = this.props;
    this.displayErrors();
    if (this.isCompleted() && !Object.keys(errors).length) {
      this.setUsernameAndClose(username);
    } else {
      invalidForm(t('createdisplay.check_the_form'));
    }
  };

  handleClose = () => {
    this.setUsernameAndClose(this.props.auth.user.username);
  };

  render() {
    const { loggedIn, auth } = this.props;
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

ChangeUsernameContainer.propTypes = {
  auth: PropTypes.object,
  hideCreateUsernameDialog: PropTypes.func,
  validForm: PropTypes.func,
  invalidForm: PropTypes.func,
  loggedIn: PropTypes.bool,
  changeUsername: PropTypes.func,
};

const mapStateToProps = ({ auth }) => ({
  auth: auth,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      showCreateUsernameDialog,
      hideCreateUsernameDialog,
      invalidForm,
      validForm,
      updateUsername,
    },
    dispatch
  );

export default compose(
  withSetUsername,
  connect(mapStateToProps, mapDispatchToProps)
)(ChangeUsernameContainer);
