import React from 'react';
import cn from 'classnames';
import styles from './Tag.css';
import Tooltip from './Tooltip';
import {t} from 'plugin-api/beta/client/services';
import {isTagged} from 'plugin-api/beta/client/utils';
import bowser from 'bowser';

export default class Tag extends React.Component {
  constructor() {
    super();

    this.state = {
      tooltip: false
    };

  }

  componentDidMount() {
    if (bowser.mobile) {
      this.tagEl.addEventListener('touchstart', this.showTooltip);
      this.tagEl.addEventListener('touchend', this.hideTooltip);
    }
  }

  componentWillUnmount() {
    if (bowser.mobile) {
      this.tagEl.removeEventListener('touchstart', this.showTooltip);
      this.tagEl.removeEventListener('touchend', this.hideTooltip);
    }
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
      <div ref={(ref) => this.tagEl = ref} 
          onMouseEnter={this.showTooltip}
          onMouseLeave={this.hideTooltip}
          className={styles.noSelect }>
          {
            isTagged(this.props.comment.tags, 'FEATURED') ? (
              <span 
                className={cn(styles.tag, styles.noSelect, {[styles.on]: tooltip})}>
                {t('talk-plugin-featured-comments.featured')}
              </span>
            ) : null
          }
        {tooltip && <Tooltip className={styles.tooltip} />}
      </div>
    );
  }
}
