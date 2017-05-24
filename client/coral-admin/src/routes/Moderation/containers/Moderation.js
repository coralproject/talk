import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose} from 'react-apollo';
import isEqual from 'lodash/isEqual';

import {modQueueQuery, getQueueCounts} from '../../../graphql/queries';
import {banUser, setCommentStatus, suspendUser} from '../../../graphql/mutations';

import {fetchSettings} from 'actions/settings';
import {updateAssets} from 'actions/assets';
import {
  toggleModal,
  singleView,
  showBanUserDialog,
  hideBanUserDialog,
  showSuspendUserDialog,
  hideSuspendUserDialog,
  hideShortcutsNote,
  viewUserDetail,
  hideUserDetail
} from 'actions/moderation';

import {Spinner} from 'coral-ui';
import Moderation from '../components/Moderation';

class ModerationContainer extends Component {
  componentWillMount() {
    this.props.fetchSettings();
  }

  componentWillReceiveProps(nextProps) {
    const {updateAssets} = this.props;
    if(!isEqual(nextProps.data.assets, this.props.data.assets)) {
      updateAssets(nextProps.data.assets);
    }
  }

  render () {
    const {data} = this.props;

    if (!('premodCount' in data)) {
      return <div><Spinner/></div>;
    }

    if (data.error) {
      return <div>Error</div>;
    }
    return <Moderation {...this.props} />;
  }
}

const mapStateToProps = (state) => ({
  moderation: state.moderation.toJS(),
  settings: state.settings.toJS(),
  auth: state.auth.toJS(),
  assets: state.assets.get('assets')
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    toggleModal,
    singleView,
    updateAssets,
    fetchSettings,
    showBanUserDialog,
    hideBanUserDialog,
    hideShortcutsNote,
    showSuspendUserDialog,
    hideSuspendUserDialog,
    viewUserDetail,
    hideUserDetail,
  }, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  setCommentStatus,
  getQueueCounts,
  banUser,
  suspendUser,
  modQueueQuery,
)(ModerationContainer);
