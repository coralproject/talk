import React from 'react';
import cn from 'classnames';
import Tooltip from './Tooltip';
import styles from './ModerationActions.css';
import {Icon} from 'plugin-api/beta/client/components/ui';
import ClickOutside from 'coral-framework/components/ClickOutside';
import RejectCommentAction from '../containers/RejectCommentAction';
import ApproveCommentAction from '../containers/ApproveCommentAction';
import {Slot} from 'plugin-api/beta/client/components';

export default class ModerationActions extends React.Component {

  render() {
    const {comment, asset, data, tooltipVisible, toogleTooltip, hideTooltip} = this.props;

    return(
      <ClickOutside onClickOutside={hideTooltip}>
        <div className={cn(styles.moderationActions, 'talk-plugin-moderation-actions')}>
          <span onClick={toogleTooltip} className={cn(styles.arrow, 'talk-plugin-moderation-actions-arrow')}>
            {tooltipVisible ? <Icon name="keyboard_arrow_up" className={styles.icon} /> : 
              <Icon name="keyboard_arrow_down" className={styles.icon} />}
          </span>

          {tooltipVisible && (
            <Tooltip>

              <Slot
                className="talk-plugin-modetarion-actions-slot"
                fill="moderationActions"
                queryData={{comment, asset}}
                data={data}
              />

              <ApproveCommentAction comment={comment} hideTooltip={hideTooltip} />
              <RejectCommentAction comment={comment} hideTooltip={hideTooltip} />
            </Tooltip>
          )}
        </div>
      </ClickOutside>
    );
  }
}
