import React, {Component} from 'react';
import key from 'keymaster';
import styles from './styles.css';

import BanUserDialog from './BanUserDialog';
import SuspendUserDialog from './SuspendUserDialog';
import ModerationQueue from './ModerationQueue';
import ModerationMenu from './ModerationMenu';
import ModerationHeader from './ModerationHeader';
import NotFoundAsset from './NotFoundAsset';
import ModerationKeysModal from '../../../components/ModerationKeysModal';
import UserDetail from '../containers/UserDetail';
import StorySearch from '../containers/StorySearch';

export default class Moderation extends Component {
  state = {
    selectedIndex: 0,
  }

  componentWillMount() {
    const {toggleModal, singleView} = this.props;

    key('s', () => singleView());
    key('shift+/', () => toggleModal(true));
    key('esc', () => toggleModal(false));
    key('j', this.select(true));
    key('k', this.select(false));
    key('r', this.moderate(false));
    key('t', this.moderate(true));
  }

  onClose = () => {
    this.toggleModal(false);
  }

  closeSearch = () => {
    const {storySearchClear, toggleStorySearch} = this.props;
    toggleStorySearch(false);
    storySearchClear();
  }

  openSearch = () => {
    this.props.toggleStorySearch(true);
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
    const {root, route} = this.props;
    const activeTab = route.path === ':id' ? 'premod' : route.path;
    return root[activeTab];
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

  render () {
    const {root, moderation, settings, assets, viewUserDetail, hideUserDetail, ...props} = this.props;
    const providedAssetId = this.props.params.id;
    const activeTab = this.props.route.path === ':id' ? 'premod' : this.props.route.path;

    let asset;

    if (providedAssetId) {
      asset = assets.find((asset) => asset.id === this.props.params.id);

      if (!asset) {
        return <NotFoundAsset assetId={providedAssetId} />;
      }
    }

    const comments = root[activeTab];
    let activeTabCount;
    switch(activeTab) {
    case 'all':
      activeTabCount = root.allCount;
      break;
    case 'accepted':
      activeTabCount = root.acceptedCount;
      break;
    case 'premod':
      activeTabCount = root.premodCount;
      break;
    case 'flagged':
      activeTabCount = root.flaggedCount;
      break;
    case 'rejected':
      activeTabCount = root.rejectedCount;
      break;
    }

    return (
      <div>
        <ModerationHeader
          searchVisible={this.props.moderation.storySearchVisible}
          openSearch={this.openSearch}
          closeSearch={this.closeSearch}
          asset={asset} />
        <ModerationMenu
          asset={asset}
          allCount={root.allCount}
          acceptedCount={root.acceptedCount}
          premodCount={root.premodCount}
          rejectedCount={root.rejectedCount}
          flaggedCount={root.flaggedCount}
          selectSort={this.props.setSortOrder}
          sort={this.props.moderation.sortOrder}
        />
        <ModerationQueue
          data={this.props.data}
          root={this.props.root}
          currentAsset={asset}
          comments={comments.nodes}
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
          sort={this.props.moderation.sortOrder}
          commentCount={activeTabCount}
          currentUserId={this.props.auth.user.id}
          viewUserDetail={viewUserDetail}
          hideUserDetail={hideUserDetail}
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
          organizationName={root.settings.organizationName}
          onCancel={props.hideSuspendUserDialog}
          onPerform={this.props.suspendUser}
        />
        <ModerationKeysModal
          hideShortcutsNote={props.hideShortcutsNote}
          shortcutsNoteVisible={moderation.shortcutsNoteVisible}
          open={moderation.modalOpen}
          onClose={this.onClose}/>
        {moderation.userDetailId && (
          <UserDetail
            id={moderation.userDetailId}
            hideUserDetail={hideUserDetail}
            bannedWords={settings.wordlist.banned}
            suspectWords={settings.wordlist.suspect}
            showBanUserDialog={props.showBanUserDialog}
            showSuspendUserDialog={props.showSuspendUserDialog}
            acceptComment={props.acceptComment}
            rejectComment={props.rejectComment} />
        )}
        <StorySearch
          moderation={this.props.moderation}
          closeSearch={this.closeSearch}
          storySearchChange={this.props.storySearchChange}
          storySearchClear={this.props.storySearchClear}
        />
      </div>
    );
  }
}
