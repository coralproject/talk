import React from 'react';
import cn from 'classnames';
import styles from './Slot.css';
import {connect} from 'react-redux';
import {getSlotElements} from 'coral-framework/helpers/plugins';

function Slot ({fill, inline = false, className, plugin_config: config, defaultComponent: DefaultComponent, ...rest}) {
  let children = getSlotElements(fill, {...rest, config});
  if (children.length === 0 && DefaultComponent) {
    children = <DefaultComponent {...rest} />;
  }

  return (
    <div className={cn({[styles.inline]: inline, [styles.debug]: config.debug}, className)}>
      {children}
    </div>
  );
}

Slot.propTypes = {
  fill: React.PropTypes.string
};

const mapStateToProps = ({config: {plugin_config = {}}}) => ({plugin_config});

export default connect(mapStateToProps, null)(Slot);

