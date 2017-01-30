import React, {Component} from 'react';
import {connect} from 'react-redux';

import CreateDisplayNameDialog from '../components/CreateDisplayNameDialog';

// import validate from 'coral-framework/helpers/validate';
// import errorMsj from 'coral-framework/helpers/error';
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
      displayName: '',
    },
    errors: {},
    showErrors: false
  };

  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmitForm = this.handleSubmitForm.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.addError = this.addError.bind(this);
  }

  componentDidMount() {
    const {formData} = this.state;
    const errors = Object.keys(formData).reduce((map, prop) => {
      map[prop] = lang.t('createdisplay.requiredField');
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

    if (!value.length) {
      addError(name, lang.t('displayName.requiredField'));
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

  handleSubmitForm(e) {
    e.preventDefault();
    const {errors} = this.state;
    const {validForm, invalidForm} = this.props;
    this.displayErrors();
    if (this.isCompleted() && !Object.keys(errors).length) {
      createDisplayName(this.state.formData);
      validForm();
    } else {
      invalidForm(lang.t('signIn.checkTheForm'));
    }
  }

  handleClose() {
    this.props.hideCreateDisplayNameDialog();
  }

  render() {
    const {loggedIn, auth, offset, user} = this.props;
    return (
      <div>
        <CreateDisplayNameDialog
          open={auth.showCreateDisplayNameDialog}
          offset={offset}
          handleClose={this.handleClose}
          user={user}
          loggedIn={loggedIn}
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
  createDisplayName: formData => dispatch(createDisplayName(formData)),
  showCreateDisplayNameDialog: () => dispatch(showCreateDisplayNameDialog()),
  hideCreateDisplayNameDialog: () => dispatch(hideCreateDisplayNameDialog()),
  invalidForm: error => dispatch(invalidForm(error)),
  validForm: () => dispatch(validForm())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangeDisplayNameContainer);
