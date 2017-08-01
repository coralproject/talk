import React from 'react';
import cn from 'classnames';
import styles from './ModTag.css';
import {t} from 'plugin-api/beta/client/services';
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
    const {alreadyTagged, deleteTag, postTag} = this.props;

    return alreadyTagged ? (
      <span className={cn(styles.tag, styles.featured)}
            onClick={deleteTag}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave} >
        <Icon name="star_outline" className={cn(styles.tagIcon)} />
        {!this.state.on ? t('talk-plugin-featured-comments.featured') : t('talk-plugin-featured-comments.un_feature')}  
      </span>
    ) : (
      <span className={cn(styles.tag, {[styles.featured]: alreadyTagged})}
            onClick={postTag} >
        <Icon name="star_outline" className={cn(styles.tagIcon)} />
        {alreadyTagged ? t('talk-plugin-featured-comments.featured') : t('talk-plugin-featured-comments.feature')} 
      </span>
    );
  }
}
