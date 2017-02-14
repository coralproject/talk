import React, {Component} from 'react';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import key from 'keymaster';
import isEqual from 'lodash/isEqual';

import {modQueueQuery} from '../../graphql/queries';
import {banUser, setCommentStatus} from '../../graphql/mutations';

import {fetchSettings} from 'actions/settings';
import {updateAssets} from 'actions/assets';
import {toggleModal, singleView, showBanUserDialog, hideBanUserDialog} from 'actions/moderation';

import {Spinner} from 'coral-ui';
import BanUserDialog from '../../components/BanUserDialog';
import ModerationQueue from './ModerationQueue';
import ModerationMenu from './components/ModerationMenu';
import ModerationHeader from './components/ModerationHeader';
import NotFoundAsset from './components/NotFoundAsset';

class ModerationContainer extends Component {
  componentWillMount() {
    const {toggleModal, singleView} = this.props;

    this.props.fetchSettings();

    key('s', () => singleView());
    key('shift+/', () => toggleModal(true));
    key('esc', () => toggleModal(false));
  }

  componentWillUnmount() {
    key.unbind('s');
    key.unbind('shift+/');
    key.unbind('esc');
  }

  componentWillReceiveProps(nextProps) {
    const {updateAssets} = this.props;
    if(!isEqual(nextProps.data.assets, this.props.data.assets)) {
      updateAssets(nextProps.data.assets);
    }
  }

  render () {
    const {data, moderation, settings, assets, ...props} = this.props;
    const providedAssetId = this.props.params.id;
    const activeTab = this.props.route.path === ':id' ? 'premod' : this.props.route.path;

    let asset;

    if (data.loading) {
      return <div><Spinner/></div>;
    }

    if (data.error) {
      console.log(data);
      return <div>Error</div>;
    }

    if (providedAssetId) {
      asset = assets.find(asset => asset.id === this.props.params.id);

      if (!asset) {
        return <NotFoundAsset assetId={providedAssetId} />;
      }
    }

    return (
      <div>
        <ModerationHeader asset={asset} />
        <ModerationMenu
          activeTab={activeTab}
          asset={asset}
        />
        <ModerationQueue
          data={data}
          currentAsset={asset}
          activeTab={activeTab}
          suspectWords={settings.wordlist.suspect}
          showBanUserDialog={props.showBanUserDialog}
          acceptComment={props.acceptComment}
          rejectComment={props.rejectComment}
        />
        <BanUserDialog
          open={moderation.banDialog}
          user={moderation.user}
          handleClose={props.hideBanUserDialog}
          handleBanUser={props.banUser}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  moderation: state.moderation.toJS(),
  settings: state.settings.toJS(),
  assets: state.assets.get('assets')
});

const mapDispatchToProps = dispatch => ({
  toggleModal: toggle => dispatch(toggleModal(toggle)),
  onClose: () => dispatch(toggleModal(false)),
  singleView: () => dispatch(singleView()),
  updateAssets: assets => dispatch(updateAssets(assets)),
  fetchSettings: () => dispatch(fetchSettings()),
  showBanUserDialog: (user, commentId) => dispatch(showBanUserDialog(user, commentId)),
  hideBanUserDialog: () => dispatch(hideBanUserDialog(false)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  setCommentStatus,
  modQueueQuery,
  banUser
)(ModerationContainer);
