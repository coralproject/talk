import React from 'react';
import cn from 'classnames';
import styles from './Slot.css';
import {connect} from 'react-redux';
import {getSlotElements} from 'coral-framework/helpers/plugins';

function Slot ({fill, inline = false, plugin_config: config, ...rest}) {
  return (
    <div className={cn({[styles.inline]: inline, [styles.debug]: config.debug})}>
      {getSlotElements(fill, {...rest, config}}
    </div>
  );
}

Slot.propTypes = {
  fill: React.PropTypes.string
};

const mapStateToProps = ({config: {plugin_config = {}}}) => ({plugin_config});

export default connect(mapStateToProps, null)(Slot);

