import React, { Children } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getShallowChanges } from 'coral-framework/utils';

class IfSlotIsEmpty extends React.Component {
  static contextTypes = {
    plugins: PropTypes.object,
  };

  shouldComponentUpdate(next) {
    // Prevent Slot from rerendering when only reduxState has changed and
    // it does not result in a change.
    const changes = getShallowChanges(this.props, next);
    if (changes.length === 1 && changes[0] === 'reduxState') {
      return this.isSlotEmpty(this.props) !== this.isSlotEmpty(next);
    }

    // Prevent Slot from rerendering when no props has shallowly changed.
    return changes.length !== 0;
  }

  isSlotEmpty(props = this.props) {
    const {
      slot,
      className: _a,
      reduxState,
      component: _b = 'div',
      children: _c,
      queryData,
      ...rest
    } = props;
    const slots = Array.isArray(slot) ? slot : [slot];
    return slots.every(slot =>
      this.context.plugins.isSlotEmpty(slot, reduxState, rest, queryData)
    );
  }

  render() {
    const { children } = this.props;
    return this.isSlotEmpty() ? Children.only(children) : null;
  }
}

IfSlotIsEmpty.propTypes = {
  slot: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};

const mapStateToProps = state => ({
  reduxState: state,
});

export default connect(mapStateToProps, null)(IfSlotIsEmpty);
