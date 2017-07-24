import React from 'react';
import cn from 'classnames';
import styles from './Tag.css';
import Tooltip from './Tooltip';
import {t} from 'plugin-api/beta/client/services';
import {isTagged} from 'plugin-api/beta/client/utils';

export default class Tag extends React.Component {
  constructor() {
    super();

    this.state = {
      tooltip: false
    };

  }

  showTooltip = () => {
    this.setState({
      tooltip: true
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
      <div onMouseEnter={this.showTooltip} onMouseLeave={this.hideTooltip} >
          {
            isTagged(this.props.comment.tags, 'FEATURED') ? (
              <span className={cn(styles.tag, {[styles.on]: tooltip})}>
                {t('talk-plugin-featured-comments.featured')}
              </span>
            ) : null
          }
        {tooltip && <Tooltip className={styles.tooltip} />}
      </div>
    );
  }
}
