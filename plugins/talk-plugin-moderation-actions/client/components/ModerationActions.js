import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Menu from './Menu';
import styles from './ModerationActions.css';
import { Icon } from 'plugin-api/beta/client/components/ui';
import ClickOutside from 'coral-framework/components/ClickOutside';
import RejectCommentAction from '../containers/RejectCommentAction';
import ApproveCommentAction from '../containers/ApproveCommentAction';
import BanUserAction from '../containers/BanUserAction';
import { Slot } from 'plugin-api/beta/client/components';

export default class ModerationActions extends React.Component {
  render() {
    const {
      comment,
      root,
      asset,
      menuVisible,
      toogleMenu,
      hideMenu,
    } = this.props;

    const slotPassthrough = {
      comment,
      asset,
    };

    return (
      <ClickOutside onClickOutside={hideMenu}>
        <div
          className={cn(
            styles.moderationActions,
            'talk-plugin-moderation-actions'
          )}
        >
          <span
            onClick={toogleMenu}
            className={cn(styles.arrow, 'talk-plugin-moderation-actions-arrow')}
          >
            {menuVisible ? (
              <Icon name="keyboard_arrow_up" className={styles.icon} />
            ) : (
              <Icon name="keyboard_arrow_down" className={styles.icon} />
            )}
          </span>
          {menuVisible && (
            <Menu className="talk-plugin-moderation-actions-menu">
              <Slot
                className="talk-plugin-moderation-actions-slot"
                fill="moderationActions"
                passthrough={slotPassthrough}
              />
              <ApproveCommentAction comment={comment} hideMenu={hideMenu} />
              <RejectCommentAction comment={comment} hideMenu={hideMenu} />
              <BanUserAction
                comment={comment}
                root={root}
                hideMenu={hideMenu}
              />
            </Menu>
          )}
        </div>
      </ClickOutside>
    );
  }
}

ModerationActions.propTypes = {
  comment: PropTypes.object,
  root: PropTypes.object,
  asset: PropTypes.object,
  menuVisible: PropTypes.bool,
  toogleMenu: PropTypes.func,
  hideMenu: PropTypes.func,
};
