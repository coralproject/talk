import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import { Icon } from 'coral-ui';
import CommentDetails from 'coral-admin/src/components/CommentDetails';
import styles from './Comment.css';
import CommentLabels from 'coral-admin/src/components/CommentLabels';
import CommentAnimatedEdit from 'coral-admin/src/components/CommentAnimatedEdit';
import Slot from 'coral-framework/components/Slot';
import CommentFormatter from 'coral-admin/src/components/CommentFormatter';
import IfHasLink from 'coral-admin/src/components/IfHasLink';
import cn from 'classnames';
import ApproveButton from 'coral-admin/src/components/ApproveButton';
import RejectButton from 'coral-admin/src/components/RejectButton';

import t, { timeago } from 'coral-framework/services/i18n';

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
      data,
      root,
      root: { settings },
      currentAsset,
      clearHeightCache,
      dangling,
    } = this.props;

    const selectionStateCSS = selected ? 'mdl-shadow--16dp' : 'mdl-shadow--2dp';
    const queryData = { root, comment, asset: comment.asset };

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

              <span className={styles.created}>
                {timeago(comment.created_at)}
              </span>
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
                  data={data}
                  clearHeightCache={clearHeightCache}
                  queryData={queryData}
                />
              </div>
            </div>
          </div>

          <div className={styles.moderateArticle}>
            Story: {comment.asset.title}
            {!currentAsset && (
              <Link to={`/admin/moderate/${comment.asset.id}`}>
                {t('modqueue.moderate')}
              </Link>
            )}
          </div>
          <CommentAnimatedEdit body={comment.body}>
            <div className={styles.itemBody}>
              <div className={styles.body}>
                <CommentFormatter
                  suspectWords={settings.wordlist.suspect}
                  bannedWords={settings.wordlist.banned}
                  className="talk-admin-comment"
                  body={comment.body}
                />
                <a
                  className={styles.external}
                  href={`${comment.asset.url}?commentId=${comment.id}`}
                  target="_blank"
                >
                  <Icon name="open_in_new" /> {t('comment.view_context')}
                </a>
              </div>
              <Slot
                fill="adminCommentContent"
                data={data}
                clearHeightCache={clearHeightCache}
                queryData={queryData}
              />
              <div className={styles.sideActions}>
                <IfHasLink text={comment.body}>
                  <span className={styles.hasLinks}>
                    <Icon name="error_outline" /> Contains Link
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
                <Slot
                  fill="adminSideActions"
                  data={data}
                  clearHeightCache={clearHeightCache}
                  queryData={queryData}
                />
              </div>
            </div>
          </CommentAnimatedEdit>
        </div>
        <CommentDetails
          data={data}
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
    body: PropTypes.string.isRequired,
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
  data: PropTypes.object.isRequired,
  root: PropTypes.object.isRequired,
  selected: PropTypes.bool,
};

export default Comment;
