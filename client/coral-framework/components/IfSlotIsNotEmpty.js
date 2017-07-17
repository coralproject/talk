import React from 'react';
import {connect} from 'react-redux';
import {isSlotEmpty} from 'coral-framework/helpers/plugins';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';

function IfSlotIsNotEmpty({slot, className, reduxState, component: Component = 'div', children, ...rest}) {
  return (
    <Component className={className}>
      {!isSlotEmpty(slot, reduxState, rest) ? children : null}
    </Component>
  );
}

IfSlotIsNotEmpty.propTypes = {
  slot: PropTypes.string,
  className: PropTypes.string,
};

const mapStateToProps = (state) => ({
  reduxState: omit(state, 'apollo'),
});

export default connect(mapStateToProps, null)(IfSlotIsNotEmpty);

