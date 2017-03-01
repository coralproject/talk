import React from 'react';
import styles from '../UserModerationList.css';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../../../translations.json';

const lang = new I18n(translations);

// import {Icon} from 'react-mdl';
// import ActionButton from './ActionButton';

// Render a single user for the list
const User = props => {
  const {user} = props;
  let userStatus = user.status;

  // Do not display unless the user status is 'pending' or 'banned'.
  // This means that they have already been reviewed and approved.
  return (userStatus === 'PENDING' ||  userStatus === 'BANNED') &&
    <li tabIndex={props.index} className={`mdl-card mdl-shadow--2dp ${styles.listItem} ${props.isActive && !props.hideActive ? styles.activeItem : ''}`}>
      <div className={styles.itemHeader}>
        <div className={styles.author}>
          <span>{user.username}</span>
        </div>
      </div>
      <div className={styles.itemBody}>
        <div className={styles.flaggedByCount}>
          <i className="material-icons">flag</i><span className={styles.flaggedByLabel}>Flags({ user.actions.length })</span>:
            { user.action_summaries.map(
            (action, i ) => {
              return <span className={styles.flaggedBy} key={i}>
                {lang.t(`community.${action.reason}`)} ({action.count})
              </span>;
            }
          )}
        </div>
        <div className={styles.flaggedReasons}>
          {user.actions.map(
            (action, i) => {
              return <span key={i}>
                {action.reason}
                {/* action.user.username */}
              </span>;
            }
          )}
        </div>
        <div className={styles.sideActions}>
          <div className={`actions ${styles.actions}`}>
            {/* props.modActions.map(
              (action, i) =>
              return <ActionButton
                type={action.toUpperCase()}
                key={i}
                user={user}
                menuOptionsMap={props.menuOptionsMap}
                onClickAction={props.onClickAction}
                onClickShowBanDialog={props.onClickShowBanDialog}/>
            )*/}
          </div>
        </div>
      </div>
    </li>;
};

export default User;
