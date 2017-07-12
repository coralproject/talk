import React from 'react';
import cn from 'classnames';
import styles from './ViewingOptions.css';
import {Slot, ClickOutside} from 'plugin-api/beta/client/components';
import {Icon} from 'plugin-api/beta/client/components/ui';

const ViewingOptions = (props) => {
  const toggleOpen = () => {
    if (!props.open) {
      props.openViewingOptions();
    } else {
      props.closeViewingOptions();
    }
  };

  const handleClickOutside = () => {
    if (props.open) {
      props.closeViewingOptions();
    }
  };

  return (
    <ClickOutside onClickOutside={handleClickOutside}>
      <div className={cn([styles.root, 'coral-plugin-viewing-options'])}>
        <div>
          <button className={styles.button} onClick={toggleOpen}>Viewing Options
            {props.open ? <Icon name="arrow_drop_up"/> : <Icon name="arrow_drop_down"/>}
          </button>
        </div>
        {
          props.open ? (
            <div className={cn([styles.list, 'coral-plugin-viewing-options-list'])}>
              <ul>
                {
                  React.Children.map(<Slot fill="viewingOptions" />, (component) => {
                    return React.createElement('li', {
                      className: 'coral-plugin-viewing-options-item'
                    }, component);
                  })
                }
              </ul>
            </div>
          ) : null
        }
      </div>
    </ClickOutside>
  );
};

export default ViewingOptions;
