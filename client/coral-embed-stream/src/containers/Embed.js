import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import isEqual from 'lodash/isEqual';

import {Spinner} from 'coral-ui';
import {queryStream} from 'coral-framework/graphql/queries';
import {postComment, postFlag, postLike, postDontAgree, deleteAction, addCommentTag, removeCommentTag, ignoreUser} from 'coral-framework/graphql/mutations';
import {editName} from 'coral-framework/actions/user';
import {viewAllComments} from 'coral-framework/actions/asset';
import {notificationActions, authActions, assetActions, pym} from 'coral-framework';
import {NEW_COMMENT_COUNT_POLL_INTERVAL} from '../constants/stream';
import Embed from '../components/Embed';
import {setCommentCountCache, setActiveReplyBox} from '../actions/stream';

const {logout, showSignInDialog, requestConfirmEmail} = authActions;
const {addNotification, clearNotification} = notificationActions;
const {fetchAssetSuccess} = assetActions;

class EmbedContainer extends React.Component {

  componentDidMount() {
    pym.sendMessage('childReady');
  }

  componentWillUnmount() {
    clearInterval(this.countPoll);
  }

  componentWillReceiveProps(nextProps) {
    const {fetchAssetSuccess} = this.props;
    if(!isEqual(nextProps.data.asset, this.props.data.asset)) {

      // TODO: remove asset data from redux store.
      fetchAssetSuccess(nextProps.data.asset);

      const {getCounts, setCommentCountCache, commentCountCache} = this.props;
      const {asset} = nextProps.data;

      if (commentCountCache === -1) {
        setCommentCountCache(asset.commentCount);
      }

      this.countPoll = setInterval(() => {
        const {asset} = this.props.data;
        getCounts({
          asset_id: asset.id,
          limit: asset.comments.length,
          sort: 'REVERSE_CHRONOLOGICAL'
        });
      }, NEW_COMMENT_COUNT_POLL_INTERVAL);
    }
  }

  componentDidUpdate(prevProps) {
    if(!isEqual(prevProps.data.comment, this.props.data.comment)) {

      // Scroll to a permalinked comment if one is in the URL once the page is done rendering.
      setTimeout(() => pym.scrollParentToChildEl('coralStream'), 0);
    }
  }

  render() {
    if (!this.props.data.asset) {
      return <Spinner />;
    }
    return <Embed {...this.props} />;
  }
}

const mapStateToProps = state => ({
  auth: state.auth.toJS(),
  commentCountCache: state.stream.commentCountCache,
  activeReplyBox: state.stream.activeReplyBox,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    showSignInDialog,
    requestConfirmEmail,
    fetchAssetSuccess,
    addNotification,
    clearNotification,
    editName,
    setCommentCountCache,
    viewAllComments,
    logout,
    setActiveReplyBox,
  }, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  postComment,
  postFlag,
  postLike,
  postDontAgree,
  addCommentTag,
  removeCommentTag,
  ignoreUser,
  deleteAction,
  queryStream,
)(EmbedContainer);
