import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose} from 'react-apollo';
import {toast} from 'react-toastify';
import key from 'keymaster';
import isEqual from 'lodash/isEqual';
import styles from './components/styles.css';
import translations from 'coral-admin/src/translations';
import I18n from 'coral-framework/modules/i18n/i18n';

import {modQueueQuery, getQueueCounts} from '../../graphql/queries';
import {banUser, setCommentStatus, suspendUser} from '../../graphql/mutations';

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
} from 'actions/moderation';

import {Spinner} from 'coral-ui';
import BanUserDialog from './components/BanUserDialog';
import SuspendUserDialog from './components/SuspendUserDialog';
import ModerationQueue from './ModerationQueue';
import ModerationMenu from './components/ModerationMenu';
import ModerationHeader from './components/ModerationHeader';
import NotFoundAsset from './components/NotFoundAsset';
import ModerationKeysModal from '../../components/ModerationKeysModal';

const lang = new I18n(translations);

class ModerationContainer extends Component {
  state = {
    selectedIndex: 0,
    sort: 'REVERSE_CHRONOLOGICAL'
  }

  componentWillMount() {
    const {toggleModal, singleView} = this.props;

    this.props.fetchSettings();
    key('s', () => singleView());
    key('shift+/', () => toggleModal(true));
    key('esc', () => toggleModal(false));
    key('j', this.select(true));
    key('k', this.select(false));
    key('r', this.moderate(false));
    key('t', this.moderate(true));
  }

  moderate = (accept) => () => {
    const {acceptComment, rejectComment} = this.props;
    const {selectedIndex} = this.state;
    const comments = this.getComments();
    const comment = comments[selectedIndex];
    const commentId = {commentId: comment.id};

    if (accept) {
      comment.status !== 'ACCEPTED' && acceptComment(commentId);
    } else {
      comment.status !== 'REJECTED' && rejectComment(commentId);
    }
  }

  getComments = () => {
    const {data, route} = this.props;
    const activeTab = route.path === ':id' ? 'premod' : route.path;
    return data[activeTab];
  }

  select = (next) => () => {
    if (next) {
      this.setState((prevState) =>
        ({
          ...prevState,
          selectedIndex: prevState.selectedIndex < this.getComments().length - 1
            ? prevState.selectedIndex + 1 : prevState.selectedIndex
        }));
    } else {
      this.setState((prevState) =>
        ({
          ...prevState,
          selectedIndex: prevState.selectedIndex > 0 ?
            prevState.selectedIndex - 1 : prevState.selectedIndex
        }));
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

  componentDidUpdate(_, prevState) {

    // If paging through using keybaord shortcuts, scroll the page to keep the selected
    // comment in view.
    if (prevState.selectedIndex !== this.state.selectedIndex) {

      // the 'smooth' flag only works in FF as of March 2017
      document.querySelector(`.${styles.selected}`).scrollIntoView({behavior: 'smooth'});
    }
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

    if (!('premodCount' in data)) {
      return <div><Spinner/></div>;
    }

    if (data.error) {
      return <div>Error</div>;
    }

    if (providedAssetId) {
      asset = assets.find((asset) => asset.id === this.props.params.id);

      if (!asset) {
        return <NotFoundAsset assetId={providedAssetId} />;
      }
    }

    const comments = data[activeTab];
    let activeTabCount;
    switch(activeTab) {
    case 'all':
      activeTabCount = data.allCount;
      break;
    case 'accepted':
      activeTabCount = data.acceptedCount;
      break;
    case 'premod':
      activeTabCount = data.premodCount;
      break;
    case 'flagged':
      activeTabCount = data.flaggedCount;
      break;
    case 'rejected':
      activeTabCount = data.rejectedCount;
      break;
    }

    return (
      <div>
        <ModerationHeader asset={asset} />
        <ModerationMenu
          asset={asset}
          allCount={data.allCount}
          acceptedCount={data.acceptedCount}
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
          bannedWords={settings.wordlist.banned}
          suspectWords={settings.wordlist.suspect}
          showBanUserDialog={props.showBanUserDialog}
          showSuspendUserDialog={props.showSuspendUserDialog}
          acceptComment={props.acceptComment}
          rejectComment={props.rejectComment}
          loadMore={props.loadMore}
          assetId={providedAssetId}
          sort={this.state.sort}
          commentCount={activeTabCount}
        />
        <BanUserDialog
          open={moderation.banDialog}
          user={moderation.user}
          commentId={moderation.commentId}
          commentStatus={moderation.commentStatus}
          handleClose={props.hideBanUserDialog}
          handleBanUser={props.banUser}
          showRejectedNote={moderation.showRejectedNote}
          rejectComment={props.rejectComment}
        />
        <SuspendUserDialog
          open={moderation.suspendUserDialog.show}
          username={moderation.suspendUserDialog.username}
          userId={moderation.suspendUserDialog.userId}
          onCancel={props.hideSuspendUserDialog}
          onPerform={(args) => {
            props.suspendUser(args)
              .then(() => {
                toast(
                  lang.t('suspenduser.notify_suspend_until',
                    moderation.suspendUserDialog.username,
                    lang.timeago(args.until)),
                  {type: 'success'}
                );
              })
              .catch((err) => {
                toast(
                  err,
                  {type: 'error'}
                );
              });
            props.hideSuspendUserDialog();
          }}
        />
      <ModerationKeysModal
          hideShortcutsNote={props.hideShortcutsNote}
          shortcutsNoteVisible={moderation.shortcutsNoteVisible}
          open={moderation.modalOpen}
          onClose={onClose}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  moderation: state.moderation.toJS(),
  settings: state.settings.toJS(),
  assets: state.assets.get('assets')
});

const mapDispatchToProps = (dispatch) => ({
  onClose: () => dispatch(toggleModal(false)),
  hideBanUserDialog: () => dispatch(hideBanUserDialog(false)),
  ...bindActionCreators({
    toggleModal,
    singleView,
    updateAssets,
    fetchSettings,
    showBanUserDialog,
    hideShortcutsNote,
    showSuspendUserDialog,
    hideSuspendUserDialog,
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
