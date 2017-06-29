import React from 'react';
import cn from 'classnames';
import styles from './ViewingOptions.css';
import {Slot} from 'plugin-api/beta/client/components';
import {Icon} from 'plugin-api/beta/client/components/ui';
import {PLUGIN_NAME, DEFAULT_CONFIG} from '../constants';

const ViewingOptions = (props) => {
  const config = props.config || {};
  const pluginConfig = {...DEFAULT_CONFIG, ...(config && config[`${PLUGIN_NAME}`])};

  const toggleOpen = () => {
    if (!props.open) {
      props.openViewingOptions();
    } else {
      props.closeViewingOptions();
    }
  };

  if (!pluginConfig.enabled) {return (null);}

  return (
    <div className={cn([styles.root, 'coral-plugin-viewing-options'])}>
      <div>
        <a onClick={toggleOpen}>{(!props.title) ?  pluginConfig.title : props.title}
          {props.open ? <Icon name="arrow_drop_up"/> : <Icon name="arrow_drop_down"/>}
        </a>
      </div>
      {
        props.open ? (
          <div className={cn([styles.list, 'coral-plugin-viewing-options-list'])}>
            <ul>
              {
                React.Children.map(<Slot fill="viewingOptions" onClick={toggleOpen} />, (component) => {
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
