import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './Menu.css';
import { capitalize } from 'plugin-api/beta/client/utils';
import { IfSlotIsNotEmpty } from 'plugin-api/beta/client/components';
import Category from './Category';
import { t } from 'plugin-api/beta/client/services';

class Menu extends React.Component {
  categories = {
    sort: t('talk-plugin-viewing-options.sort'),
    filter: t('talk-plugin-viewing-options.filter'),
  };

  render() {
    const { slotPassthrough } = this.props;
    return (
      <div className={cn([styles.menu, 'talk-plugin-viewing-options-menu'])}>
        {Object.keys(this.categories).map(category => (
          <IfSlotIsNotEmpty
            slot={`viewingOptions${capitalize(category)}`}
            key={category}
            passthrough={slotPassthrough}
          >
            <Category
              slot={`viewingOptions${capitalize(category)}`}
              title={this.categories[category]}
              slotPassthrough={slotPassthrough}
            />
          </IfSlotIsNotEmpty>
        ))}
      </div>
    );
  }
}

Menu.propTypes = {
  slotPassthrough: PropTypes.object.isRequired,
};

export default Menu;
