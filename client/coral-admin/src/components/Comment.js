import React from 'react';
import timeago from 'timeago.js';
import Linkify from 'react-linkify';

import styles from './ModerationList.css';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations.json';

import Highlighter from 'react-highlight-words';
import {Icon} from 'coral-ui';
import ActionButton from './ActionButton';

const linkify = new Linkify();

// Render a single comment for the list
const Comment = props => {
  const {comment, author} = props;
  let authorStatus = author.status;
  const links = linkify.getMatches(comment.body);

  return (
    <li tabIndex={props.index} className={`mdl-card mdl-shadow--2dp ${styles.listItem} ${props.isActive && !props.hideActive ? styles.activeItem : ''}`}>
      <div className={styles.itemHeader}>
        <div className={styles.author}>
          <span>{author.username || lang.t('comment.anon')}</span>
          <span className={styles.created}>{timeago().format(comment.createdAt || (Date.now() - props.index * 60 * 1000), lang.getLocale().replace('-', '_'))}</span>
          {comment.flagged ? <p className={styles.flagged}>{lang.t('comment.flagged')}</p> : null}
        </div>
        <div className={styles.sideActions}>
          {links ?
          <span className={styles.hasLinks}><Icon name='error_outline'/> Contains Link</span> : null}
          <div className={`actions ${styles.actions}`}>
            {props.modActions.map(
              (action, i) =>
              <ActionButton
                option={action}
                key={i}
                type='COMMENTS'
                comment={comment}
                user={author}
                menuOptionsMap={props.menuOptionsMap}
                onClickAction={props.onClickAction}
                onClickShowBanDialog={props.onClickShowBanDialog}/>
            )}
          </div>
          {authorStatus === 'banned' ?
          <span className={styles.banned}><Icon name='error_outline'/> {lang.t('comment.banned_user')}</span> : null}
        </div>
      </div>
      <div className={styles.itemBody}>
        <span className={styles.body}>
          <Linkify  component='span' properties={{style: linkStyles}}>
            <Highlighter
              searchWords={props.suspectWords}
              textToHighlight={comment.body} />
          </Linkify>
        </span>
      </div>
    </li>
  );
};

export default Comment;

const linkStyles = {
  backgroundColor: 'rgb(255, 219, 135)',
  padding: '1px 2px'
};

const lang = new I18n(translations);
