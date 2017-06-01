import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import Linkify from 'react-linkify';

import {Icon} from 'coral-ui';
import FlagBox from './FlagBox';
import styles from './styles.css';
import CommentType from './CommentType';
import Highlighter from 'react-highlight-words';
import Slot from 'coral-framework/components/Slot';
import {getActionSummary} from 'coral-framework/utils';
import ActionButton from 'coral-admin/src/components/ActionButton';
import ActionsMenu from 'coral-admin/src/components/ActionsMenu';
import ActionsMenuItem from 'coral-admin/src/components/ActionsMenuItem';

const linkify = new Linkify();

import t, {timeago} from 'coral-framework/services/i18n';

const Comment = ({
  actions = [],
  comment,
  viewUserDetail,
  suspectWords,
  bannedWords,
  minimal,
  ...props
}) => {
  const links = linkify.getMatches(comment.body);
  const linkText = links ? links.map((link) => link.raw) : [];
  const flagActionSummaries = getActionSummary('FlagActionSummary', comment);
  const flagActions =
    comment.actions &&
    comment.actions.filter((a) => a.__typename === 'FlagAction');
  let commentType = '';
  if (comment.status === 'PREMOD') {
    commentType = 'premod';
  } else if (flagActions && flagActions.length) {
    commentType = 'flagged';
  }

  // since words are checked against word boundaries on the backend,
  // should be the behavior on the front end as well.
  // currently the highlighter plugin does not support out of the box.
  const searchWords = [...suspectWords, ...bannedWords]
    .filter((w) => {
      return new RegExp(`(^|\\s)${w}(\\s|$)`).test(comment.body);
    })
    .concat(linkText);

  return (
    <li
      tabIndex={props.index}
      className={`mdl-card ${props.selected ? 'mdl-shadow--16dp' : 'mdl-shadow--2dp'} ${styles.Comment} ${styles.listItem} ${props.selected ? styles.selected : ''}`}
    >
      <div className={styles.container}>
        <div className={styles.itemHeader}>
          <div className={styles.author}>
            {
              !minimal && (
                <span className={styles.username} onClick={() => viewUserDetail(comment.user.id)}>
                  {comment.user.name}
                </span>
              )
            }
            <span className={styles.created}>
              {timeago(comment.created_at || Date.now() - props.index * 60 * 1000)}
            </span>
            {props.currentUserId !== comment.user.id &&
              <ActionsMenu icon="not_interested">
                <ActionsMenuItem
                  disabled={comment.user.status === 'BANNED'}
                  onClick={() => props.showSuspendUserDialog(comment.user.id, comment.user.name, comment.id, comment.status)}>
                  Suspend User</ActionsMenuItem>
                <ActionsMenuItem
                  disabled={comment.user.status === 'BANNED'}
                  onClick={() => props.showBanUserDialog(comment.user, comment.id, comment.status, comment.status !== 'REJECTED')}>
                  Ban User
                </ActionsMenuItem>
              </ActionsMenu>
            }
            <CommentType type={commentType} />
          </div>
          {comment.user.status === 'banned'
            ? <span className={styles.banned}>
                <Icon name="error_outline" />
                {t('comment.banned_user')}
              </span>
            : null}
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
        <div className={styles.itemBody}>
          <p className={styles.body}>
            <Highlighter
              searchWords={searchWords}
              textToHighlight={comment.body}
            />
            {' '}
            <a
              className={styles.external}
              href={`${comment.asset.url}#${comment.id}`}
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
            {links
              ? <span className={styles.hasLinks}>
                  <Icon name="error_outline" /> Contains Link
                </span>
              : null}
            <div className={`actions ${styles.actions}`}>
              {actions.map((action, i) => {
                const active =
                  (action === 'REJECT' && comment.status === 'REJECTED') ||
                  (action === 'APPROVE' && comment.status === 'ACCEPTED');
                return (
                  <ActionButton
                    minimal={minimal}
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
      </div>
      <div>
        <Slot
          data={props.data}
          root={props.root}
          fill="adminCommentDetailArea"
          comment={comment}
        />
      </div>
      {flagActions && flagActions.length
        ? <FlagBox
            actions={flagActions}
            actionSummaries={flagActionSummaries}
          />
        : null}
    </li>
  );
};

Comment.propTypes = {
  minimal: PropTypes.bool,
  viewUserDetail: PropTypes.func.isRequired,
  acceptComment: PropTypes.func.isRequired,
  rejectComment: PropTypes.func.isRequired,
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
