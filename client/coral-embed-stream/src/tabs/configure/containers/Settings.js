import React from 'react';
import {gql, compose} from 'react-apollo';
import {withFragments, withMergedSettings} from 'coral-framework/hocs';
import {getErrorMessages} from 'coral-framework/utils';
import Settings from '../components/Settings.js';
import PropTypes from 'prop-types';
import {withUpdateAssetSettings} from 'coral-framework/graphql/mutations';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {notify} from 'coral-framework/actions/notification';
import {clearPending, updatePending} from '../../../actions/configure';

class SettingsContainer extends React.Component {

  toggleModeration = () => {
    const updater = {moderation: {$set: this.props.mergedSettings.moderation === 'PRE' ? 'POST' : 'PRE'}};
    this.props.updatePending({updater});
  };

  togglePremodLinks = () => {
    const updater = {premodLinksEnable: {$set: !this.props.mergedSettings.premodLinksEnable}};
    this.props.updatePending({updater});
  };

  toggleQuestionBox = () => {
    const updater = {questionBoxEnable: {$set: !this.props.mergedSettings.questionBoxEnable}};
    this.props.updatePending({updater});
  };

  setQuestionBoxIcon = (icon) => {
    const updater = {questionBoxIcon: {$set: icon}};
    this.props.updatePending({updater});
  };

  setQuestionBoxContent = (content) => {
    const updater = {questionBoxContent: {$set: content}};
    this.props.updatePending({updater});
  };

  savePending = async () => {
    try {
      await this.props.updateAssetSettings(this.props.asset.id, this.props.pending);
      this.props.clearPending();
    }
    catch(err) {
      this.props.notify('error', getErrorMessages(err));
    }
  };

  render() {
    return <Settings
      settings={this.props.mergedSettings}
      savePending={this.savePending}
      onToggleModeration={this.toggleModeration}
      onTogglePremodLinks={this.togglePremodLinks}
      onToggleQuestionBox={this.toggleQuestionBox}
      onQuestionBoxIconChange={this.setQuestionBoxIcon}
      onQuestionBoxContentChange={this.setQuestionBoxContent}
      onApply={this.savePending}
      canSave={this.props.canSave}
    />;
  }
}

SettingsContainer.propTypes = {
  asset: PropTypes.object.isRequired,
  pending: PropTypes.object.isRequired,
  mergedSettings: PropTypes.object.isRequired,
  updateAssetSettings: PropTypes.func.isRequired,
  clearPending: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
  updatePending: PropTypes.func.isRequired,
  canSave: PropTypes.bool.isRequired,
};

const withSettingsFragments = withFragments({
  asset: gql`
    fragment CoralEmbedStream_Settings_asset on Asset {
      id
      settings {
        moderation
        premodLinksEnable
        questionBoxEnable
        questionBoxIcon
        questionBoxContent
      }
    }
  `,
});

const mapStateToProps = (state) => ({
  pending: state.configure.pending,
  canSave: state.configure.canSave,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    notify,
    clearPending,
    updatePending,
  }, dispatch);

const enhance = compose(
  withSettingsFragments,
  withUpdateAssetSettings,
  connect(mapStateToProps, mapDispatchToProps),
  withMergedSettings('asset.settings', 'pending', 'mergedSettings'),
);

export default enhance(SettingsContainer);
