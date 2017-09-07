import React from 'react';
import cn from 'classnames';
import styles from './Tag.css';
import Tooltip from './Tooltip';
import {t} from 'plugin-api/beta/client/services';

export default class Tag extends React.Component {
  constructor() {
    super();

    this.state = {
      tooltip: false
    };

  }

  showTooltip = (e) => {
    e.preventDefault();
    this.setState({
      tooltip: true
    });
  }

  hideTooltip = (e) => {
    e.preventDefault();
    this.setState({
      tooltip: false
    });
  }

  render() {
    const {tooltip} = this.state;
    return(
      <span className={styles.noSelect} onMouseEnter={this.showTooltip}
        onMouseLeave={this.hideTooltip} onTouchStart={this.showTooltip}
        onTouchEnd={this.hideTooltip}>
        <span className={cn(styles.tag, styles.noSelect, {[styles.on]: tooltip})}>
          {t('talk-plugin-featured-comments.featured')}
        </span>
        {tooltip && <Tooltip className={styles.tooltip} />}
      </span>
    );
  }
}
