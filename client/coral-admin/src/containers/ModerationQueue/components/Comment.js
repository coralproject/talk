import React, {PropTypes} from 'react';
import timeago from 'timeago.js';
import Linkify from 'react-linkify';
import Highlighter from 'react-highlight-words';
import {Link} from 'react-router';

import styles from './styles.css';
import {Icon} from 'coral-ui';
import FlagBox from './FlagBox';
import CommentType from './CommentType';
import ActionButton from 'coral-admin/src/components/ActionButton';
import BanUserButton from 'coral-admin/src/components/BanUserButton';
import {getActionSummary} from 'coral-framework/utils';

const linkify = new Linkify();

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-admin/src/translations.json';
const lang = new I18n(translations);

const Comment = ({actions = [], comment, ...props}) => {
  const links = linkify.getMatches(comment.body);
  const linkText = links ? links.map(link => link.raw) : [];
  const flagActionSummaries = getActionSummary('FlagActionSummary', comment);
  const flagActions = comment.actions && comment.actions.filter(a => a.__typename === 'FlagAction');

  return (
    <li tabIndex={props.index} className={`mdl-card ${props.selected ? 'mdl-shadow--8dp' : 'mdl-shadow--2dp'} ${styles.Comment} ${styles.listItem}`}>
      <div className={styles.container}>
        <div className={styles.itemHeader}>
          <div className={styles.author}>
            <span>
              {comment.user.name}
            </span>
            <span className={styles.created}>
              {timeago().format(comment.created_at || (Date.now() - props.index * 60 * 1000), lang.getLocale().replace('-', '_'))}
            </span>
            <BanUserButton user={comment.user} onClick={() => props.showBanUserDialog(comment.user, comment.id, comment.status !== 'REJECTED')} />
            <CommentType type={props.commentType} />
          </div>
          {comment.user.status === 'banned' ?
            <span className={styles.banned}>
              <Icon name='error_outline'/>
              {lang.t('comment.banned_user')}
            </span>
            : null}
        </div>
        <div className={styles.moderateArticle}>
          Story: {comment.asset.title}
          {!props.currentAsset && (
            <Link to={`/admin/moderate/${comment.asset.id}`}>Moderate →</Link>
          )}
        </div>
        <div className={styles.itemBody}>
          <p className={styles.body}>
            <Highlighter
              searchWords={[...props.suspectWords, ...props.bannedWords, ...linkText]}
              textToHighlight={comment.body} />
          </p>
          <div className={styles.sideActions}>
            {links ? <span className={styles.hasLinks}><Icon name='error_outline'/> Contains Link</span> : null}
            <div className={`actions ${styles.actions}`}>
              {actions.map((action, i) =>
                <ActionButton key={i}
                              type={action}
                              user={comment.user}
                              status={comment.status}
                              acceptComment={() => props.acceptComment({commentId: comment.id})}
                              rejectComment={() => props.rejectComment({commentId: comment.id})}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {
        flagActions && flagActions.length
        ? <FlagBox actions={flagActions} actionSummaries={flagActionSummaries} />
        : null
      }
    </li>
  );
};

Comment.propTypes = {
  acceptComment: PropTypes.func.isRequired,
  rejectComment: PropTypes.func.isRequired,
  suspectWords: PropTypes.arrayOf(PropTypes.string).isRequired,
  bannedWords: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentAsset: PropTypes.object,
  comment: PropTypes.shape({
    body: PropTypes.string.isRequired,
    action_summaries: PropTypes.array,
    actions: PropTypes.array,
    created_at: PropTypes.string.isRequired,
    user: PropTypes.shape({
      status: PropTypes.string
    }),
    asset: PropTypes.shape({
      title: PropTypes.string,
      id: PropTypes.string
    })
  })
};

export default Comment;
