import React from 'react';
import cn from 'classnames';
import styles from './Slot.css';
import {connect} from 'react-redux';
import {getSlotElements} from 'coral-framework/helpers/plugins';
import omit from 'lodash/omit';

function Slot ({fill, inline = false, className, reduxState, defaultComponent: DefaultComponent, ...rest}) {
  let children = getSlotElements(fill, reduxState, rest);
  const pluginConfig = reduxState.config.pluginConfig || {};
  if (children.length === 0 && DefaultComponent) {
    children = <DefaultComponent {...rest} />;
  }

  return (
    <div className={cn({[styles.inline]: inline, [styles.debug]: pluginConfig.debug}, className)}>
      {children}
    </div>
  );
}

Slot.propTypes = {
  fill: React.PropTypes.string
};

const mapStateToProps = (state) => ({
  reduxState: omit(state, 'apollo'),
});

export default connect(mapStateToProps, null)(Slot);

