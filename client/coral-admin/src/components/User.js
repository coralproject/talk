import React from 'react';
import styles from './ModerationList.css';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations.json';

import {Icon} from 'react-mdl';
import ActionButton from './ActionButton';

// Render a single comment for the list
const User = props => {
  const {action, user} = props;
  let userStatus = user.status;

  // Do not display unless the user status is 'pending' or 'banned'.
  // This means that they have already been reviewed and approved.
  return (userStatus === 'PENDING' ||  userStatus === 'BANNED') &&
    <li tabIndex={props.index} className={`mdl-card mdl-shadow--2dp ${styles.listItem} ${props.isActive && !props.hideActive ? styles.activeItem : ''}`}>
      <div className={styles.itemHeader}>
        <div className={styles.author}>
          <span>{user.displayName}</span>
          </div>
        <div className={styles.sideActions}>
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
      <div className={styles.flagCount}>
        {`${action.count} ${action.action_type === 'flag_bio' ? lang.t('user.bio_flags') : lang.t('user.username_flags')}`}
      </div>
    </li>;
};

export default User;

const lang = new I18n(translations);
