import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {Icon} from 'coral-ui';
import styles from './UserInfoTooltip.css';
import ClickOutside from 'coral-framework/components/ClickOutside';

const initialState = {menuVisible: false};

class UserInfoTooltip extends React.Component {
  state = initialState;

  toogleMenu = () => {
    this.setState({menuVisible: !this.state.menuVisible});
  }

  hideMenu = () => {
    this.setState({menuVisible: false});
  }

  render() {
    const {menuVisible} = this.state;
    const {banned, suspended} = this.props;

    return (
      <ClickOutside onClickOutside={this.hideMenu}>
        <div className={cn(styles.userInfo, 'talk-admin-user-info-tooltip')}>
          <span onClick={this.toogleMenu} className={cn(styles.icon, 'talk-admin-user-info-tooltip-icon')}>
            <Icon name="info_outline" />
          </span>

          {menuVisible && (
            <div className={cn(styles.menu, 'talk-admin-user-info-tooltip-menu')}>
              {
                banned && (
                  <div className={cn(styles.description, 'talk-admin-user-info-tooltip-description-banned')}>
                    <ul className={cn(styles.descriptionList, 'talk-admin-user-info-tooltip-description-list')}>
                      <li className={cn(styles.descriptionItem, 'talk-admin-user-info-tooltip-description-item')}>
                        <strong>Banned On</strong>
                        <span></span>
                      </li>
                      <li className={cn(styles.descriptionItem, 'talk-admin-user-info-tooltip-description-item')}>
                        <strong>By</strong>
                        <span></span>
                      </li>
                    </ul>
                  </div>
                )
              }

              {
                suspended && (
                  <div className={cn(styles.description, 'talk-admin-user-info-tooltip-description-suspended')}>
                    <ul className={cn(styles.descriptionList, 'talk-admin-user-info-tooltip-description-list')}>
                      <li className={cn(styles.descriptionItem, 'talk-admin-user-info-tooltip-description-item')}>
                        <strong>Suspension</strong>
                        <span></span>
                      </li>
                      <li className={cn(styles.descriptionItem, 'talk-admin-user-info-tooltip-description-item')}>
                        <strong>By</strong>
                        <span></span>
                      </li>
                      <li className={cn(styles.descriptionItem, 'talk-admin-user-info-tooltip-description-item')}>
                        <strong>Start</strong>
                        <span></span>
                      </li>
                      <li className={cn(styles.descriptionItem, 'talk-admin-user-info-tooltip-description-item')}>
                        <strong>End</strong>
                        <span></span>
                      </li>
                    </ul>
                  </div>
                )
              }
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
