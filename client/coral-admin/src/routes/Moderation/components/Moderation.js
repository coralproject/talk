import React, {Component} from 'react';
import PropTypes from 'prop-types';
import key from 'keymaster';

import ModerationQueue from './ModerationQueue';
import ModerationMenu from './ModerationMenu';
import ModerationHeader from './ModerationHeader';
import ModerationKeysModal from '../../../components/ModerationKeysModal';
import StorySearch from '../containers/StorySearch';
import Slot from 'coral-framework/components/Slot';

class Moderation extends Component {
  constructor(props) {
    super(props);
    const comments = this.getComments(props);

    this.state = {
      selectedCommentId: comments[0] ? comments[0].id : null,
    };

  }

  componentWillMount() {
    const {toggleModal, singleView} = this.props;

    key('s', () => singleView());
    key('shift+/', () => toggleModal(true));
    key('esc', () => toggleModal(false));
    key('ctrl+f', () => this.openSearch());
    key('t', () => this.nextQueue());
    key('j', () => this.select(true));
    key('k', () => this.select(false));
    key('f', () => this.moderate(false));
    key('d', () => this.moderate(true));
  }

  onClose = () => {
    this.props.toggleModal(false);
  }

  nextQueue = () => {
    const queueConfig = this.props.queueConfig;
    const activeTab = this.props.activeTab;
    const assetId = this.props.data.variables.asset_id;

    const menuItems = Object.keys(queueConfig).map((queue) => ({
      key: queue
    }));

    const activeTabIndex = menuItems.findIndex((item) => item.key === activeTab);
    const nextQueueIndex = (activeTabIndex === menuItems.length - 1) ? 0 : activeTabIndex + 1;

    this.props.router.push(this.props.getModPath(menuItems[nextQueueIndex].key, assetId));
  }

  closeSearch = () => {
    const {toggleStorySearch} = this.props;
    toggleStorySearch(false);
  }

  openSearch = () => {
    this.props.toggleStorySearch(true);
  }

  getActiveTabCount = (props = this.props) => {
    return props.root[`${props.activeTab}Count`];
  }

  moderate = (accept) => {
    const {acceptComment, rejectComment} = this.props;
    const {selectedCommentId} = this.state;

    // Accept or reject only if there's a selected comment
    if(selectedCommentId != null){
      const comments = this.getComments();
      const commentIdx = comments.findIndex((comment) => comment.id === selectedCommentId);
      const comment = comments[commentIdx];
      
      if (accept) {
        comment.status !== 'ACCEPTED' && acceptComment({commentId: comment.id});
      } else {
        comment.status !== 'REJECTED' && rejectComment({commentId: comment.id});
      }
    }
  }

  getComments = (props = this.props) => {
    const {root, activeTab} = props;
    return root[activeTab].nodes;
  }

  scrollTo = (toId, smooth = true) =>
    document.querySelector(`#comment_${toId}`).scrollIntoView(smooth ? {behavior: 'smooth'} : {});

  select = async (next, props = this.props, selectedCommentId = this.state.selectedCommentId) => {
    const comments = this.getComments(props);

    // No comments to be selected.
    if (comments.length === 0){
      return;
    }

    // Find current index if we have a selected comment.
    const index = selectedCommentId
      ? comments.findIndex((comment) => comment.id === selectedCommentId)
      : null;

    if (next) {

      // Grab first one if we don't have a selected comment yet.
      if (!selectedCommentId) {
        this.setState({selectedCommentId: comments[0].id}, () => this.scrollTo(comments[0].id));
        return;
      }

      // Select next one when we still have more comments left.
      if (index < comments.length - 1) {
        this.setState({selectedCommentId: comments[index + 1].id}, () => this.scrollTo(comments[index + 1].id));
        return;
      } else {

        // We hit the end of the list, load more comments if we have.
        if (comments.length < this.getActiveTabCount()) {
          const res = await this.loadMore();

          // If `loadMore` was already in progress, res would be false.
          if (res) {

            // Select next comment after loading has completed.
            this.select(true);
          }
        }
        return;
      }
    } else {

      // We have no selected comment, so just skip it.
      if (!selectedCommentId) {
        return;
      }

      // If we still have previous comments take the one before.
      if (index > 0) {
        this.setState({selectedCommentId: comments[index - 1].id}, () => this.scrollTo(comments[index - 1].id));
        return;
      }
    }
  }

  loadMore = async () => {
    if (!this.isLoadingMore) {
      this.isLoadingMore = true;
      try {
        const result = await this.props.loadMore(this.props.activeTab);
        this.isLoadingMore = false;
        return result;
      }
      catch (e) {
        this.isLoadingMore = false;
        throw e;
      }
    }
    return false;
  }

  componentWillUnmount() {
    key.unbind('s');
    key.unbind('shift+/');
    key.unbind('esc');
    key.unbind('ctrl+f');
    key.unbind('t');
    key.unbind('j');
    key.unbind('k');
    key.unbind('f');
    key.unbind('d');
  }

  componentWillReceiveProps(nextProps) {

    if (this.props.activeTab !== nextProps.activeTab) {

      // Reset selection when changing tabs.
      this.select(true, nextProps, null);
    } else {

      // Detect if comment has left the queue and find next or prev selected comment to set it
      // as the new selectedCommentId.
      const prevComments = this.getComments(this.props);
      const nextComments = this.getComments(nextProps);
      if (nextComments.length < prevComments.length) {

        // Comments have changed, now check if our selected comment has left the queue.
        if (
          this.state.selectedCommentId &&
          !nextComments.some((comment) => comment.id === this.state.selectedCommentId)
        ) {

          // Determine a comment to select.
          const prevIndex = prevComments.findIndex((comment) => comment.id === this.state.selectedCommentId);
          if (prevIndex !== prevComments.length - 1) {
            this.setState({selectedCommentId: prevComments[prevIndex + 1].id});
          } else if(prevIndex > 0) {
            this.setState({selectedCommentId: prevComments[prevIndex - 1].id});
          } else {
            this.setState({selectedCommentId: null});
          }
        }
      }
    }
  }

  componentDidUpdate(prevProps) {

    // Scroll to comment when changing from single wiew to normal view.
    if (prevProps.moderation.singleView !== this.props.moderation.singleView && this.state.selectedCommentId) {
      this.scrollTo(this.state.selectedCommentId, false);
    }
  }

  render () {
    const {root, data, moderation, settings, viewUserDetail, activeTab, getModPath, queueConfig, handleCommentChange, ...props} = this.props;
    const {asset} = root;
    const assetId = asset && asset.id;

    const comments = root[activeTab];

    const activeTabCount = this.getActiveTabCount();
    const menuItems = Object.keys(queueConfig).map((queue) => ({
      key: queue,
      name: queueConfig[queue].name,
      icon: queueConfig[queue].icon,
      count: root[`${queue}Count`]
    }));

    return (
      <div>
        <ModerationHeader
          searchVisible={this.props.moderation.storySearchVisible}
          openSearch={this.openSearch}
          closeSearch={this.closeSearch}
          asset={asset}
        />
        <ModerationMenu
          asset={asset}
          getModPath={getModPath}
          items={menuItems}
          selectSort={this.props.setSortOrder}
          sort={this.props.moderation.sortOrder}
          activeTab={activeTab}
        />
        <ModerationQueue
          key={`${activeTab}_${this.props.moderation.sortOrder}`}
          data={this.props.data}
          root={this.props.root}
          currentAsset={asset}
          comments={comments.nodes}
          activeTab={activeTab}
          singleView={moderation.singleView}
          selectedCommentId={this.state.selectedCommentId}
          bannedWords={settings.wordlist.banned}
          suspectWords={settings.wordlist.suspect}
          showBanUserDialog={props.showBanUserDialog}
          showSuspendUserDialog={props.showSuspendUserDialog}
          acceptComment={props.acceptComment}
          rejectComment={props.rejectComment}
          loadMore={this.loadMore}
          assetId={assetId}
          sort={this.props.moderation.sortOrder}
          commentCount={activeTabCount}
          currentUserId={this.props.auth.user.id}
          viewUserDetail={viewUserDetail}
        />
        <ModerationKeysModal
          hideShortcutsNote={props.hideShortcutsNote}
          shortcutsNoteVisible={moderation.shortcutsNoteVisible}
          open={moderation.modalOpen}
          onClose={this.onClose}/>

        <StorySearch
          assetId={assetId}
          moderation={this.props.moderation}
          closeSearch={this.closeSearch}
          storySearchChange={this.props.storySearchChange}
        />

        <Slot
          data={data}
          queryData={{root, asset}}
          activeTab={activeTab}
          handleCommentChange={handleCommentChange}
          fill='adminModeration'
        />
      </div>
    );
  }
}

Moderation.propTypes = {
  viewUserDetail: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  toggleStorySearch: PropTypes.func.isRequired,
  getModPath: PropTypes.func.isRequired,
  storySearchChange: PropTypes.func.isRequired,
  moderation: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  queueConfig: PropTypes.object.isRequired,
  handleCommentChange: PropTypes.func.isRequired,
  setSortOrder: PropTypes.func.isRequired,
  showBanUserDialog: PropTypes.func.isRequired,
  showSuspendUserDialog: PropTypes.func.isRequired,
  rejectComment: PropTypes.func.isRequired,
  acceptComment: PropTypes.func.isRequired,
  loadMore: PropTypes.func.isRequired,
  singleView: PropTypes.func.isRequired,
  activeTab: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  root: PropTypes.object.isRequired,
};

export default Moderation;
