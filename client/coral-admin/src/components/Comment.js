import React from 'react';
import timeago from 'timeago.js';
import Linkify from 'react-linkify';

import styles from './CommentList.css';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations.json';

import {Icon} from 'react-mdl';
import {FabButton, Button} from 'coral-ui';

const linkify = new Linkify();

// Render a single comment for the list
export default props => {
  const {comment, author} = props;
  let authorStatus = author.status;
  const links = linkify.getMatches(comment.body);

  return (
    <li tabIndex={props.index} className={`${styles.listItem} ${props.isActive && !props.hideActive ? styles.activeItem : ''}`}>
      <div className={styles.itemHeader}>
        <div className={styles.author}>
          <i className={`material-icons ${styles.avatar}`}>person</i>
          <span>{author.displayName || lang.t('comment.anon')}</span>
          <span className={styles.created}>{timeago().format(comment.createdAt || (Date.now() - props.index * 60 * 1000), lang.getLocale().replace('-', '_'))}</span>
          {comment.flagged ? <p className={styles.flagged}>{lang.t('comment.flagged')}</p> : null}
        </div>
        <div>
          {links ?
          <span className={styles.hasLinks}><Icon name='error_outline'/> Contains Link</span> : null}
          <div className={styles.actions}>
            {props.actions.map((action, i) => getActionButton(action, i, props))}
          </div>
        </div>
        <div>
          {authorStatus === 'banned' ?
          <span className={styles.banned}><Icon name='error_outline'/> {lang.t('comment.banned_user')}</span> : null}
        </div>
      </div>
      <div className={styles.itemBody}>
        <span className={styles.body}>
          <Linkify  component='span' properties={{style: linkStyles}}>
            {comment.body}
          </Linkify>
        </span>
      </div>
    </li>
  );
};

// Get the button of the action performed over a comment if any
const getActionButton = (action, i, props) => {
  const {comment, author} = props;
  const status = comment.status;
  const flagged = comment.flagged;
  const banned = (author.status === 'banned');

  if (action === 'flag' && (status || flagged === true)) {
    return null;
  }
  if (action === 'ban') {
    return (
      <Button
        disabled={banned ? 'disabled' : ''}
        cStyle='black'
        onClick={() => props.onClickShowBanDialog(author.id, author.displayName, comment.id)}
        key={i} >
        {lang.t('comment.ban_user')}
      </Button>
    );
  }
  return (
    <FabButton
      className={styles.actionButton}
      icon={props.actionsMap[action].icon}
      cStyle={action}
      key={i}
      onClick={() => props.onClickAction(props.actionsMap[action].status, comment.id)}
    />
  );
};

const linkStyles = {
  backgroundColor: 'rgb(255, 219, 135)',
  padding: '1px 2px'
};

const lang = new I18n(translations);
