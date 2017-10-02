import React from 'react';
import styles from './FlaggedUser.css';

// TODO: Should not rely on plugin.
import {username} from 'talk-plugin-flags/helpers/flagReasons';

import ActionsMenu from 'coral-admin/src/components/ActionsMenu';
import ActionsMenuItem from 'coral-admin/src/components/ActionsMenuItem';
import ApproveButton from 'coral-admin/src/components/ApproveButton';
import RejectButton from 'coral-admin/src/components/RejectButton';

import cn from 'classnames';
import t from 'coral-framework/services/i18n';

// TODO: Should work with custom flags too.
const shortReasons = {
  [username.other]: t('community.other'),
  [username.spam]: t('community.spam_ads'),
  [username.offensive]: t('community.offensive'),
  [username.nolike]: t('community.dont_like_username'),
  [username.impersonating]: t('community.impersonating'),
};

// Render a single user for the list
class User extends React.Component {

  showSuspenUserDialog = () => this.props.showSuspendUserDialog({
    userId: this.props.user.id,
    username: this.props.user.username,
  });

  showBanUserDialog = () => this.props.showBanUserDialog({
    userId: this.props.user.id,
    username: this.props.user.username,
  });

  viewAuthorDetail = () => this.props.viewUserDetail(this.props.user.id);
  showRejectUsernameDialog = () => this.props.showRejectUsernameDialog({id: this.props.user.id});
  approveUser = () => this.props.approveUser({
    userId: this.props.user.id,
  });

  render() {
    const {
      user,
      viewUserDetail,
      selected,
      me,
      className,
    } = this.props;

    return (
      <li
        tabIndex={0}
        className={cn(className, styles.root, {[styles.rootSelected]: selected})}
      >
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.author}>
              <button
                onClick={this.viewAuthorDetail}
                className={styles.button}>
                {user.username}
              </button>
              {me.id !== user.id &&
                <ActionsMenu icon="not_interested">
                  <ActionsMenuItem
                    disabled={user.status === 'BANNED'}
                    onClick={this.showSuspenUserDialog}>
                    Suspend User
                  </ActionsMenuItem>
                  <ActionsMenuItem
                    disabled={user.status === 'BANNED'}
                    onClick={this.showBanUserDialog}>
                    Ban User
                  </ActionsMenuItem>
                </ActionsMenu>
              }
            </div>
          </div>

          <div className={styles.body}>
            <div className={styles.flagged}>
              <div className={styles.flaggedByCount}>
                <i className={cn('material-icons', styles.flagIcon)}>flag</i>
                <span className={styles.flaggedByLabel}>
                  {t('community.flags')}({ user.actions.length })
                </span>:
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
                              {action.user &&
                                <button onClick={() => {viewUserDetail(action.user.id);}} className={styles.button}>
                                  {action.user.username}
                                </button>
                              }
                              : {action.message ? action.message : 'n/a'}
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
              <div className={styles.actions}>
                <ApproveButton
                  onClick={this.approveUser}
                />
                <RejectButton
                  onClick={this.showRejectUsernameDialog}
                />
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }
}

export default User;
