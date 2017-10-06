import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose, gql} from 'react-apollo';
import withQuery from 'coral-framework/hocs/withQuery';
import {Spinner} from 'coral-ui';
import {notify} from 'coral-framework/actions/notification';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import {withUpdateSettings} from 'coral-framework/graphql/mutations';
import {getErrorMessages, getDefinitionName} from 'coral-framework/utils';
import StreamSettings from './StreamSettings';
import TechSettings from './TechSettings';
import ModerationSettings from './ModerationSettings';
import {
  updatePending,
  clearPending,
} from '../../../actions/configure';

import Configure from '../components/Configure';

class ConfigureContainer extends Component {

  updateWordlist = (listName, list) => {
    this.props.updatePending({updater: {
      wordlist: {$apply: (wordlist) => {
        const changeSet = {[listName]: list};
        if (!wordlist) {
          return changeSet;
        }
        return {
          ...wordlist,
          ...changeSet,
        };
      }},
    }});
  };

  updateSettings = (settings, {setError = {}} = {}) => {
    this.props.updatePending({updater: {$merge: settings}, errorUpdater: {$merge: setError}});
  };

  savePending = async () => {
    try {
      await this.props.updateSettings(this.props.pending);
      this.props.clearPending();
    }
    catch(err) {
      this.props.notify('error', getErrorMessages(err));
    }
  };

  render () {
    if(this.props.data.loading) {
      return <Spinner/>;
    }

    const merged = merge({}, this.props.root.settings, this.props.pending);

    return <Configure
      notify={this.props.notify}
      updateWordlist={this.updateWordlist}
      updateSettings={this.updateSettings}
      errors={this.props.errors}
      auth={this.props.auth}
      data={this.props.data}
      root={this.props.root}
      settings={merged}
      canSave={this.props.canSave}
      savePending={this.savePending}
    />;
  }
}

const withConfigureQuery = withQuery(gql`
  query TalkAdmin_Configure {
    settings {
      moderation
      requireEmailConfirmation
      infoBoxEnable
      infoBoxContent
      questionBoxEnable
      questionBoxContent
      premodLinksEnable
      questionBoxIcon
      autoCloseStream
      customCssUrl
      closedTimeout
      closedMessage
      editCommentWindowLength
      charCountEnable
      charCount
      organizationName
      wordlist {
        suspect
        banned
      }
      domains {
        whitelist
      }
      ...${getDefinitionName(StreamSettings.fragments.settings)}
      ...${getDefinitionName(TechSettings.fragments.settings)}
      ...${getDefinitionName(ModerationSettings.fragments.settings)}
    }
    ...${getDefinitionName(StreamSettings.fragments.root)}
    ...${getDefinitionName(TechSettings.fragments.root)}
    ...${getDefinitionName(ModerationSettings.fragments.root)}
  }
  ${StreamSettings.fragments.root}
  ${StreamSettings.fragments.settings}
  ${TechSettings.fragments.root}
  ${TechSettings.fragments.settings}
  ${ModerationSettings.fragments.root}
  ${ModerationSettings.fragments.settings}
  `, {
  options: () => ({
    variables: {},
  }),
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  pending: state.configure.pending,
  canSave: state.configure.canSave,
  errors: state.configure.errors,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    notify,
    updatePending,
    clearPending,
  }, dispatch);

export default compose(
  withUpdateSettings,
  withConfigureQuery,
  connect(mapStateToProps, mapDispatchToProps),
)(ConfigureContainer);

ConfigureContainer.propTypes = {
  updatePending: PropTypes.func.isRequired,
  updateSettings: PropTypes.func.isRequired,
  clearPending: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  root: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  canSave: PropTypes.bool.isRequired,
  pending: PropTypes.object.isRequired,
};
