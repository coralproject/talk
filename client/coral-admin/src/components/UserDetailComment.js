import React from 'react';
import PropTypes from 'prop-types';
import Slot from 'coral-framework/components/Slot';
import { Link } from 'react-router';
import { Icon } from 'coral-ui';
import CommentDetails from './CommentDetails';
import styles from './UserDetailComment.css';
import AdminCommentContent from 'coral-framework/components/AdminCommentContent';
import IfHasLink from 'coral-admin/src/components/IfHasLink';
import cn from 'classnames';
import CommentAnimatedEdit from './CommentAnimatedEdit';
import CommentLabels from '../containers/CommentLabels';
import ApproveButton from './ApproveButton';
import RejectButton from 'coral-admin/src/components/RejectButton';
import CommentDeletedTombstone from './CommentDeletedTombstone';

import { buildCommentURL } from 'coral-framework/utils/url';
import TimeAgo from 'coral-framework/components/TimeAgo';
import t from 'coral-framework/services/i18n';

class UserDetailComment extends React.Component {
  approve = () =>
    this.props.comment.status === 'ACCEPTED'
      ? null
      : this.props.acceptComment({ commentId: this.props.comment.id });

  reject = () =>
    this.props.comment.status === 'REJECTED'
      ? null
      : this.props.rejectComment({ commentId: this.props.comment.id });

  render() {
    const {
      comment,
      selected,
      toggleSelect,
      className,
      root: { settings },
    } = this.props;

    const slotPassthrough = {
      root,
      comment,
      suspectWords: settings.wordlist.suspect,
      bannedWords: settings.wordlist.banned,
      body: comment.body,
    };

    if (!comment.body) {
      return (
        <li
          tabIndex={0}
          className={cn(className, styles.root, {
            [styles.rootSelected]: selected,
          })}
        >
          <CommentDeletedTombstone />
        </li>
      );
    }

    return (
      <li
        tabIndex={0}
        className={cn(className, styles.root, {
          [styles.rootSelected]: selected,
        })}
      >
        <div className={styles.container}>
          <div className={styles.header}>
            <input
              className={styles.bulkSelectInput}
              type="checkbox"
              value={comment.id}
              checked={selected}
              onChange={e => toggleSelect(e.target.value, e.target.checked)}
            />
            <TimeAgo className={styles.created} datetime={comment.created_at} />
            {comment.editing && comment.editing.edited ? (
              <span>
                &nbsp;<span className={styles.editedMarker}>
                  ({t('comment.edited')})
                </span>
              </span>
            ) : null}

            <div className={styles.labels}>
              <CommentLabels comment={comment} />
            </div>
          </div>
          <div className={styles.story}>
            {t('common.story')}:{' '}
            {comment.asset.title ? comment.asset.title : comment.asset.url}
            {
              <Link to={`/admin/moderate/${comment.asset.id}`}>
                {t('modqueue.moderate')}
              </Link>
            }
          </div>
          <CommentAnimatedEdit body={comment.body}>
            <div className={styles.bodyContainer}>
              <div className={styles.body}>
                <Slot
                  fill="userDetailCommentContent"
                  className={cn(
                    styles.commentContent,
                    'talk-admin-user-detail-comment'
                  )}
                  size={1}
                  defaultComponent={AdminCommentContent}
                  passthrough={slotPassthrough}
                />
                <a
                  className={styles.external}
                  href={buildCommentURL(comment.asset.url, comment.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="open_in_new" /> {t('comment.view_context')}
                </a>
              </div>
              <div className={styles.sideActions}>
                <IfHasLink text={comment.body}>
                  <span className={styles.hasLinks}>
                    {/* TODO: translate string */}
                    <Icon name="error_outline" /> {t('common.contains_link')}
                  </span>
                </IfHasLink>
                <div className={styles.actions}>
                  <ApproveButton
                    active={comment.status === 'ACCEPTED'}
                    onClick={this.approve}
                    minimal
                  />
                  <RejectButton
                    active={comment.status === 'REJECTED'}
                    onClick={this.reject}
                    minimal
                  />
                </div>
              </div>
            </div>
          </CommentAnimatedEdit>
        </div>
        <CommentDetails root={root} comment={comment} />
      </li>
    );
  }
}

UserDetailComment.propTypes = {
  selected: PropTypes.bool,
  user: PropTypes.object.isRequired,
  viewUserDetail: PropTypes.func.isRequired,
  acceptComment: PropTypes.func.isRequired,
  rejectComment: PropTypes.func.isRequired,
  className: PropTypes.string,
  toggleSelect: PropTypes.func,
  root: PropTypes.shape({
    settings: PropTypes.shape({
      wordlist: PropTypes.shape({
        suspect: PropTypes.arrayOf(PropTypes.string).isRequired,
        banned: PropTypes.arrayOf(PropTypes.string).isRequired,
      }),
    }),
  }),
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    body: PropTypes.string,
    actions: PropTypes.array,
    created_at: PropTypes.string.isRequired,
    asset: PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
      id: PropTypes.string,
    }),
  }),
};

export default UserDetailComment;
