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
      toggleModeration={this.toggleModeration}
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
};

const withSettingsFragments = withFragments({
  asset: gql`
    fragment CoralEmbedStream_Settings_asset on Asset {
      id
      settings {
        moderation
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
