import React from 'react';
import styles from './Community.css';

import ActionButton from './ActionButton';
import ActionsMenu from 'coral-admin/src/components/ActionsMenu';
import ActionsMenuItem from 'coral-admin/src/components/ActionsMenuItem';

import t from 'coral-framework/services/i18n';

const shortReasons = {
  'This comment is offensive': t('community.offensive'),
  'This looks like an ad/marketing': t('community.spam_ads'),
  'This user is impersonating': t('community.impersonating'),
  'I don\'t like this username': t('community.dont_like_username'),
  'Other': t('community.other')
};

// Render a single user for the list
const User = (props) => {
  const {user, modActionButtons} = props;
  let userStatus = user.status;

  const showSuspenUserDialog = () => props.showSuspendUserDialog({
    userId: user.id,
    username: user.username,
  });

  const showBanUserDialog = () => props.showBanUserDialog({
    userId: user.id,
    username: user.username,
  });

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
            <ActionsMenu icon="not_interested">
              <ActionsMenuItem
                disabled={user.status === 'BANNED'}
                onClick={showSuspenUserDialog}>
                Suspend User</ActionsMenuItem>
              <ActionsMenuItem
                disabled={user.status === 'BANNED'}
                onClick={showBanUserDialog}>
                Ban User
              </ActionsMenuItem>
            </ActionsMenu>
          </div>
        </div>

        <div className={styles.itemBody}>
          <div className={styles.body}>
            <div className={styles.flaggedByCount}>
              <i className="material-icons">flag</i><span className={styles.flaggedByLabel}>{t('community.flags')}({ user.actions.length })</span>:
                { user.action_summaries.map(
                (action, i) => {
                  return <span className={styles.flaggedBy} key={i}>
                    {shortReasons[action.reason]} ({action.count})
                  </span>;
                }
              )}
            </div>
            <div className={styles.flaggedReasons}>
              { user.action_summaries.map(
                (action_sum, i) => {
                  return <div key={i}>
                    <span className={styles.flaggedByLabel}>
                      {shortReasons[action_sum.reason]} ({action_sum.count})
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
                  showRejectUsernameDialog={props.showRejectUsernameDialog}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </li>;
};

export default User;
