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
import ModerationKeysModal from '../../components/ModerationKeysModal';

class ModerationContainer extends Component {
  state = {
    selectedIndex: 0,
    sort: 'REVERSE_CHRONOLOGICAL'
  }

  componentWillMount() {
    const {toggleModal, singleView} = this.props;
    const {selectedIndex} = this.state;

    this.props.fetchSettings();
    key('s', () => singleView());
    key('shift+/', () => toggleModal(true));
    key('esc', () => toggleModal(false));
    key('j', () => this.setState({selectedIndex: selectedIndex + 1}));
    key('k', () => this.setState({selectedIndex: selectedIndex > 0 ? selectedIndex + 1 : selectedIndex}));
    key('r', () => this.moderate(false));
    key('t', () => this.moderate(true));
  }

  moderate = (accept) => {
    const {data, route, acceptComment, rejectComment} = this.props;
    const {selectedIndex} = this.state;
    const activeTab = route.path === ':id' ? 'premod' : route.path;
    const comments = data[activeTab];
    const commentId = {commentId: comments[selectedIndex].id};

    if (accept) {
      acceptComment(commentId);
    } else {
      rejectComment(commentId);
    }

  }

  selectSort = (sort) => {
    this.setState({sort});
    this.props.modQueueResort(sort);
  }

  componentWillUnmount() {
    key.unbind('s');
    key.unbind('shift+/');
    key.unbind('esc');
    key.unbind('j');
    key.unbind('k');
    key.unbind('r');
    key.unbind('t');
  }

  componentWillReceiveProps(nextProps) {
    const {updateAssets} = this.props;
    if(!isEqual(nextProps.data.assets, this.props.data.assets)) {
      updateAssets(nextProps.data.assets);
    }
  }

  render () {
    const {data, moderation, settings, assets, onClose, ...props} = this.props;
    const providedAssetId = this.props.params.id;
    const activeTab = this.props.route.path === ':id' ? 'premod' : this.props.route.path;

    let asset;

    if (data.loading) {
      return <div><Spinner/></div>;
    }

    if (data.error) {
      return <div>Error</div>;
    }

    if (providedAssetId) {
      asset = assets.find(asset => asset.id === this.props.params.id);

      if (!asset) {
        return <NotFoundAsset assetId={providedAssetId} />;
      }
    }

    const comments = data[activeTab];

    return (
      <div>
        <ModerationHeader asset={asset} />
        <ModerationMenu
          asset={asset}
          premodCount={data.premodCount}
          rejectedCount={data.rejectedCount}
          flaggedCount={data.flaggedCount}
          selectSort={this.selectSort}
          sort={this.state.sort}
        />
        <ModerationQueue
          currentAsset={asset}
          comments={comments}
          activeTab={activeTab}
          singleView={moderation.singleView}
          selectedIndex={this.state.selectedIndex}
          suspectWords={settings.wordlist.suspect}
          showBanUserDialog={props.showBanUserDialog}
          acceptComment={props.acceptComment}
          rejectComment={props.rejectComment}
          loadMore={props.loadMore}
          assetId={providedAssetId}
          sort={this.state.sort}
        />
        <BanUserDialog
          open={moderation.banDialog}
          user={moderation.user}
          handleClose={props.hideBanUserDialog}
          handleBanUser={props.banUser}
        />
      <ModerationKeysModal
          open={moderation.modalOpen}
          onClose={onClose}/>
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
