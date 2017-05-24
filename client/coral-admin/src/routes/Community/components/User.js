import React from 'react';
import styles from './Community.css';

import ActionButton from './ActionButton';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../../../translations.json';

const lang = new I18n(translations);

// Render a single user for the list
const User = (props) => {
  const {user, modActionButtons} = props;
  let userStatus = user.status;

  // Do not display unless the user status is 'pending' or 'banned'.
  // This means that they have already been reviewed and approved.
  return (userStatus === 'PENDING' ||  userStatus === 'BANNED') &&
    <li tabIndex={props.index} className={`mdl-card ${props.selected ? 'mdl-shadow--8dp' : 'mdl-shadow--2dp'} ${styles.listItem} ${props.isActive && !props.hideActive ? styles.activeItem : ''}`}>
      <div className={styles.container}>
        <div className={styles.itemHeader}>
          <div className={styles.author}>
            <span>
              {user.username}
            </span>
            <ActionButton
              className={styles.banButton}
              type='BAN'
              user={user}
              showBanUserDialog={props.showBanUserDialog}
            />
          </div>
        </div>

        <div className={styles.itemBody}>
          <div className={styles.body}>
            <div className={styles.flaggedByCount}>
              <i className="material-icons">flag</i><span className={styles.flaggedByLabel}>{lang.t('community.flags')}({ user.actions.length })</span>:
                { user.action_summaries.map(
                (action, i) => {
                  return <span className={styles.flaggedBy} key={i}>
                    {lang.t(`community.${action.reason}`)} ({action.count})
                  </span>;
                }
              )}
            </div>
            <div className={styles.flaggedReasons}>
              { user.action_summaries.map(
                (action_sum, i) => {
                  return <div key={i}>
                    <span className={styles.flaggedByLabel}>
                      {lang.t(`community.${action_sum.reason}`)} ({action_sum.count})
                    </span>
                    {user.actions.map(

                      // find the action by action_sum.reason
                      (action, j) => {
                        if (action.reason === action_sum.reason) {
                          return <p className={styles.flaggedByReason} key={j}>
                            {action.user && action.user.username}: {action.message ? action.message : 'n/a'}
                          </p>;
                        }
                        return null;
                      }
                    )}
                  </div>;
                }
              )}

            </div>
          </div>
          <div className={styles.sideActions}>
            <div className={`actions ${styles.actions}`}>
              {modActionButtons.map((action, i) =>
                <ActionButton key={i}
                              type={action.toUpperCase()}
                              user={user}
                              approveUser={props.approveUser}
                              suspendUser={props.suspendUser}
                              showSuspendUserDialog={props.showSuspendUserDialog}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </li>;
};

export default User;
