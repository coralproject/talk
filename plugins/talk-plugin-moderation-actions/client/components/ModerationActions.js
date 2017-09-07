import React from 'react';
import cn from 'classnames';
import styles from './ModerationActions.css';
import Tooltip from './Tooltip';
import {t} from 'plugin-api/beta/client/services';
import {Icon} from 'plugin-api/beta/client/components/ui';
import RejectCommentAction from '../containers/RejectCommentAction.js';
import ClickOutside from 'coral-framework/components/ClickOutside';

export default class Tag extends React.Component {
  constructor() {
    super();

    this.state = {
      tooltip: false
    };

  }

  toggleTooltip = (e) => {
    e.preventDefault();
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
    return(
      <ClickOutside onClickOutside={this.hideTooltip}>
        <div className={styles.moderationActions}>

          <span className={cn(styles.arrow, 'talk-plugin-moderation-action-arrow')} onClick={this.toggleTooltip}> 
            {tooltip ? <Icon name="keyboard_arrow_up" /> : <Icon name="keyboard_arrow_down" />}
          </span>

          {tooltip && (
            <Tooltip className={styles.tooltip}>
              <RejectCommentAction />
            </Tooltip>
          )}
        </div>
      </ClickOutside>
    );
  }
}
