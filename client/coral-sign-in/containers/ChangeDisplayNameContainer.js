import React, {Component} from 'react';
import {connect} from 'react-redux';

import validate from 'coral-framework/helpers/validate';
import errorMsj from 'coral-framework/helpers/error';

import CreateDisplayNameDialog from '../components/CreateDisplayNameDialog';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations';
const lang = new I18n(translations);

import {
  showCreateDisplayNameDialog,
  hideCreateDisplayNameDialog,
  invalidForm,
  validForm,
  createDisplayName
} from '../../coral-framework/actions/auth';

class ChangeDisplayNameContainer extends Component {
  initialState = {
    formData: {
      username: '',
    },
    errors: {},
    showErrors: false
  };

  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmitDisplayName = this.handleSubmitDisplayName.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.addError = this.addError.bind(this);
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

    if (!value.length) {
      addError(name, lang.t('createdisplay.requiredField'));
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

  handleSubmitDisplayName(e) {
    e.preventDefault();
    const {errors} = this.state;
    const {validForm, invalidForm} = this.props;
    this.displayErrors();
    if (this.isCompleted() && !Object.keys(errors).length) {
      this.props.createDisplayName(this.props.user.id, this.state.formData);
      validForm();
    } else {
      invalidForm(lang.t('createdisplay.checkTheForm'));
    }
  }

  handleClose() {
    this.props.hideCreateDisplayNameDialog();
  }

  render() {
    const {loggedIn, auth, offset} = this.props;
    return (
      <div>
        <CreateDisplayNameDialog
          open={auth.showCreateDisplayNameDialog && auth.fromSignUp}
          offset={offset}
          handleClose={this.handleClose}
          loggedIn={loggedIn}
          handleSubmitDisplayName={this.handleSubmitDisplayName}
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
  createDisplayName: (userid, formData) => dispatch(createDisplayName(userid, formData)),
  showCreateDisplayNameDialog: () => dispatch(showCreateDisplayNameDialog()),
  hideCreateDisplayNameDialog: () => dispatch(hideCreateDisplayNameDialog()),
  invalidForm: error => dispatch(invalidForm(error)),
  validForm: () => dispatch(validForm())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangeDisplayNameContainer);
