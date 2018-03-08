import React from 'react';
import hoistStatics from 'recompose/hoistStatics';
import PropTypes from 'prop-types';

/**
 * WithEnumValues inject given property name for given enum.
 */
export default (enumName, propName) =>
  hoistStatics(WrappedComponent => {
    class WithEnumValues extends React.Component {
      static contextTypes = {
        introspection: PropTypes.object,
      };

      render() {
        const inject = {
          [propName]: this.context.introspection.getEnumValues(enumName),
        };
        return <WrappedComponent {...this.props} {...inject} />;
      }
    }

    return WithEnumValues;
  });
