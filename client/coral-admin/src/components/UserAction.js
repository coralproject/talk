import React from 'react';
import Linkify from 'react-linkify';

import styles from './ModerationList.css';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations.json';

import {Icon} from 'react-mdl';
import Highlighter from 'react-highlight-words';
import {FabButton, Button} from 'coral-ui';

const linkify = new Linkify();

// Render a single comment for the list
const UserAction = props => {
  const {action, user} = props;
  let userStatus = user.status;
  const links = user.settings.bio ? linkify.getMatches(user.settings.bio) : [];

  return (
    <li tabIndex={props.index} className={`${styles.listItem} ${props.isActive && !props.hideActive ? styles.activeItem : ''}`}>
      <div className={styles.itemHeader}>
        <div className={styles.author}>
          <i className={`material-icons ${styles.avatar}`}>person</i>
          <span>{user.displayName}</span>
          </div>
        <div>
          {links ?
          <span className={styles.hasLinks}><Icon name='error_outline'/> Contains Link</span> : null}
          <div className={`actions ${styles.actions}`}>
            {props.modActions.map((action, i) => getActionButton(action, i, props))}
          </div>
        </div>
        <div>
          {userStatus === 'banned' ?
          <span className={styles.banned}><Icon name='error_outline'/> {lang.t('comment.banned_user')}</span> : null}
        </div>
      </div>
      {
        user.settings.bio &&
        <div>
          <div className={styles.itemBody}>
            <div>{lang.t('user.user_bio')}:</div>
            <span className={styles.body}>
              <Linkify  component='span' properties={{style: linkStyles}}>
                <Highlighter
                  searchWords={props.suspectWords}
                  textToHighlight={user.settings.bio} />
              </Linkify>
            </span>
          </div>
        </div>
      }
      <div className={styles.flagCount}>
        {`${action.count} ${action.action_type === 'flag_bio' ? lang.t('user.bio_flags') : lang.t('user.username_flags')}`}
      </div>
    </li>
  );
};

export default UserAction;

// Get the button of the action performed over a comment if any
const getActionButton = (action, i, props) => {
  const {user} = props;
  const status = user.status;
  const banned = (user.status === 'banned');

  if (action === 'flag' && status) {
    return null;
  }
  if (action === 'ban') {
    return (
      <Button
        className='ban'
        cStyle='black'
        disabled={banned ? 'disabled' : ''}
        onClick={() => props.onClickShowBanDialog(user.id, user.displayName)}
        key={i}
      >
        {lang.t('comment.ban_user')}
      </Button>
    );
  }
  return (
    <FabButton
      className={`${action} ${styles.actionButton}`}
      cStyle={action}
      icon={props.actionsMap[action].icon}
      key={i}
      onClick={() => props.onClickAction(props.actionsMap[action].status, user.id)}
    />
  );
};

const linkStyles = {
  backgroundColor: 'rgb(255, 219, 135)',
  padding: '1px 2px'
};

const lang = new I18n(translations);
