import React from 'react';
import cn from 'classnames';
import styles from './Slot.css';
import {connect} from 'react-redux';
import {getSlotElements} from 'coral-framework/helpers/plugins';

function Slot ({fill, inline = false, config: {plugin_config = {}}, ...rest}) {
  const {debug} = plugin_config;
  return (
    <div className={cn({[styles.inline]: inline, [styles.debug]: debug})}>
      {getSlotElements(fill, rest)}
    </div>
  );
}

Slot.propTypes = {
  fill: React.PropTypes.string
};

const mapStateToProps = ({config}) => ({config});

export default connect(mapStateToProps, null)(Slot);

