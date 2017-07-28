import React, {PropTypes} from 'react';
import {Link} from 'react-router';

import {Icon} from 'coral-ui';
import FlagBox from './FlagBox';
import styles from './UserDetailComment.css';
import CommentType from './CommentType';
import {getActionSummary} from 'coral-framework/utils';
import ActionButton from 'coral-admin/src/components/ActionButton';
import CommentBodyHighlighter from 'coral-admin/src/components/CommentBodyHighlighter';
import IfHasLink from 'coral-admin/src/components/IfHasLink';
import cn from 'classnames';
import {getCommentType} from 'coral-admin/src/utils/comment';
import CommentAnimatedEdit from './CommentAnimatedEdit';

import t, {timeago} from 'coral-framework/services/i18n';

class UserDetailComment extends React.Component {

  render() {
    const {
      actions = [],
      comment,
      viewUserDetail,
      suspectWords,
      bannedWords,
      selected,
      toggleSelect,
      className,
      user,
      ...props
    } = this.props;

    const flagActionSummaries = getActionSummary('FlagActionSummary', comment);
    const flagActions = comment.actions && comment.actions.filter((a) => a.__typename === 'FlagAction');
    const commentType = getCommentType(comment);

    return (
      <li
        tabIndex={0}
        className={cn(className, styles.root, {[styles.rootSelected]: selected})}
      >
        <div className={styles.container}>
          <div className={styles.header}>
            <input
              className={styles.bulkSelectInput}
              type='checkbox'
              value={comment.id}
              checked={selected}
              onChange={(e) => toggleSelect(e.target.value, e.target.checked)} />
            <span className={styles.created}>
              {timeago(comment.created_at)}
            </span>
            {
              (comment.editing && comment.editing.edited)
              ? <span>&nbsp;<span className={styles.editedMarker}>({t('comment.edited')})</span></span>
              : null
            }
            <CommentType type={commentType} className={styles.commentType}/>
          </div>
          <div className={styles.story}>
            Story: {comment.asset.title}
            {<Link to={`/admin/moderate/all/${comment.asset.id}`}>{t('modqueue.moderate')}</Link>}
          </div>
          <CommentAnimatedEdit body={comment.body}>
            <div className={styles.bodyContainer}>
              <p className={styles.body}>
                <CommentBodyHighlighter
                  suspectWords={suspectWords}
                  bannedWords={bannedWords}
                  body={comment.body}
                />
                {' '}
                <a
                  className={styles.external}
                  href={`${comment.asset.url}?commentId=${comment.id}`}
                  target="_blank"
                >
                  <Icon name="open_in_new" /> {t('comment.view_context')}
                </a>
              </p>
              <div className={styles.sideActions}>
                <IfHasLink text={comment.body}>
                  <span className={styles.hasLinks}>
                    <Icon name="error_outline" /> Contains Link
                  </span>
                </IfHasLink>
                <div className={styles.actions}>
                  {actions.map((action, i) => {
                    const active =
                      (action === 'REJECT' && comment.status === 'REJECTED') ||
                      (action === 'APPROVE' && comment.status === 'ACCEPTED');
                    return (
                      <ActionButton
                        minimal={true}
                        key={i}
                        type={action}
                        user={user}
                        status={comment.status}
                        active={active}
                        acceptComment={() =>
                          (comment.status === 'ACCEPTED'
                            ? null
                            : props.acceptComment({commentId: comment.id}))}
                        rejectComment={() =>
                          (comment.status === 'REJECTED'
                            ? null
                            : props.rejectComment({commentId: comment.id}))}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </CommentAnimatedEdit>
        </div>
        {flagActions && flagActions.length
          ? <FlagBox
              actions={flagActions}
              actionSummaries={flagActionSummaries}
              viewUserDetail={viewUserDetail}
            />
          : null}
      </li>
    );
  }
}

UserDetailComment.propTypes = {
  user: PropTypes.object.isRequired,
  viewUserDetail: PropTypes.func.isRequired,
  acceptComment: PropTypes.func.isRequired,
  rejectComment: PropTypes.func.isRequired,
  className: PropTypes.string,
  suspectWords: PropTypes.arrayOf(PropTypes.string).isRequired,
  bannedWords: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleSelect: PropTypes.func,
  comment: PropTypes.shape({
    body: PropTypes.string.isRequired,
    action_summaries: PropTypes.array,
    actions: PropTypes.array,
    created_at: PropTypes.string.isRequired,
    asset: PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
      id: PropTypes.string
    })
  })
};

export default UserDetailComment;
