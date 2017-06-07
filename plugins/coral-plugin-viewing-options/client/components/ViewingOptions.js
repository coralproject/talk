import React from 'react';
import cn from 'classnames';
import {Icon} from 'coral-ui';
import styles from './ViewingOptions.css';
import {Slot} from 'plugin-api/beta/client/components';

const ViewingOptions = (props) => {
  const toggleOpen = () => {
    if (!props.open) {
      props.openViewingOptions();
    } else {
      props.closeViewingOptions();
    }
  };
  return (
    <div className={cn([styles.viewingOptions, 'coral-plugin-viewing-options'])}>
      <div>
        <a onClick={toggleOpen}>Viewing Options
          {props.open ? <Icon name="arrow_drop_up"/> : <Icon name="arrow_drop_down"/>}
        </a>
      </div>
      {
        props.open ? (
          <div className={cn([styles.streamViewingOptionsList, 'coral-plugin-viewing-options-list'])}>
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
  );
};

export default ViewingOptions;
