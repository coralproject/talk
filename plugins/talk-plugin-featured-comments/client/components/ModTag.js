import React from 'react';
import cn from 'classnames';
import styles from './ModTag.css';
import {t} from 'plugin-api/beta/client/services';
import {Icon} from 'plugin-api/beta/client/components/ui';
import * as notification from 'coral-admin/src/services/notification';

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

  postTag = async () => {
    try {
      await this.props.postTag();
      notification.success(t('talk-plugin-featured-comments.notify_self_featured', this.props.comment.user.username));
    }
    catch(err) {
      notification.showMutationErrors(err);
    }
  }

  render() {
    const {alreadyTagged, deleteTag} = this.props;

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
        onClick={this.postTag} >
        <Icon name="star_outline" className={cn(styles.tagIcon)} />
        {alreadyTagged ? t('talk-plugin-featured-comments.featured') : t('talk-plugin-featured-comments.feature')}
      </span>
    );
  }
}
