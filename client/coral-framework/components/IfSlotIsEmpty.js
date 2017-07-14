import React from 'react';
import {connect} from 'react-redux';
import {isSlotEmpty} from 'coral-framework/helpers/plugins';
import PropTypes from 'prop-types';

function IfSlotIsEmpty({slot, className, pluginConfig, component: Component = 'div', children, ...rest}) {
  return (
    <Component className={className}>
      {isSlotEmpty(slot, pluginConfig, rest) ? children : null}
    </Component>
  );
}

IfSlotIsEmpty.propTypes = {
  slot: PropTypes.string,
  className: PropTypes.string,
};

const mapStateToProps = (state) => ({pluginConfig: state.config.plugin_config});

export default connect(mapStateToProps, null)(IfSlotIsEmpty);

