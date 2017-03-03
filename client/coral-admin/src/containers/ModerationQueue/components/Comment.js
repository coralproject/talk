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

const linkify = new Linkify();

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-admin/src/translations.json';
const lang = new I18n(translations);

const Comment = ({actions = [], ...props}) => {
  const links = linkify.getMatches(props.comment.body);
  console.log('Links', links);
  const actionSummaries = props.comment.action_summaries;
  return (
    <li tabIndex={props.index}
        className={`mdl-card mdl-shadow--2dp ${styles.Comment} ${styles.listItem} ${props.isActive && !props.hideActive ? styles.activeItem : ''}`}>
      <div className={styles.container}>
        <div className={styles.itemHeader}>
        <div className={styles.author}>
          <span>{props.comment.user.name}</span>
          <span className={styles.created}>
              {timeago().format(props.comment.created_at || (Date.now() - props.index * 60 * 1000), lang.getLocale().replace('-', '_'))}
            </span>
          <BanUserButton user={props.comment.user} onClick={() => props.showBanUserDialog(props.comment.user, props.comment.id)} />
          <CommentType type={props.commentType} />
        </div>
        <div className={styles.sideActions}>
          {links ? <span className={styles.hasLinks}><Icon name='error_outline'/> Contains Link</span> : null}
          <div className={`actions ${styles.actions}`}>
            {actions.map((action, i) =>
              <ActionButton key={i}
                            type={action}
                            user={props.comment.user}
                            acceptComment={() => props.acceptComment({commentId: props.comment.id})}
                            rejectComment={() => props.rejectComment({commentId: props.comment.id})}
              />
            )}
          </div>
          {props.comment.user.status === 'banned' ?
            <span className={styles.banned}>
                <Icon name='error_outline'/>
              {lang.t('comment.banned_user')}
              </span>
            : null}
        </div>
      </div>
        {!props.currentAsset && (
          <div className={styles.moderateArticle}>
            Story: {props.comment.asset.title} <Link to={`/admin/moderate/${props.comment.asset.id}`}>Moderate &rarr;</Link>
          </div>
        )}
        <div className={styles.itemBody}>
          <p className={styles.body}>
            <Linkify component='span' properties={{style: linkStyles}}>
              <Highlighter searchWords={props.suspectWords} textToHighlight={props.comment.body}/>
            </Linkify>
          </p>
        </div>
      </div>
      {actionSummaries && <FlagBox actionSummaries={actionSummaries} />}
    </li>
  );
};

Comment.propTypes = {
  acceptComment: PropTypes.func.isRequired,
  rejectComment: PropTypes.func.isRequired,
  suspectWords: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentAsset: PropTypes.object,
  comment: PropTypes.shape({
    body: PropTypes.string.isRequired,
    action_summaries: PropTypes.array,
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

const linkStyles = {
  backgroundColor: 'rgb(255, 219, 135)',
  padding: '1px 2px'
};

export default Comment;
