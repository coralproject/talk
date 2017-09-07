import React from 'react';
import cn from 'classnames';
import Tooltip from './Tooltip';
import styles from './ModerationActions.css';
import {t} from 'plugin-api/beta/client/services';
import {Icon} from 'plugin-api/beta/client/components/ui';
import ClickOutside from 'coral-framework/components/ClickOutside';
import RejectCommentAction from '../containers/RejectCommentAction';
import ApproveCommentAction from '../containers/ApproveCommentAction';

export default class ModerationActions extends React.Component {
  constructor() {
    super();

    this.state = {
      tooltip: false
    };
  }

  toogleTooltip = (e) => {
    const {tooltip} = this.state;
    this.setState({
      tooltip: !tooltip
    });
  }

  hideTooltip = () => {
    this.setState({
      tooltip: false
    });
  }

  render() {
    const {tooltip} = this.state;
    const {comment} = this.props;

    return(
      <ClickOutside onClickOutside={this.hideTooltip}>
        <div className={cn(styles.moderationActions, 'talk-plugin-moderation-actions')}>
          <span onClick={this.toogleTooltip} className={cn(styles.arrow, 'talk-plugin-moderation-actions-arrow')}>
            {tooltip ? <Icon name="keyboard_arrow_up" className={styles.icon} /> : 
              <Icon name="keyboard_arrow_down" className={styles.icon} />}
          </span>
          {tooltip && (
            <Tooltip>
              <ApproveCommentAction comment={comment} />
              <RejectCommentAction comment={comment} />
            </Tooltip>
          )}
        </div>
      </ClickOutside>
    );
  }
}
