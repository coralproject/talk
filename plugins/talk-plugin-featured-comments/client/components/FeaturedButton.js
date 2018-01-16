import React from 'react';
import cn from 'classnames';
import styles from './FeaturedButton.css';
import { pluginName } from '../../package.json';
import { can } from 'plugin-api/beta/client/services';
import { Icon } from 'plugin-api/beta/client/components/ui';

const FeaturedButton = props => {
  const { alreadyTagged, deleteTag, postTag, user } = props;

  return can(user, 'MODERATE_COMMENTS') ? (
    <button
      className={cn([
        `${pluginName}-tag-button`,
        styles.button,
        { [styles.featured]: alreadyTagged },
      ])}
      onClick={alreadyTagged ? deleteTag : postTag}
    >
      {alreadyTagged ? (
        <Icon name="star" className={styles.icon} />
      ) : (
        <Icon name="star_border" className={styles.icon} />
      )}
    </button>
  ) : null;
};

export default FeaturedButton;
