import React from 'react';
import PropTypes from 'prop-types';
import styles from './ViewOptions.css';
import {Card} from 'coral-ui';
import cn from 'classnames';
import {SelectField, Option} from 'react-mdl-selectfield';
import t from 'coral-framework/services/i18n';

class ViewOptions extends React.Component {
  render() {

    const {
      selectSort,
      sort
    } = this.props;

    return (
      <Card className={cn(styles.viewOptions, 'talk-admin-moderation-view-options')}>
        <h2 className={cn(styles.headline, 'talk-admin-moderation-view-options-headline')}>
          View Options
        </h2>
        <div className={styles.viewOptionsContent}> 
          <ul className={styles.viewOptionsList}>
            <li className={styles.viewOptionsItem}>
              Sort Comments
              <SelectField
                className={styles.selectField}
                label="Sort"
                value={sort}
                onChange={(sort) => selectSort(sort)}>
                <Option value={'DESC'}>{t('modqueue.newest_first')}</Option>
                <Option value={'ASC'}>{t('modqueue.oldest_first')}</Option>
              </SelectField>
            </li>
          </ul>
        </div>
      </Card>
    );
  }
}

ViewOptions.propTypes = {
  selectSort: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired
};

export default ViewOptions;
