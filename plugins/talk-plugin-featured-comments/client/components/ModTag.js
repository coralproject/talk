import React from 'react';
import cn from 'classnames';
import styles from './ModTag.css';
import {t} from 'plugin-api/beta/client/services';

// import {isTagged} from 'plugin-api/beta/client/utils';
import {Icon} from 'plugin-api/beta/client/components/ui';

export default class Tag extends React.Component {
  render() {

    // isTagged(this.props.comment.tags, 'FEATURED')
    return(
      <span className={cn(styles.tag)}>
        <Icon name="star_outline" className={styles.tagIcon} />{t('talk-plugin-featured-comments.feature')}
      </span>
    );
  }
}
