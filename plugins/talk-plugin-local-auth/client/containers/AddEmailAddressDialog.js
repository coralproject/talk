import React from 'react';

import PropTypes from 'prop-types';
import { compose, gql } from 'react-apollo';
import { bindActionCreators } from 'redux';
import { connect, withFragments, excludeIf } from 'plugin-api/beta/client/hocs';
import { notify } from 'coral-framework/actions/notification';
import { withAttachLocalAuth } from '../hocs';
import { startAttach, finishAttach } from '../actions';
import get from 'lodash/get';
import { getErrorMessages } from 'coral-framework/utils';
import { t } from 'plugin-api/beta/client/services';
import {
  Dialog,
  AddEmailForm,
  VerifyEmailAddress,
  EmailAddressAdded,
} from '../components/AddEmailAddress';

class AddEmailAddressDialog extends React.Component {
  state = {
    step: 0,
  };

  componentDidMount() {
    this.props.startAttach();
    document.body.style.minHeight = `${
      document.getElementById('talk-plugin-local-auth-email-dialog')
        .clientHeight
    }px`;
  }

  componentWillUnmount() {
    document.body.style.removeProperty('min-height');
  }

  handleDone = () => {
    this.props.finishAttach();
  };

  handleSubmit = async ({ email, password }) => {
    const { attachLocalAuth } = this.props;
    try {
      await attachLocalAuth({
        email,
        password,
      });

      this.props.notify(
        'success',
        t('talk-plugin-local-auth.add_email.added.alert')
      );
      this.goToNextStep();
    } catch (err) {
      this.props.notify('error', getErrorMessages(err));
    }
  };

  goToNextStep = () => {
    this.setState(({ step }) => ({
      step: step + 1,
    }));
  };

  render() {
    const { step } = this.state;
    const {
      root: {
        me: { email },
        settings: { requireEmailConfirmation },
      },
    } = this.props;

    return (
      <Dialog open={true} id="talk-plugin-local-auth-email-dialog">
        {step === 0 && <AddEmailForm onSubmit={this.handleSubmit} />}
        {step === 1 &&
          !requireEmailConfirmation && (
            <EmailAddressAdded onDone={this.handleDone} />
          )}
        {step === 1 &&
          requireEmailConfirmation && (
            <VerifyEmailAddress emailAddress={email} onDone={this.handleDone} />
          )}
      </Dialog>
    );
  }
}

AddEmailAddressDialog.propTypes = {
  attachLocalAuth: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
  startAttach: PropTypes.func.isRequired,
  finishAttach: PropTypes.func.isRequired,
  root: PropTypes.object,
};

const mapStateToProps = ({ talkPluginLocalAuth: state }) => ({
  inProgress: state.inProgress,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ notify, startAttach, finishAttach }, dispatch);

const withData = withFragments({
  root: gql`
    fragment TalkPluginLocalAuth_AddEmailAddressDialog_root on RootQuery {
      me {
        id
        email
        state {
          status {
            username {
              status
            }
          }
        }
      }
      settings {
        requireEmailConfirmation
      }
    }
  `,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withAttachLocalAuth,
  withData,
  excludeIf(
    ({ root: { me }, inProgress }) =>
      !me ||
      get(me, 'state.status.username.status') === 'UNSET' ||
      (me.email && !inProgress)
  )
)(AddEmailAddressDialog);
