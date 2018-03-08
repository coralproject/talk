import React from 'react';
import styles from './FlaggedUser.css';
import PropTypes from 'prop-types';
import cn from 'classnames';
import t from 'coral-framework/services/i18n';
import { username } from 'coral-framework/graphql/flagReasons';
import ApproveButton from 'coral-admin/src/components/ApproveButton';
import RejectButton from 'coral-admin/src/components/RejectButton';
import { isFlaggedUserDangling } from '../utils';

const shortReasons = {
  [username.other]: t('community.other'),
  [username.spam]: t('community.spam_ads'),
  [username.offensive]: t('community.offensive'),
  [username.nolike]: t('community.dont_like_username'),
  [username.impersonating]: t('community.impersonating'),
};

class User extends React.Component {
  viewAuthorDetail = () => this.props.viewUserDetail(this.props.user.id);

  showRejectUsernameDialog = () =>
    this.props.showRejectUsernameDialog({ id: this.props.user.id });

  approveUser = () =>
    this.props.approveUser({
      userId: this.props.user.id,
    });

  render() {
    const { user, viewUserDetail, selected, className } = this.props;
    const dangling = isFlaggedUserDangling(user);

    return (
      <li
        tabIndex={0}
        className={cn(className, styles.root, {
          [styles.rootSelected]: selected,
          [styles.dangling]: dangling,
        })}
      >
        <div
          className={cn('talk-admin-community-flagged-user', styles.container)}
        >
          <div
            className={cn(
              'talk-admin-community-flagged-user-header',
              styles.header
            )}
          >
            <div className={styles.author}>
              <button onClick={this.viewAuthorDetail} className={styles.button}>
                {user.username}
              </button>
            </div>
          </div>
          <div
            className={cn(
              'talk-admin-community-flagged-user-body',
              styles.body
            )}
          >
            <div className={styles.flagged}>
              <div className={styles.flaggedByCount}>
                <i className={cn('material-icons', styles.flagIcon)}>flag</i>
                <span className={styles.flaggedByLabel}>
                  {t('community.flags')}({user.actions.length})
                </span>:
                {user.action_summaries.map((action, i) => {
                  return (
                    <span className={styles.flaggedBy} key={i}>
                      {shortReasons[action.reason]} ({action.count})
                    </span>
                  );
                })}
              </div>
              <div className={styles.flaggedReasons}>
                {user.action_summaries.map((action_sum, i) => {
                  return (
                    <div key={i}>
                      <span className={styles.flaggedByLabel}>
                        {shortReasons[action_sum.reason]} ({action_sum.count})
                      </span>
                      {user.actions.map(
                        // find the action by action_sum.reason
                        (action, j) => {
                          if (action.reason === action_sum.reason) {
                            return (
                              <p className={styles.flaggedByReason} key={j}>
                                {action.user && (
                                  <button
                                    onClick={() => {
                                      viewUserDetail(action.user.id);
                                    }}
                                    className={styles.button}
                                  >
                                    {action.user.username}
                                  </button>
                                )}
                                : {action.message ? action.message : 'n/a'}
                              </p>
                            );
                          }
                          return null;
                        }
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={styles.sideActions}>
              <div className={styles.actions}>
                <ApproveButton
                  className="talk-admin-flagged-user-approve-button"
                  active={user.state.status.username.status === 'APPROVED'}
                  onClick={this.approveUser}
                  disabled={dangling}
                />
                <RejectButton
                  className="talk-admin-flagged-user-reject-button"
                  active={user.state.status.username.status === 'REJECTED'}
                  onClick={this.showRejectUsernameDialog}
                  disabled={dangling}
                />
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }
}

User.propTypes = {
  viewUserDetail: PropTypes.func,
  showRejectUsernameDialog: PropTypes.func,
  approveUser: PropTypes.func,
  user: PropTypes.object,
  className: PropTypes.string,
  selected: PropTypes.bool,
  me: PropTypes.object,
};

export default User;
