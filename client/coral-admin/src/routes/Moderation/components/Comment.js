import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import { Icon } from 'coral-ui';
import CommentDetails from 'coral-admin/src/components/CommentDetails';
import styles from './Comment.css';
import CommentLabels from 'coral-admin/src/components/CommentLabels';
import CommentAnimatedEdit from 'coral-admin/src/components/CommentAnimatedEdit';
import Slot from 'coral-framework/components/Slot';
import AdminCommentContent from 'coral-framework/components/AdminCommentContent';
import IfHasLink from 'coral-admin/src/components/IfHasLink';
import cn from 'classnames';
import ApproveButton from 'coral-admin/src/components/ApproveButton';
import RejectButton from 'coral-admin/src/components/RejectButton';
import CommentDeletedTombstone from '../../../components/CommentDeletedTombstone';
import TimeAgo from 'coral-framework/components/TimeAgo';

import { buildCommentURL } from 'coral-framework/utils/url';
import t from 'coral-framework/services/i18n';

class Comment extends React.Component {
  ref = null;

  handleRef = ref => (this.ref = ref);

  handleFocusOrClick = () => {
    if (!this.props.selected) {
      this.props.selectComment();
    }
  };

  viewUserDetail = () => {
    const { viewUserDetail, comment } = this.props;
    return viewUserDetail(comment.user.id);
  };

  approve = () =>
    this.props.comment.status === 'ACCEPTED'
      ? null
      : this.props.acceptComment({ commentId: this.props.comment.id });

  reject = () =>
    this.props.comment.status === 'REJECTED'
      ? null
      : this.props.rejectComment({ commentId: this.props.comment.id });

  componentDidUpdate(prev) {
    if (!prev.selected && this.props.selected) {
      this.ref.focus();
    }
  }

  render() {
    const {
      comment,
      selected,
      className,
      root,
      root: { settings },
      currentAsset,
      clearHeightCache,
      dangling,
    } = this.props;

    const selectionStateCSS = selected ? 'mdl-shadow--16dp' : 'mdl-shadow--2dp';

    const formatterSettings = {
      suspectWords: settings.wordlist.suspect,
      bannedWords: settings.wordlist.banned,
      body: comment.body,
    };

    const slotPassthrough = {
      clearHeightCache,
      root,
      comment,
      asset: comment.asset,
    };

    if (!comment.body) {
      return (
        <li
          tabIndex={0}
          className={cn(
            className,
            'mdl-card',
            selectionStateCSS,
            styles.root,
            { [styles.selected]: selected, [styles.dangling]: dangling },
            'talk-admin-moderate-comment',
            styles.deleted
          )}
          id={`comment_${comment.id}`}
          ref={this.handleRef}
        >
          <CommentDeletedTombstone />
        </li>
      );
    }

    return (
      <li
        tabIndex={0}
        className={cn(
          className,
          'mdl-card',
          selectionStateCSS,
          styles.root,
          { [styles.selected]: selected, [styles.dangling]: dangling },
          'talk-admin-moderate-comment'
        )}
        id={`comment_${comment.id}`}
        onClick={this.handleFocusOrClick}
        ref={this.handleRef}
        onFocus={this.handleFocusOrClick}
      >
        <div className={styles.container}>
          <div className={styles.itemHeader}>
            <div className={styles.author}>
              <span
                className={cn(
                  styles.username,
                  'talk-admin-moderate-comment-username'
                )}
                onClick={this.viewUserDetail}
              >
                {comment.user.username}
              </span>

              <TimeAgo
                className={styles.created}
                datetime={comment.created_at}
              />
              {comment.editing && comment.editing.edited ? (
                <span>
                  &nbsp;<span className={styles.editedMarker}>
                    ({t('comment.edited')})
                  </span>
                </span>
              ) : null}
              <div className={styles.adminCommentInfoBar}>
                <CommentLabels comment={comment} />
                <Slot
                  fill="adminCommentInfoBar"
                  passthrough={slotPassthrough}
                />
              </div>
            </div>
          </div>

          <div className={styles.moderateArticle}>
            {t('common.story')}:{' '}
            {comment.asset.title ? comment.asset.title : comment.asset.url}
            {!currentAsset && (
              <Link to={`/admin/moderate/${comment.asset.id}`}>
                {t('modqueue.moderate')}
              </Link>
            )}
          </div>
          <CommentAnimatedEdit body={comment.body}>
            <div className={styles.itemBody}>
              <div className={styles.body}>
                <Slot
                  fill="adminCommentContent"
                  className={cn(styles.commentContent, 'talk-admin-comment')}
                  size={1}
                  defaultComponent={AdminCommentContent}
                  passthrough={{ ...slotPassthrough, ...formatterSettings }}
                />
                <div className={styles.commentContentFooter}>
                  <a
                    className={styles.external}
                    href={buildCommentURL(comment.asset.url, comment.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name="open_in_new" /> {t('comment.view_context')}
                  </a>
                </div>
              </div>

              <div className={styles.sideActions}>
                <IfHasLink text={comment.body}>
                  <span className={styles.hasLinks}>
                    <Icon name="error_outline" /> {t('common.contains_link')}
                  </span>
                </IfHasLink>
                <div className={`actions ${styles.actions}`}>
                  <ApproveButton
                    active={comment.status === 'ACCEPTED'}
                    onClick={this.approve}
                  />
                  <RejectButton
                    active={comment.status === 'REJECTED'}
                    onClick={this.reject}
                  />
                </div>
                <Slot fill="adminSideActions" passthrough={slotPassthrough} />
              </div>
            </div>
          </CommentAnimatedEdit>
        </div>
        <CommentDetails
          root={root}
          comment={comment}
          clearHeightCache={clearHeightCache}
        />
      </li>
    );
  }
}

Comment.propTypes = {
  viewUserDetail: PropTypes.func.isRequired,
  acceptComment: PropTypes.func.isRequired,
  selectComment: PropTypes.func,
  rejectComment: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  dangling: PropTypes.bool,
  currentAsset: PropTypes.object,
  currentUserId: PropTypes.string.isRequired,
  clearHeightCache: PropTypes.func,
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    body: PropTypes.string,
    action_summaries: PropTypes.array,
    actions: PropTypes.array,
    created_at: PropTypes.string.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string,
      status: PropTypes.string,
    }).isRequired,
    asset: PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
      id: PropTypes.string,
    }),
  }),
  root: PropTypes.object.isRequired,
  selected: PropTypes.bool,
};

export default Comment;
