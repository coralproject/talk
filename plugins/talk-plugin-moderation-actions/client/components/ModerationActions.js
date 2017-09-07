import React from 'react';
import cn from 'classnames';
import styles from './ModerationActions.css';
import Tooltip from './Tooltip';
import {t} from 'plugin-api/beta/client/services';
import {Icon} from 'plugin-api/beta/client/components/ui';
import RejectCommentAction from '../containers/RejectCommentAction';
import ClickOutside from 'coral-framework/components/ClickOutside';

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
            {tooltip ? <Icon name="keyboard_arrow_up" className={styles.icon} /> : <Icon name="keyboard_arrow_down" className={styles.icon} />}
          </span>
          {tooltip && (
            <Tooltip>
              <RejectCommentAction comment={comment} />
            </Tooltip>
          )}
        </div>
      </ClickOutside>
    );
  }
}
