
import React from 'react';
import timeago from 'timeago.js';
import styles from './CommentList.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations.json';
import Linkify from 'react-linkify';
import {FabButton} from 'coral-ui';
import {Icon} from 'react-mdl';

const linkify = new Linkify();

// Render a single comment for the list
export default props => {
  const {comment, author} = props;
  const links = linkify.getMatches(comment.get('body'));

  return (
    <li tabIndex={props.index} className={`${styles.listItem} ${props.isActive && !props.hideActive ? styles.activeItem : ''}`}>
      <div className={styles.itemHeader}>
        <div className={styles.author}>
          <i className={`material-icons ${styles.avatar}`}>person</i>
          <span>{author.get('displayName') || lang.t('comment.anon')}</span>
          <span className={styles.created}>{timeago().format(comment.get('createdAt') || (Date.now() - props.index * 60 * 1000), lang.getLocale().replace('-', '_'))}</span>
          {comment.get('flagged') ? <p className={styles.flagged}>{lang.t('comment.flagged')}</p> : null}
        </div>
        <div>
          {links ?
          <span className={styles.hasLinks}><Icon name='error_outline'/> Contains Link</span> : null}
          <div className={styles.actions}>
            {props.actions.map((action, i) => canShowAction(action, comment) ? (
              <FabButton icon={props.actionsMap[action].icon} className={styles.actionButton}
                cStyle={action}
                key={i}
                onClick={() => props.onClickAction(props.actionsMap[action].status, comment.get('id'))}
              />
            ) : null)}
          </div>
        </div>
      </div>
      <div className={styles.itemBody}>
        <span className={styles.body}>
          <Linkify  component='span' properties={{style: linkStyles}}>
            {comment.get('body')}
          </Linkify>
        </span>
      </div>
    </li>
  );
};

// Check if an action can be performed over a comment
const canShowAction = (action, comment) => {
  const status = comment.get('status');
  const flagged = comment.get('flagged');

  if (action === 'flag' && (status || flagged === true)) {
    return false;
  }
  return true;
};

const linkStyles = {
  backgroundColor: 'rgb(255, 219, 135)',
  padding: '1px 2px'
};

const lang = new I18n(translations);
