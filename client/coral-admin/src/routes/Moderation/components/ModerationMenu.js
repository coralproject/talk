import React from 'react';
import PropTypes from 'prop-types';
import CountBadge from '../../../components/CountBadge';
import styles from './ModerationMenu.css';
import { Icon } from 'coral-ui';
import { Link } from 'react-router';
import cn from 'classnames';

const ModerationMenu = ({ asset = {}, items, getModPath, activeTab }) => {
  return (
    <div className="mdl-tabs">
      <div
        className={cn(
          'mdl-tabs__tab-bar',
          styles.tabBar,
          'talk-admin-moderation-menu-tabbar'
        )}
      >
        <div
          className={cn(
            styles.tabBarContainer,
            'talk-admin-moderation-menu-tabbar-container'
          )}
        >
          {items.map(queue => (
            <Link
              key={queue.key}
              to={getModPath(queue.key, asset.id)}
              className={cn('mdl-tabs__tab', styles.tab, {
                [styles.active]: activeTab === queue.key,
              })}
              activeClassName={styles.active}
            >
              <Icon name={queue.icon} className={styles.tabIcon} /> {queue.name}{' '}
              <CountBadge count={queue.count} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

ModerationMenu.propTypes = {
  items: PropTypes.array.isRequired,
  asset: PropTypes.shape({
    id: PropTypes.string,
  }),
  getModPath: PropTypes.func.isRequired,
  activeTab: PropTypes.string.isRequired,
};

export default ModerationMenu;
