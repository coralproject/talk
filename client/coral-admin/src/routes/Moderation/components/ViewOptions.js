import React from 'react';
import PropTypes from 'prop-types';
import styles from './ViewOptions.css';
import cn from 'classnames';
import t from 'coral-framework/services/i18n';
import { Card, Dropdown, Option } from 'coral-ui';

class ViewOptions extends React.Component {
  render() {
    const { selectSort, sort } = this.props;

    return (
      <Card
        className={cn(styles.viewOptions, 'talk-admin-moderation-view-options')}
      >
        <h2
          className={cn(
            styles.headline,
            'talk-admin-moderation-view-options-headline'
          )}
        >
          {t('admin_sidebar.view_options')}
        </h2>
        <div className={styles.viewOptionsContent}>
          <ul className={styles.viewOptionsList}>
            <li className={styles.viewOptionsItem}>
              {t('admin_sidebar.sort_comments')}
              <Dropdown
                containerClassName={styles.dropdownContainer}
                toggleClassName={styles.dropdownToggle}
                toggleOpenClassName={styles.dropdownToggleOpen}
                placeholder={t('modqueue.sort')}
                value={sort}
                onChange={sort => selectSort(sort)}
              >
                <Option value={'DESC'} label={t('modqueue.newest_first')} />
                <Option value={'ASC'} label={t('modqueue.oldest_first')} />
              </Dropdown>
            </li>
          </ul>
        </div>
      </Card>
    );
  }
}

ViewOptions.propTypes = {
  selectSort: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
};

export default ViewOptions;
