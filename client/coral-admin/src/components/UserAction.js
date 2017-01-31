import React from 'react';
import Linkify from 'react-linkify';

import styles from './ModerationList.css';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations.json';

import {Icon} from 'react-mdl';
import Highlighter from 'react-highlight-words';
import ActionButton from './ActionButton';

const linkify = new Linkify();

// Render a single comment for the list
const UserAction = props => {
  const {action, user} = props;
  let userStatus = user.status;
  const links = user.settings.bio ? linkify.getMatches(user.settings.bio) : [];

  // Do not display unless the user status is 'pending' or 'banned'.
  // This means that they have already been reviewed and approved.
  return (userStatus === 'PENDING' ||  userStatus === 'BANNED') &&
    <li tabIndex={props.index} className={`mdl-card mdl-shadow--2dp ${styles.listItem} ${props.isActive && !props.hideActive ? styles.activeItem : ''}`}>
      <div className={styles.itemHeader}>
        <div className={styles.author}>
          <span>{user.displayName}</span>
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
                type='USERS'
                user={user}
                menuOptionsMap={props.menuOptionsMap}
                onClickAction={props.onClickAction}
                onClickShowBanDialog={props.onClickShowBanDialog}/>
            )}
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
    </li>;
};

export default UserAction;

const linkStyles = {
  backgroundColor: 'rgb(255, 219, 135)',
  padding: '1px 2px'
};

const lang = new I18n(translations);
