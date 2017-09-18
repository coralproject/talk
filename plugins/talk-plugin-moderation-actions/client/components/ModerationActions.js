import React from 'react';
import cn from 'classnames';
import Menu from './Menu';
import styles from './ModerationActions.css';
import {Icon} from 'plugin-api/beta/client/components/ui';
import ClickOutside from 'coral-framework/components/ClickOutside';
import RejectCommentAction from '../containers/RejectCommentAction';
import ApproveCommentAction from '../containers/ApproveCommentAction';
import BanUserAction from '../containers/BanUserAction';
import {Slot} from 'plugin-api/beta/client/components';

export default class ModerationActions extends React.Component {
  render() {
    const {comment, root, asset, data, menuVisible, toogleMenu, hideMenu} = this.props;

    return(
      <ClickOutside onClickOutside={hideMenu}>
        <div className={cn(styles.moderationActions, 'talk-plugin-moderation-actions')}>
          <span onClick={toogleMenu} className={cn(styles.arrow, 'talk-plugin-moderation-actions-arrow')}>
            {menuVisible ? <Icon name="keyboard_arrow_up" className={styles.icon} /> : 
              <Icon name="keyboard_arrow_down" className={styles.icon} />}
          </span>
          {menuVisible && (
            <Menu>
              <Slot
                className="talk-plugin-modetarion-actions-slot"
                fill="moderationActions"
                queryData={{comment, asset}}
                data={data}
              />
              <ApproveCommentAction comment={comment} hideMenu={hideMenu} />
              <RejectCommentAction comment={comment} hideMenu={hideMenu} />
              <BanUserAction comment={comment} root={root} hideMenu={hideMenu} />
            </Menu>
          )}
        </div>
      </ClickOutside>
    );
  }
}
