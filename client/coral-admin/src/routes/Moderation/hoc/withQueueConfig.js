import React from 'react';
import hoistStatics from 'recompose/hoistStatics';
import PropTypes from 'prop-types';

/**
 * WithQueueConfig takes a `queueConfig` parameter that is
 * passed down as a prop enriched with queue config data from plugins.
 */
export default queueConfig =>
  hoistStatics(WrappedComponent => {
    class WithQueueConfig extends React.Component {
      static contextTypes = {
        plugins: PropTypes.object,
      };

      pluginsConfig = this.context.plugins.getModQueueConfigs();

      render() {
        return (
          <WrappedComponent
            {...this.props}
            queueConfig={{ ...queueConfig, ...this.pluginsConfig }}
          />
        );
      }
    }

    return WithQueueConfig;
  });
