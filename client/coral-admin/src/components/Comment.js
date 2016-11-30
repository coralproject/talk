
import React from 'react';
import timeago from 'timeago.js';
import styles from './CommentList.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations.json';
import Linkify from 'react-linkify';
import {Icon} from 'react-mdl';
import {FabButton, Button} from 'coral-ui';

const linkify = new Linkify();

// Render a single comment for the list
export default props => {
  const links = linkify.getMatches(props.comment.get('body'));
  const banned = props.comment.get('banned');

  return (
    <li tabIndex={props.index} className={`${styles.listItem} ${props.isActive && !props.hideActive ? styles.activeItem : ''}`}>
      <div className={styles.itemHeader}>
        <div className={styles.author}>
          <i className={`material-icons ${styles.avatar}`}>person</i>
          <span>{props.comment.get('name') || lang.t('comment.anon')}</span>
          <span className={styles.created}>{timeago().format(props.comment.get('createdAt') || (Date.now() - props.index * 60 * 1000), lang.getLocale().replace('-', '_'))}</span>
          {props.comment.get('flagged') ? <p className={styles.flagged}>{lang.t('comment.flagged')}</p> : null}
        </div>
        <div>
          {links ?
          <span className={styles.hasLinks}><Icon name='error_outline'/> Contains Link</span> : null}
          <div className={styles.actions}>
            {props.actions.map((action, i) => getActionButton(action, i, props))}
          </div>
        </div>
        <div>
          {banned ?
          <span className={styles.banned}><Icon name='error_outline'/> Banned User</span> : null}
        </div>
      </div>
      <div className={styles.itemBody}>
        <span className={styles.body}>
          <Linkify  component='span' properties={{style: linkStyles}}>
            {props.comment.get('body')}
          </Linkify>
        </span>
      </div>
    </li>
  );
};

// Get the button of the action performed over a comment if any
const getActionButton = (action, i, props) => {
  const status = props.comment.get('status');
  const flagged = props.comment.get('flagged');

  if (action === 'flag' && (status || flagged === true)) {
    return null;
  }
  if (action === 'ban') {
    return (
      <Button
        cStyle='darkGrey'
        onClick={() => props.onClickAction(props.actionsMap[action].status, props.comment.get('id'))}>{lang.t('comment.ban_user')}</Button>
    );
  }
  return (
    <FabButton icon={props.actionsMap[action].icon} className={styles.actionButton}
      cStyle={action}
      key={i}
      onClick={() => props.onClickAction(props.actionsMap[action].status, props.comment.get('id'))}
    />
  );
};

const linkStyles = {
  backgroundColor: 'rgb(255, 219, 135)',
  padding: '1px 2px'
};

const lang = new I18n(translations);
