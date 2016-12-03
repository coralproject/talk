import React from 'react';
import timeago from 'timeago.js';
import Linkify from 'react-linkify';

import styles from './CommentList.css';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations.json';

import {Icon} from 'react-mdl';
import {FabButton, Button} from 'coral-ui';
import BanUserDialog from './BanUserDialog';

const linkify = new Linkify();

// Render a single comment for the list
export default props => {
  const authorStatus = props.author.get('status');
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
            {comment.get('body')}
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
    const showBanUserDialog = false;
    return (
      // <Button
      //   {...props.author.get('status') === 'banned' ? 'disabled' : 'raised'}
      //   key={i}
      //   onClick={() => props.onClickAction(props.actionsMap[action].status, props.comment.get('id'), props.author.get('id'))}>{lang.t('comment.ban_user')}</Button>
      <div key={i}>
          <Button {...props.author.get('status') === 'banned' ? 'disabled' : 'raised'}
            cStyle="black"
            onClick={props.showBanUserDialog}
            key={i}
            {...props} >
            {lang.t('comment.ban_user')}
          </Button>
          <BanUserDialog
            open={showBanUserDialog}
            handleClose={props.hideBanUserDialog}
            authorName={props.author.get('displayName')}
          />
        </div>
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
