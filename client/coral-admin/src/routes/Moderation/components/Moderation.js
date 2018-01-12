import React, { Component } from 'react';
import PropTypes from 'prop-types';
import key from 'keymaster';
import cn from 'classnames';
import styles from './Moderation.css';
import ModerationQueue from './ModerationQueue';
import ModerationMenu from './ModerationMenu';
import ModerationHeader from './ModerationHeader';
import ModerationKeysModal from '../../../components/ModerationKeysModal';
import StorySearch from '../containers/StorySearch';
import Slot from 'coral-framework/components/Slot';
import ViewOptions from './ViewOptions';

class Moderation extends Component {
  state = {
    isLoadingMore: false,
  };

  componentWillMount() {
    const { toggleModal, singleView } = this.props;

    key('s', () => singleView());
    key('shift+/', () => toggleModal(true));
    key('esc', () => toggleModal(false));
    key('ctrl+f', () => this.openSearch());
    key('t', () => this.nextQueue());
    key('f', () => this.moderate(false));
    key('d', () => this.moderate(true));
    this.getMenuItems().forEach((menuItem, idx) =>
      key(`${idx + 1}`, () => this.selectQueue(menuItem))
    );
  }

  onClose = () => {
    this.props.toggleModal(false);
  };

  nextQueue = () => {
    const activeTab = this.props.activeTab;

    const menuItems = this.getMenuItems();

    const activeTabIndex = menuItems.findIndex(item => item === activeTab);
    const nextQueueIndex =
      activeTabIndex === menuItems.length - 1 ? 0 : activeTabIndex + 1;

    this.selectQueue(menuItems[nextQueueIndex]);
  };

  selectQueue = key => {
    const assetId = this.props.data.variables.asset_id;
    this.props.router.push(this.props.getModPath(key, assetId));
  };

  getMenuItems = () => Object.keys(this.props.queueConfig);

  closeSearch = () => {
    const { toggleStorySearch } = this.props;
    toggleStorySearch(false);
  };

  openSearch = () => {
    this.props.toggleStorySearch(true);
  };

  getActiveTabCount = (props = this.props) => {
    return props.root[`${props.activeTab}Count`];
  };

  moderate = accept => {
    const {
      acceptComment,
      rejectComment,
      moderation: { selectedCommentId },
    } = this.props;

    // Accept or reject only if there's a selected comment
    if (selectedCommentId != null) {
      const comments = this.getComments();
      const commentIdx = comments.findIndex(
        comment => comment.id === selectedCommentId
      );
      const comment = comments[commentIdx];

      if (accept) {
        comment.status !== 'ACCEPTED' &&
          acceptComment({ commentId: comment.id });
      } else {
        comment.status !== 'REJECTED' &&
          rejectComment({ commentId: comment.id });
      }
    }
  };

  getComments = (props = this.props) => {
    const { root, activeTab } = props;
    return root[activeTab].nodes;
  };

  loadMore = async () => {
    if (!this.state.isLoadingMore) {
      this.setState({ isLoadingMore: true });
      try {
        const result = await this.props.loadMore(this.props.activeTab);
        this.setState({ isLoadingMore: false });
        return result;
      } catch (e) {
        this.setState({ isLoadingMore: false });
        throw e;
      }
    }
    return false;
  };

  componentWillUnmount() {
    key.unbind('s');
    key.unbind('shift+/');
    key.unbind('esc');
    key.unbind('ctrl+f');
    key.unbind('t');
    key.unbind('f');
    key.unbind('d');
    this.getMenuItems().forEach((menuItem, idx) => key.unbind(`${idx + 1}`));
  }

  render() {
    const {
      root,
      data,
      moderation,
      viewUserDetail,
      activeTab,
      getModPath,
      queueConfig,
      handleCommentChange,
      ...props
    } = this.props;
    const { asset } = root;
    const assetId = asset && asset.id;

    const comments = root[activeTab];

    const activeTabCount = this.getActiveTabCount();
    const menuItems = Object.keys(queueConfig).map(queue => ({
      key: queue,
      name: queueConfig[queue].name,
      icon: queueConfig[queue].icon,
      count: root[`${queue}Count`],
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
          activeTab={activeTab}
        />
        <div
          className={cn(styles.container, 'talk-admin-moderation-container')}
        >
          <ViewOptions
            selectSort={this.props.setSortOrder}
            sort={this.props.moderation.sortOrder}
          />
          <ModerationQueue
            key={`${activeTab}_${this.props.moderation.sortOrder}`}
            data={this.props.data}
            root={this.props.root}
            currentAsset={asset}
            comments={comments.nodes}
            hasNextPage={comments.hasNextPage}
            activeTab={activeTab}
            singleView={moderation.singleView}
            selectedCommentId={moderation.selectedCommentId}
            acceptComment={props.acceptComment}
            rejectComment={props.rejectComment}
            loadMore={this.loadMore}
            commentBelongToQueue={this.props.commentBelongToQueue}
            isLoadingMore={this.state.isLoadingMore}
            commentCount={activeTabCount}
            currentUserId={this.props.auth.user.id}
            viewUserDetail={viewUserDetail}
            selectCommentId={props.selectCommentId}
            cleanUpQueue={props.cleanUpQueue}
          />
          <ModerationKeysModal
            hideShortcutsNote={props.hideShortcutsNote}
            shortcutsNoteVisible={moderation.shortcutsNoteVisible}
            open={moderation.modalOpen}
            onClose={this.onClose}
            queueCount={this.getMenuItems().length}
          />
        </div>
        <StorySearch
          assetId={assetId}
          moderation={this.props.moderation}
          closeSearch={this.closeSearch}
          storySearchChange={this.props.storySearchChange}
        />
        <Slot
          data={data}
          queryData={{ root, asset }}
          activeTab={activeTab}
          handleCommentChange={handleCommentChange}
          fill="adminModeration"
        />
      </div>
    );
  }
}

Moderation.propTypes = {
  viewUserDetail: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  selectedCommentId: PropTypes.string,
  toggleStorySearch: PropTypes.func.isRequired,
  getModPath: PropTypes.func.isRequired,
  cleanUpQueue: PropTypes.func.isRequired,
  storySearchChange: PropTypes.func.isRequired,
  moderation: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  queueConfig: PropTypes.object.isRequired,
  commentBelongToQueue: PropTypes.func.isRequired,
  handleCommentChange: PropTypes.func.isRequired,
  setSortOrder: PropTypes.func.isRequired,
  rejectComment: PropTypes.func.isRequired,
  acceptComment: PropTypes.func.isRequired,
  loadMore: PropTypes.func.isRequired,
  singleView: PropTypes.func.isRequired,
  activeTab: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  root: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
};

export default Moderation;
