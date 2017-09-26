import React from 'react';
import PropTypes from 'prop-types';
import CountBadge from '../../../components/CountBadge';
import styles from './ModerationMenu.css';
import {SelectField, Option} from 'react-mdl-selectfield';
import {Icon} from 'coral-ui';
import {Link} from 'react-router';
import cn from 'classnames';

import t from 'coral-framework/services/i18n';

const ModerationMenu = ({
  asset = {},
  items,
  selectSort,
  sort,
  getModPath,
  activeTab
}) => {
  return (
    <div className="mdl-tabs">
      <div className={`mdl-tabs__tab-bar ${styles.tabBar}`}>
        <div className={styles.tabBarPadding} />
        <div>
          {items.map((queue) =>
            <Link
              key={queue.key}
              to={getModPath(queue.key, asset.id)}
              className={cn('mdl-tabs__tab', styles.tab, {[styles.active]: activeTab === queue.key})}
              activeClassName={styles.active}>
              <Icon name={queue.icon} className={styles.tabIcon} /> {queue.name} <CountBadge count={queue.count} />
            </Link>
          )}
        </div>
        <SelectField
          className={styles.selectField}
          label="Sort"
          value={sort}
          onChange={(sort) => selectSort(sort)}>
          <Option value={'DESC'}>{t('modqueue.newest_first')}</Option>
          <Option value={'ASC'}>{t('modqueue.oldest_first')}</Option>
        </SelectField>
      </div>
    </div>
  );
};

ModerationMenu.propTypes = {
  items: PropTypes.array.isRequired,
  asset: PropTypes.shape({
    id: PropTypes.string
  }),
  selectSort: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
  getModPath: PropTypes.func.isRequired,
  activeTab: PropTypes.string.isRequired,
};

export default ModerationMenu;
