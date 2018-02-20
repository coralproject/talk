import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Icon } from 'coral-ui';
import styles from './UserInfoTooltip.css';
import ClickOutside from 'coral-framework/components/ClickOutside';
import moment from 'moment';

const initialState = { menuVisible: false };

class UserInfoTooltip extends React.Component {
  state = initialState;

  toogleMenu = () => {
    this.setState({ menuVisible: !this.state.menuVisible });
  };

  hideMenu = () => {
    this.setState({ menuVisible: false });
  };

  getLastHistoryItem = (user, status = 'banned') => {
    const userHistory = user.state.status[status].history;
    return userHistory[userHistory.length - 1];
  };

  render() {
    const { menuVisible } = this.state;
    const { user, banned, suspended } = this.props;

    return (
      <ClickOutside onClickOutside={this.hideMenu}>
        <div className={cn(styles.userInfo, 'talk-admin-user-info-tooltip')}>
          <span
            onClick={this.toogleMenu}
            className={cn(styles.icon, 'talk-admin-user-info-tooltip-icon')}
          >
            <Icon name="info_outline" />
          </span>

          {menuVisible && (
            <div
              className={cn(styles.menu, 'talk-admin-user-info-tooltip-menu')}
            >
              {banned && (
                <div
                  className={cn(
                    styles.description,
                    'talk-admin-user-info-tooltip-description-banned'
                  )}
                >
                  <ul
                    className={cn(
                      styles.descriptionList,
                      'talk-admin-user-info-tooltip-description-list'
                    )}
                  >
                    <li
                      className={cn(
                        styles.descriptionItem,
                        'talk-admin-user-info-tooltip-description-item'
                      )}
                    >
                      <strong className={styles.strongItem}>Banned On</strong>
                      <span>
                        {moment(
                          new Date(
                            this.getLastHistoryItem(user, 'banned').created_at
                          )
                        ).format('MMM Do YYYY, h:mm:ss a')}
                      </span>
                    </li>
                    <li
                      className={cn(
                        styles.descriptionItem,
                        'talk-admin-user-info-tooltip-description-item'
                      )}
                    >
                      <strong className={styles.strongItem}>By</strong>
                      <span>
                        {
                          this.getLastHistoryItem(user, 'banned').assigned_by
                            .username
                        }
                      </span>
                    </li>
                  </ul>
                </div>
              )}

              {suspended && (
                <div
                  className={cn(
                    styles.description,
                    'talk-admin-user-info-tooltip-description-suspended'
                  )}
                >
                  <ul
                    className={cn(
                      styles.descriptionList,
                      'talk-admin-user-info-tooltip-description-list'
                    )}
                  >
                    <li
                      className={cn(
                        styles.descriptionItem,
                        'talk-admin-user-info-tooltip-description-item'
                      )}
                    >
                      <strong className={styles.strongItem}>Suspension</strong>
                      <span />
                    </li>
                    <li
                      className={cn(
                        styles.descriptionItem,
                        'talk-admin-user-info-tooltip-description-item'
                      )}
                    >
                      <strong className={styles.strongItem}>By</strong>
                      <span>
                        {
                          this.getLastHistoryItem(user, 'suspension')
                            .assigned_by.username
                        }
                      </span>
                    </li>
                    <li
                      className={cn(
                        styles.descriptionItem,
                        'talk-admin-user-info-tooltip-description-item'
                      )}
                    >
                      <strong className={styles.strongItem}>Start</strong>
                      <span>
                        {moment(
                          new Date(
                            this.getLastHistoryItem(
                              user,
                              'suspension'
                            ).created_at
                          )
                        ).format('MMM Do YYYY, h:mm:ss a')}
                      </span>
                    </li>
                    <li
                      className={cn(
                        styles.descriptionItem,
                        'talk-admin-user-info-tooltip-description-item'
                      )}
                    >
                      <strong className={styles.strongItem}>End</strong>
                      <span>
                        {moment(
                          new Date(
                            this.getLastHistoryItem(user, 'suspension').until
                          )
                        ).format('MMM Do YYYY, h:mm:ss a')}
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </ClickOutside>
    );
  }
}

UserInfoTooltip.propTypes = {
  user: PropTypes.object,
  banned: PropTypes.bool,
  suspended: PropTypes.bool,
};

export default UserInfoTooltip;
