
import React from 'react';
import {Button, Icon} from 'react-mdl';
import timeago from 'timeago.js';
import styles from './CommentList.css';
import I18n from 'coral-framework/i18n/i18n';
import translations from '../translations';

// Render a single comment for the list
export default props => (
  <li tabindex={props.index} className={`${styles.listItem} ${props.isActive && !props.hideActive ? styles.activeItem : ''}`}>
    <div className={styles.itemHeader}>
      <div className={styles.author}>
        <i className={`material-icons ${styles.avatar}`}>person</i>
        <span>{props.comment.get('name') || lang.t('comment.anon')}</span>
        <span className={styles.created}>{timeago().format(props.comment.get('createdAt') || (Date.now() - props.index * 60 * 1000), lang.getLocale().replace('-', '_'))}</span>
        {props.comment.get('flagged') ? <p className={styles.flagged}>{lang.t('comment.flagged')}</p> : null}
      </div>
      <div className={styles.actions}>
        {props.actions.map(action => canShowAction(action, props.comment) ? (
          <Button className={styles.actionButton}
            onClick={() => props.onClickAction(props.actionsMap[action].status, props.comment.get('_id'))}
            fab colored>
            <Icon name={props.actionsMap[action].icon} />
          </Button>
        ) : null)}
      </div>
    </div>
    <div className={styles.itemBody}>
      <span className={styles.body}>{props.comment.get('body')}</span>
    </div>
  </li>
);

// Check if an action can be performed over a comment
const canShowAction = (action, comment) => {
  const status = comment.get('status');
  const flagged = comment.get('flagged');

  if (action === 'flag' && (status || flagged === true)) {
    return false;
  }
  return true;
};

const lang = new I18n(translations);
