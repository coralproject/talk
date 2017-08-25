import React from 'react';
import cn from 'classnames';
import styles from './ViewingOptions.css';
import {t} from 'plugin-api/beta/client/services';
import {Icon} from 'plugin-api/beta/client/components/ui';
import {ClickOutside} from 'plugin-api/beta/client/components';
import {capitalize} from 'plugin-api/beta/client/utils';
import Category from './Category';

class ViewingOptions extends React.Component {

  categories = {
    sort: t('talk-plugin-viewing-options.sort'),
    filter: t('talk-plugin-viewing-options.filter'),
  };

  toggleOpen = () => {
    const {open, openMenu, closeMenu} = this.props;
    if (!open) {
      openMenu();
    } else {
      closeMenu();
    }
  };

  handleClickOutside = () => {
    const {open, closeMenu} = this.props;
    if (open) {
      closeMenu();
    }
  };

  render() {
    const {open} = this.props;
    return (
      <ClickOutside onClickOutside={this.handleClickOutside}>
        <div className={cn([styles.root, 'talk-plugin-viewing-options'])}>
          <div>
            <button className={styles.button} onClick={this.toggleOpen}>
              <Icon className={styles.filterIcon} name="filter_list" />
              <span className={styles.filterText}>{t('talk-plugin-viewing-options.viewing_options')}</span>
              {open ? <Icon name="arrow_drop_up" className={styles.icon}/> : <Icon name="arrow_drop_down" className={styles.icon}/>}
            </button>
          </div>
          {
            open ? (
              <div className={cn([styles.menu, 'talk-plugin-viewing-options-menu'])}>
                {
                  Object.keys(this.categories).map((category) =>
                    <Category key={category} slot={`viewingOptions${capitalize(category)}`} title={this.categories[category]} />
                  )
                }
              </div>
            ) : null
          }
        </div>
      </ClickOutside>
    );
  }
}

export default ViewingOptions;
