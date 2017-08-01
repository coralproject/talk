import React from 'react';
import cn from 'classnames';
import styles from './ModTag.css';
import {t} from 'plugin-api/beta/client/services';
import {isTagged} from 'plugin-api/beta/client/utils';

// import {isTagged} from 'plugin-api/beta/client/utils';
import {Icon} from 'plugin-api/beta/client/components/ui';

export default class ModTag extends React.Component {
  constructor() {
    super();

    this.state = {
      on: false
    };

  }

  handleMouseEnter = (e) => {
    e.preventDefault();
    this.setState({
      on: true
    });
  }

  handleMouseLeave = (e) => {
    e.preventDefault();
    this.setState({
      on: false
    });
  }
  
  render() {
    const isFeatured = isTagged(this.props.comment.tags, 'FEATURED');

    return isFeatured ? (
      <span className={cn(styles.tag, styles.featured)}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave }>
        <Icon name="star_outline" className={cn(styles.tagIcon)} />
        {!this.state.on ? t('talk-plugin-featured-comments.featured') : t('talk-plugin-featured-comments.un_feature')}  
      </span>
    ) : (
      <span className={cn(styles.tag, {[styles.featured]: isFeatured})}>
        <Icon name="star_outline" className={cn(styles.tagIcon)} />
        {isFeatured ? t('talk-plugin-featured-comments.featured') : t('talk-plugin-featured-comments.feature')} 
      </span>
    );
  }
}
