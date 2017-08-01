import React, {PropTypes} from 'react';
import {Link} from 'react-router';

import {Icon} from 'coral-ui';
import FlagBox from 'coral-admin/src/components/FlagBox';
import styles from './styles.css';
import CommentType from 'coral-admin/src/components/CommentType';
import CommentAnimatedEdit from 'coral-admin/src/components/CommentAnimatedEdit';
import Slot from 'coral-framework/components/Slot';
import {getActionSummary} from 'coral-framework/utils';
import ActionButton from 'coral-admin/src/components/ActionButton';
import ActionsMenu from 'coral-admin/src/components/ActionsMenu';
import ActionsMenuItem from 'coral-admin/src/components/ActionsMenuItem';
import CommentBodyHighlighter from 'coral-admin/src/components/CommentBodyHighlighter';
import IfHasLink from 'coral-admin/src/components/IfHasLink';
import cn from 'classnames';
import {getCommentType} from 'coral-admin/src/utils/comment';

import t, {timeago} from 'coral-framework/services/i18n';

class Comment extends React.Component {

  render() {
    const {
      actions = [],
      comment,
      viewUserDetail,
      suspectWords,
      bannedWords,
      selected,
      className,
      ...props
    } = this.props;

    const flagActionSummaries = getActionSummary('FlagActionSummary', comment);
    const flagActions = comment.actions && comment.actions.filter((a) => a.__typename === 'FlagAction');
    const commentType = getCommentType(comment);

    let selectionStateCSS = selected ? 'mdl-shadow--16dp' : 'mdl-shadow--2dp';

    const showSuspenUserDialog = () => props.showSuspendUserDialog({
      userId: comment.user.id,
      username: comment.user.username,
      commentId: comment.id,
      commentStatus: comment.status,
    });

    const showBanUserDialog = () => props.showBanUserDialog({
      userId: comment.user.id,
      username: comment.user.username,
      commentId: comment.id,
      commentStatus: comment.status,
    });

    return (
      <li
        tabIndex={0}
        className={cn(className, 'mdl-card', selectionStateCSS, styles.Comment, styles.listItem, {[styles.selected]: selected})}
      >
        <div className={styles.container}>
          <div className={styles.itemHeader}>
            <div className={styles.author}>
              {
                (
                  <span className={styles.username} onClick={() => viewUserDetail(comment.user.id)}>
                    {comment.user.username}
                  </span>
                )
              }
              <span className={styles.created}>
                {timeago(comment.created_at)}
              </span>
              {
                (comment.editing && comment.editing.edited)
                ? <span>&nbsp;<span className={styles.editedMarker}>({t('comment.edited')})</span></span>
                : null
              }
              {props.currentUserId !== comment.user.id &&
                <ActionsMenu icon="not_interested">
                  <ActionsMenuItem
                    disabled={comment.user.status === 'BANNED'}
                    onClick={showSuspenUserDialog}>
                    Suspend User</ActionsMenuItem>
                  <ActionsMenuItem
                    disabled={comment.user.status === 'BANNED'}
                    onClick={showBanUserDialog}>
                    Ban User
                  </ActionsMenuItem>
                </ActionsMenu>
              }
              <CommentType type={commentType} className={styles.commentType}/>
            </div>
            <Slot
              data={props.data}
              root={props.root}
              fill="adminCommentInfoBar"
              comment={comment}
            />
          </div>
          <div className={styles.moderateArticle}>
            Story: {comment.asset.title}
            {!props.currentAsset &&
              <Link to={`/admin/moderate/${comment.asset.id}`}>{t('modqueue.moderate')}</Link>}
          </div>
          <CommentAnimatedEdit body={comment.body}>
            <div className={styles.itemBody}>
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
              <Slot
                data={props.data}
                root={props.root}
                fill="adminCommentContent"
                comment={comment}
              />
              <div className={styles.sideActions}>
                <IfHasLink text={comment.body}>
                  <span className={styles.hasLinks}>
                    <Icon name="error_outline" /> Contains Link
                  </span>
                </IfHasLink>
                <div className={`actions ${styles.actions}`}>
                  {actions.map((action, i) => {
                    const active =
                      (action === 'REJECT' && comment.status === 'REJECTED') ||
                      (action === 'APPROVE' && comment.status === 'ACCEPTED');
                    return (
                      <ActionButton
                        key={i}
                        type={action}
                        user={comment.user}
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
                <Slot
                  data={props.data}
                  root={props.root}
                  fill="adminSideActions"
                  comment={comment}
                />
              </div>
            </div>
          </CommentAnimatedEdit>
        </div>
        <Slot
          data={props.data}
          root={props.root}
          fill="adminCommentDetailArea"
          comment={comment}
        />
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

Comment.propTypes = {
  viewUserDetail: PropTypes.func.isRequired,
  acceptComment: PropTypes.func.isRequired,
  rejectComment: PropTypes.func.isRequired,
  className: PropTypes.string,
  suspectWords: PropTypes.arrayOf(PropTypes.string).isRequired,
  bannedWords: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentAsset: PropTypes.object,
  showBanUserDialog: PropTypes.func.isRequired,
  showSuspendUserDialog: PropTypes.func.isRequired,
  currentUserId: PropTypes.string.isRequired,
  comment: PropTypes.shape({
    body: PropTypes.string.isRequired,
    action_summaries: PropTypes.array,
    actions: PropTypes.array,
    created_at: PropTypes.string.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string,
      status: PropTypes.string
    }).isRequired,
    asset: PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
      id: PropTypes.string
    })
  })
};

export default Comment;
